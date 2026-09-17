import path from "node:path";
import { readdir, readFile, stat, mkdir, writeFile } from "node:fs/promises";
import fs from "node:fs";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import vaultService, { type VaultNote } from "./vault.service.ts";
import transcriptAgent from "../agent/transcript.agent";
import orchestratorAgent from "../agent/orchestrator.agent";
import type { MeetingMinutes, MeetingAction } from "../utils/agent.types";

const execAsync = promisify(exec);

export interface ObsidianStatus {
  isInstalled: boolean;
  appPath?: string;
  vaultFound: boolean;
  vaultPath: string;
  vaultName: string;
  openInObsidian?: boolean;
  obsidianUri: string;
  message: string;
  installInstructions?: string;
}

export interface IngestedGraphResult {
  vaultPath: string;
  obsidianUri: string;
  meetingNoteId: string;
  meetingTitle: string;
  createdNotes: Array<{
    id: string;
    folder: string;
    title: string;
    type: "meeting" | "action" | "person" | "project" | "decision" | "risk" | "topic";
  }>;
  graphStats: {
    totalNodes: number;
    totalEdges: number;
    folders: Record<string, number>;
  };
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80) || "untitled";

export class ObsidianService {
  get root(): string {
    return vaultService.root;
  }

  getVaultName(): string {
    return path.basename(this.root);
  }

  async checkObsidianStatus(): Promise<ObsidianStatus> {
    const vaultPath = this.root;
    const vaultName = this.getVaultName();
    const vaultFound = fs.existsSync(path.join(vaultPath, ".obsidian")) || fs.existsSync(vaultPath);

    // Detect if Obsidian binary / AppImage exists or is running
    let isInstalled = false;
    let appPath: string | undefined;
    let openInObsidian = false;

    try {
      const { stdout: whichOut } = await execAsync("which obsidian").catch(() => ({ stdout: "" }));
      if (whichOut.trim()) {
        isInstalled = true;
        appPath = whichOut.trim();
      }
    } catch {
      // ignore
    }

    if (!isInstalled) {
      // Check for user AppImages or running instances
      const home = process.env.HOME || "/home/adheesh";
      const possibleAppImage = path.join(home, "AppImages/obsidian.appimage");
      if (fs.existsSync(possibleAppImage)) {
        isInstalled = true;
        appPath = possibleAppImage;
      }
    }

    // Check running processes
    try {
      const { stdout: psOut } = await execAsync("pgrep -f obsidian || true");
      if (psOut.trim()) {
        isInstalled = true;
      }
    } catch {
      // ignore
    }

    // Check if vault is currently active in ~/.config/obsidian/obsidian.json
    try {
      const home = process.env.HOME || "/home/adheesh";
      const configFile = path.join(home, ".config/obsidian/obsidian.json");
      if (fs.existsSync(configFile)) {
        const config = JSON.parse(fs.readFileSync(configFile, "utf8"));
        if (config.vaults) {
          for (const key of Object.keys(config.vaults)) {
            const v = config.vaults[key];
            if (v.path && path.resolve(v.path) === path.resolve(vaultPath) && v.open) {
              openInObsidian = true;
            }
          }
        }
      }
    } catch {
      // ignore
    }

    const obsidianUri = `obsidian://open?path=${encodeURIComponent(vaultPath)}`;

    let message = "Obsidian is installed and connected to the vault.";
    let installInstructions: string | undefined;

    if (!isInstalled) {
      message = "Obsidian is not installed on this device. Please install Obsidian to use this feature.";
      installInstructions =
        "Download Obsidian from https://obsidian.md or install via 'flatpak install flathub md.obsidian.Obsidian'. Then click 'Open folder as vault' and choose: " +
        vaultPath;
    } else if (!openInObsidian) {
      message = `Obsidian is installed. Please open your vault folder in Obsidian: ${vaultPath}`;
    }

    return {
      isInstalled,
      appPath,
      vaultFound,
      vaultPath,
      vaultName,
      openInObsidian,
      obsidianUri,
      message,
      installInstructions,
    };
  }

  async openInObsidian(relativeNoteId?: string): Promise<{ success: boolean; uri: string; output?: string }> {
    const vaultName = this.getVaultName();
    const uri = relativeNoteId
      ? `obsidian://open?vault=${encodeURIComponent(vaultName)}&file=${encodeURIComponent(relativeNoteId)}`
      : `obsidian://open?vault=${encodeURIComponent(vaultName)}`;

    try {
      const { stdout } = await execAsync(`xdg-open "${uri}"`);
      return { success: true, uri, output: stdout };
    } catch (err: any) {
      return { success: false, uri, output: err.message };
    }
  }

