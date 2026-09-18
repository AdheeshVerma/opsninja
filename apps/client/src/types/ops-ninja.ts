export type IntegrationTarget = "jira" | "slack" | "none";

export type ActionItem = {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  dueDate?: string;
  priority: "low" | "medium" | "high" | "urgent";
  externalAction: IntegrationTarget;
  target?: string;
  status: "proposed" | "in_progress" | "complete";
};

export type StructuredMeetingNote = {
  id: string;
  title: string;
  date: string;
  participants: string[];
  objective: string;
  summary: string;
  decisions: string[];
  risksAndDependencies: string[];
  actionItems: ActionItem[];
  followUp: { date: string; purpose: string };
  relatedTopics: string[];
};

export type ActionProposal = {
  id: string;
  actionNoteId: string;
  type: "jira" | "slack";
  title: string;
  description?: string;
  target: string;
  assignee?: string;
  priority: ActionItem["priority"];
  sourceMeeting: string;
  status: "pending" | "approved" | "rejected";
};

export type GraphNode = {
  id: string;
  label: string;
  type: "meeting" | "action" | "person" | "project" | "jira" | "slack" | "note";
  x: number;
  y: number;
};

export const meeting: StructuredMeetingNote = {
  id: "Meetings/2026-09-12-project-orca-sprint-planning",
  title: "Project Orca sprint planning",
  date: "Sep 12, 2026 · 10:30 AM IST",
  participants: ["Priya Menon", "Arjun Rao", "Maya Chen", "Diego Alvarez"],
  objective: "Align on the first operationally useful release, its dependencies, and the client review plan.",
  summary: "Bluewave confirmed an October 18 release target for the operations intelligence dashboard. The team will prioritize shipment exceptions, ownership workflows, and daily reporting over advanced analytics. A demo build is due October 11, contingent on support-ticket API credentials and final SLA rules.",
  decisions: ["Prioritize exception visibility, ownership assignment, and daily reporting for the first release.", "Move predictive delay scoring and advanced trend analytics to a later release.", "Keep the October 18 release deadline and share a demo build by October 11."],
  risksAndDependencies: ["Bluewave IT has not delivered support-ticket API credentials; ticket correlation may slip.", "The one-week UAT window leaves little room for late feedback before release."],
  actionItems: [
    { id: "share-ticket-api-credentials", title: "Share support ticket API credentials and sandbox access", description: "Request credentials from Bluewave IT so ticket correlation remains in scope.", assignee: "Priya Menon", dueDate: "Sep 16", priority: "urgent", externalAction: "slack", target: "#bluewave-delivery", status: "proposed" },
    { id: "complete-dashboard-drilldown", title: "Complete dashboard drill-down table and filters", assignee: "Arjun Rao", dueDate: "Sep 25", priority: "high", externalAction: "jira", target: "ORCA", status: "in_progress" },
    { id: "prepare-demo-build", title: "Prepare demo build for client review", assignee: "Arjun Rao", dueDate: "Oct 11", priority: "high", externalAction: "jira", target: "ORCA", status: "proposed" },
  ],
  followUp: { date: "Sep 19, 2026 · 10:30 AM IST", purpose: "Sprint checkpoint for credentials, dashboard progress, and SLA rules." },
  relatedTopics: ["Project Orca", "SLA rules", "Bluewave Logistics"],
};

export const proposals: ActionProposal[] = [
  { id: "proposal-jira-01", actionNoteId: "Actions/complete-dashboard-drilldown", type: "jira", title: "Complete dashboard drill-down table and filters", description: "Build filtering by shipment ID, region, owner, and status for the Project Orca operations dashboard.", target: "ORCA", assignee: "Arjun Rao", priority: "high", sourceMeeting: meeting.title, status: "pending" },
  { id: "proposal-slack-01", actionNoteId: "Actions/share-ticket-api-credentials", type: "slack", title: "Request support-ticket API credentials", description: "Hi Priya, can Bluewave IT share sandbox access and the final support-ticket API credentials by September 16? This keeps ticket correlation in the first release.", target: "#bluewave-delivery", assignee: "Priya Menon", priority: "urgent", sourceMeeting: meeting.title, status: "pending" },
];

export const graphNodes: GraphNode[] = [
  { id: "orca", label: "Project Orca", type: "project", x: 49, y: 44 }, { id: "meeting", label: "Sprint planning", type: "meeting", x: 29, y: 29 }, { id: "priya", label: "Priya Menon", type: "person", x: 15, y: 60 }, { id: "arjun", label: "Arjun Rao", type: "person", x: 77, y: 26 }, { id: "credentials", label: "API credentials", type: "action", x: 32, y: 76 }, { id: "drilldown", label: "Dashboard filters", type: "action", x: 70, y: 67 }, { id: "jira", label: "ORCA-184", type: "jira", x: 88, y: 68 }, { id: "slack", label: "#bluewave-delivery", type: "slack", x: 10, y: 30 }, { id: "vault", label: "Obsidian / Meetings", type: "note", x: 53, y: 87 },
];