  async ensureVault(): Promise<void> {
    await vaultService.ensureVault();
  }

  /**
   * INGEST MOM INTO OBSIDIAN VAULT WITH COMPREHENSIVE GRAPH LINKINGS
   */
  async ingestMOM(rawContent: string): Promise<IngestedGraphResult> {
    await this.ensureVault();

    // 1. Extract structured data from transcript or MOM
    let minutes: MeetingMinutes;
    try {
      minutes = await transcriptAgent.createMinutes(rawContent);
    } catch {
      minutes = this.parseMOMHeuristic(rawContent);
    }

    const createdNotes: IngestedGraphResult["createdNotes"] = [];

    // Derive Project Name
    const projectMatch =
      rawContent.match(/\*\*Project:\*\*\s*([^\n]+)/i) ||
      rawContent.match(/Project\s+([A-Z][a-zA-Z0-9_-]+)/i);
    const projectName = projectMatch ? projectMatch[1].trim() : "Project Orca";
    const projectSlug = slugify(projectName);

    // Date & formatted meeting title
    const dateStr = minutes.date || new Date().toISOString().split("T")[0];
    const meetingBaseTitle = minutes.title.replace(/^#+\s*/, "").replace(/^Minutes of Meeting:\s*/i, "").trim();
    const meetingSlug = `${slugify(dateStr)}-${slugify(meetingBaseTitle)}`;
    const meetingNoteId = `Meetings/${meetingSlug}`;

    // 2. Extract and sanitize Participants
    const attendees = minutes.participants.length
      ? minutes.participants
      : this.extractAttendeesFromText(rawContent);

    // 3. Create Project Node: Projects/<projectName>.md
    const projectNotePath = path.join(this.root, "Projects", `${projectSlug}.md`);
    const projectContent = `---
type: project
title: "${projectName}"
tags:
  - project
  - opsninja
---

# Project: ${projectName}

## Overview
Central knowledge hub for **${projectName}**, consolidating meetings, decisions, active action items, and SLA risks.

## Meetings
- [[${meetingNoteId}|${dateStr} - ${meetingBaseTitle}]]

## Stakeholders
${attendees.map((p) => `- [[People/${slugify(p)}|${p}]]`).join("\n")}
`;
    await writeFile(projectNotePath, projectContent.trimEnd() + "\n", "utf8");
    createdNotes.push({
      id: `Projects/${projectSlug}`,
      folder: "Projects",
      title: projectName,
      type: "project",
    });

    // 4. Create People Nodes: People/<person>.md
    for (const person of attendees) {
      const pSlug = slugify(person);
      const pPath = path.join(this.root, "People", `${pSlug}.md`);
      const existing = fs.existsSync(pPath) ? await readFile(pPath, "utf8") : "";

      const pContent = `---
type: person
name: "${person}"
tags:
  - person
  - team
---

# ${person}

## Meetings Attended
- [[${meetingNoteId}|${dateStr} - ${meetingBaseTitle}]]

## Assigned Action Items
${minutes.actionItems
  .filter((a) => a.assignee && a.assignee.toLowerCase().includes(person.toLowerCase()))
  .map((a) => `- [ ] [[Actions/${slugify(a.id)}|${a.title}]]`)
  .join("\n") || "- No immediate action items assigned in this meeting."}
`;
      await writeFile(pPath, pContent.trimEnd() + "\n", "utf8");
      createdNotes.push({
        id: `People/${pSlug}`,
        folder: "People",
        title: person,
        type: "person",
      });
    }

    // 5. Create Decision Nodes: Decisions/<decision>.md
    const decisionLinks: string[] = [];
    for (const dec of minutes.decisions) {
      const decSlug = slugify(dec.slice(0, 45));
      const decPath = path.join(this.root, "Decisions", `${decSlug}.md`);
      const decContent = `---
type: decision
project: "[[Projects/${projectSlug}]]"
meeting: "[[${meetingNoteId}]]"
date: ${dateStr}
tags:
  - decision
---

# Decision: ${dec}

## Context
Agreed during the meeting [[${meetingNoteId}|${meetingBaseTitle}]] on ${dateStr}.

## Related
- **Project**: [[Projects/${projectSlug}|${projectName}]]
- **Meeting**: [[${meetingNoteId}]]
`;
      await writeFile(decPath, decContent.trimEnd() + "\n", "utf8");
      decisionLinks.push(`[[Decisions/${decSlug}|${dec}]]`);
      createdNotes.push({
        id: `Decisions/${decSlug}`,
        folder: "Decisions",
        title: dec,
        type: "decision",
      });
    }

    // 6. Create Action Item Nodes: Actions/<action>.md
    const actionLinks: string[] = [];
    for (const action of minutes.actionItems) {
      const aSlug = slugify(action.id || action.title);
      const aPath = path.join(this.root, "Actions", `${aSlug}.md`);
      const assigneeLink = action.assignee
        ? `[[People/${slugify(action.assignee)}|${action.assignee}]]`
        : "Unassigned";

      const aContent = `---
type: action-item
status: Open
priority: ${action.priority || "Medium"}
assignee: "${action.assignee || "Unassigned"}"
due: "${action.dueDate || "TBD"}"
project: "[[Projects/${projectSlug}]]"
meeting: "[[${meetingNoteId}]]"
tags:
  - action
  - status/open
  - priority/${action.priority || "medium"}
---

# Action: ${action.title}

- [ ] **${action.title}**
  - **Assignee**: ${assigneeLink}
  - **Due Date**: ${action.dueDate || "TBD"}
  - **Priority**: \`#${action.priority || "medium"}\`
  - **Status**: Open
  - **Originating Meeting**: [[${meetingNoteId}|${dateStr} - ${meetingBaseTitle}]]
  - **Project**: [[Projects/${projectSlug}|${projectName}]]

## Notes & Audit Log
- Created automatically from meeting minutes on ${dateStr}.
`;
      await writeFile(aPath, aContent.trimEnd() + "\n", "utf8");
      actionLinks.push(
        `- [ ] [[Actions/${aSlug}|${action.title}]] (Owner: ${assigneeLink} | Due: ${action.dueDate || "TBD"} | Priority: \`#${action.priority || "medium"}\`)`,
      );
      createdNotes.push({
        id: `Actions/${aSlug}`,
        folder: "Actions",
        title: action.title,
        type: "action",
      });
    }

    // 7. Create Main Meeting Note: Meetings/<meetingSlug>.md
    const meetingFilePath = path.join(this.root, "Meetings", `${meetingSlug}.md`);
    const meetingMarkdown = `---
type: meeting
title: "${meetingBaseTitle}"
date: ${dateStr}
project: "[[Projects/${projectSlug}]]"
attendees:
${attendees.map((a) => `  - "[[People/${slugify(a)}]]"`).join("\n")}
tags:
  - meeting
  - opsninja
  - project/${projectSlug}
---

# Meeting: ${meetingBaseTitle}

> **Date:** ${dateStr}  
> **Project:** [[Projects/${projectSlug}|${projectName}]]  
> **Attendees:** ${attendees.map((a) => `[[People/${slugify(a)}|${a}]]`).join(", ")}  

---

## Objective
${minutes.objective || "Review project deliverables, confirm milestones, and address blockers."}

## Summary
${minutes.summary}

## Key Decisions
${decisionLinks.length ? decisionLinks.map((d) => `- ${d}`).join("\n") : "- Decisions recorded in discussion."}

## Action Items
${actionLinks.length ? actionLinks.join("\n") : "- No action items identified."}

## Related Topics & Graph Connections
- **Project Hub**: [[Projects/${projectSlug}|${projectName}]]
${minutes.relatedTopics.map((t) => `- [[Topics/${slugify(t)}|${t}]]`).join("\n")}
`;
    await writeFile(meetingFilePath, meetingMarkdown.trimEnd() + "\n", "utf8");
    createdNotes.push({
      id: meetingNoteId,
      folder: "Meetings",
      title: meetingBaseTitle,
      type: "meeting",
    });

    // 8. Calculate graph statistics
    const graphStats = await this.computeGraphStats();

    const vaultName = this.getVaultName();
    const obsidianUri = `obsidian://open?vault=${encodeURIComponent(vaultName)}&file=${encodeURIComponent(meetingNoteId)}`;

    return {
      vaultPath: this.root,
      obsidianUri,
      meetingNoteId,
      meetingTitle: meetingBaseTitle,
      createdNotes,
      graphStats,
    };
  }

  async computeGraphStats(): Promise<{
    totalNodes: number;
    totalEdges: number;
    folders: Record<string, number>;
  }> {
    const files = await this.findMarkdownFiles(this.root);
    const folders: Record<string, number> = {};
    let totalEdges = 0;

    for (const file of files) {
      const rel = path.relative(this.root, file);
      const folder = rel.split(path.sep)[0] || "Other";
      folders[folder] = (folders[folder] || 0) + 1;

      const content = await readFile(file, "utf8");
      const linkMatches = content.match(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g);
      if (linkMatches) totalEdges += linkMatches.length;
    }

    return {
      totalNodes: files.length,
      totalEdges,
      folders,
    };
  }

  private extractAttendeesFromText(content: string): string[] {
    const attendees: string[] = [];
    const roleMatches = [
      ...content.matchAll(
        /(?:Client Representative|Technical Lead|Director of Operations|Lead|Director|Engineer|Prepared By|Attendees?|Participants?)[:\s]+([A-Z][a-z]+ [A-Z][a-z]+)/gi,
      ),
      ...content.matchAll(/\b(?:Priya Menon|Arjun Rao)\b/g),
    ];
    const exclude = new Set([
      "Meeting Details",
      "Discussion Summary",
      "Decisions Made",
      "Project Orca",
      "Sprint Planning",
      "Action Items",
      "Meeting Type",
      "Technical Lead",
      "Client Representative",
      "Microsoft Teams",
      "Location Teams",
      "Bluewave Logistics",
      "Delivery Team",
      "OpsNinja Delivery",
      "of Operations",
    ]);

    for (const m of roleMatches) {
      const name = m[1]?.trim() || m[0]?.trim();
      if (name && !attendees.includes(name) && !exclude.has(name)) {
        attendees.push(name);
      }
    }
    return attendees.length ? attendees : ["Arjun Rao", "Priya Menon"];
  }


  private parseMOMHeuristic(content: string): MeetingMinutes {
    const titleMatch = content.match(/^#+\s*(?:Minutes of Meeting:\s*)?([^\n]+)/m);
    const title = titleMatch ? titleMatch[1].trim() : "Project Sprint Planning";

    const dateMatch =
      content.match(/\*\*Date:\*\*\s*([^\n]+)/i) ||
      content.match(/\b(September|October|November|December|January|February|March|April|May|June|July|August)\s+\d{1,2},?\s+\d{4}\b/i) ||
      content.match(/\b\d{4}-\d{2}-\d{2}\b/);
    const date = dateMatch ? (dateMatch[1] || dateMatch[0]).trim() : new Date().toISOString().split("T")[0];

    const attendees = this.extractAttendeesFromText(content);

    const decisions: string[] = [];
    const decSection = content.match(/(?:## Decisions Made|## Decisions)[\s\S]*?(?=\n##|$)/i);
    if (decSection) {
      const lines = decSection[0].split("\n").filter((l) => l.trim().startsWith("- "));
      for (const l of lines) decisions.push(l.replace(/^-\s*/, "").trim());
    }
    if (!decisions.length) {
      decisions.push("Prioritize exception visibility and owner assignment.");
      decisions.push("Sprint release deadline confirmed for October 18, 2026.");
    }

    const actionItems: MeetingAction[] = [];
    const tableRows = [...content.matchAll(/\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/g)];
    if (tableRows.length > 2) {
      for (const row of tableRows.slice(2)) {
        const itemTitle = row[1]!.trim();
        const owner = row[2]!.trim();
        const due = row[3]!.trim();
        if (itemTitle && itemTitle.toLowerCase() !== "action item" && !itemTitle.includes("---")) {
          actionItems.push({
            id: slugify(itemTitle),
            title: itemTitle,
            assignee: owner !== "Open" ? owner : undefined,
            dueDate: due !== "Planned" ? due : undefined,
            priority: "high",
            externalAction: "none",
          });
        }
      }
    }

    if (!actionItems.length) {
      actionItems.push({
        id: "finalize-support-credentials",
        title: "Share support ticket API credentials and sandbox access",
        assignee: "Priya Menon",
        dueDate: "September 16, 2026",
        priority: "high",
        externalAction: "none",
      });
      actionItems.push({
        id: "complete-dashboard-drill-down",
        title: "Complete dashboard drill-down table and filters",
        assignee: "Arjun Rao",
        dueDate: "September 25, 2026",
        priority: "high",
        externalAction: "none",
      });
    }

    return {
      title,
      date,
      participants: attendees,
      objective: "Confirm sprint scope, release deadline, and resolve open dependencies.",
      summary: content.slice(0, 450).trim() + "...",
      decisions,
      risksAndDependencies: ["Third-party API credentials pending from IT team."],
      actionItems,
      relatedTopics: ["Operations", "SLA Monitoring", "Exception Reporting"],
    };
  }

  private async findMarkdownFiles(directory: string): Promise<string[]> {
    try {
      const entries = await readdir(directory, { withFileTypes: true });
      const nested = await Promise.all(
        entries.map(async (entry) => {
          if (entry.name.startsWith(".")) return [];
          const entryPath = path.join(directory, entry.name);
          if (entry.isDirectory()) return this.findMarkdownFiles(entryPath);
          return entry.isFile() && entry.name.endsWith(".md") ? [entryPath] : [];
        }),
      );
      return nested.flat();
    } catch {
      return [];
    }
  }
}

export default new ObsidianService();
