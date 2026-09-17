# Minutes of Meeting: Project Orca Sprint Planning

## Meeting Details

**Project:** Orca  
**Meeting Type:** Client and Technical Lead Sprint Planning Discussion  
**Date:** September 12, 2026  
**Time:** 10:30 AM - 11:25 AM IST  
**Location:** Microsoft Teams  
**Client Representative:** Priya Menon, Director of Operations, Bluewave Logistics  
**Technical Lead:** Arjun Rao, Tech Lead, OpsNinja Delivery Team  
**Prepared By:** OpsNinja Delivery Team

## Objective

The meeting was held to align on the current status of Project Orca, confirm the delivery deadline, review sprint deliverables, clarify open dependencies, and schedule the next follow-up meeting for sprint progress review.

## Project Context

Project Orca is focused on building an operations intelligence dashboard for Bluewave Logistics. The platform will consolidate shipment exceptions, SLA risks, regional performance metrics, and support ticket signals into one view for operations managers. The first release is intended to support the South and West India logistics teams before a wider rollout.

## Discussion Summary

Priya confirmed that Bluewave expects the first usable release of Project Orca to be ready for internal stakeholder review by **October 18, 2026**. The release does not need to include every long-term reporting capability, but it must allow operations leads to identify delayed shipments, assign ownership, and export a daily exception report.

Arjun shared that the backend data ingestion service is mostly complete for the shipment and SLA data sources. The support ticket feed is still pending final API credentials from the Bluewave IT team. He also explained that the dashboard UI is currently in progress and the engineering team is prioritizing reliability of the exception workflow over advanced analytics for the first sprint.

Both parties agreed that the sprint should focus on the minimum operationally useful release rather than adding optional enhancements. Priya requested that the team keep auditability in mind because regional managers will need to understand when a record changed and who updated the owner or status.

## Confirmed Deadline

The target deadline for the sprint release is **October 18, 2026**.

The delivery team will provide a working demo build by **October 11, 2026**, giving the client one week for review, feedback, and acceptance testing before the release deadline.

## Sprint Deliverables

1. **Operations Dashboard**
   - Shipment exception summary by region, priority, and SLA risk.
   - Drill-down table for delayed, blocked, and at-risk shipments.
   - Search and filter support by shipment ID, region, owner, and status.

2. **Exception Ownership Workflow**
   - Ability to assign an exception to an operations manager.
   - Status updates for Open, In Progress, Waiting on Client, Resolved, and Escalated.
   - Basic activity history for ownership and status changes.

3. **Data Integration**
   - Shipment feed ingestion from the existing Bluewave logistics API.
   - SLA threshold mapping based on the rules shared by the client.
   - Support ticket feed integration, dependent on API credential handover.

4. **Daily Exception Report**
   - Exportable CSV report for open and escalated exceptions.
   - Report columns to include shipment ID, region, current SLA risk, owner, status, last updated date, and remarks.

5. **UAT Support Package**
   - Demo environment access for client reviewers.
   - Short release note covering completed scope, known limitations, and testing instructions.
   - Issue logging format for feedback during client review.

## Decisions Made

- The sprint will prioritize exception visibility, ownership assignment, and daily reporting.
- Advanced trend analytics and predictive delay scoring will be moved to a later release.
- The client will provide final support ticket API credentials by **September 16, 2026**.
- The delivery team will share the first demo build by **October 11, 2026**.
- The sprint release deadline remains **October 18, 2026**.

## Risks and Dependencies

| Risk or Dependency                           | Owner                     | Impact                                            | Current Mitigation                                          |
| -------------------------------------------- | ------------------------- | ------------------------------------------------- | ----------------------------------------------------------- |
| Support ticket API credentials are pending   | Priya Menon / Bluewave IT | Ticket correlation may slip from the sprint scope | Bluewave IT to share credentials by September 16, 2026      |
| SLA rules may change after operations review | Priya Menon               | Rework may be required in threshold mapping       | Delivery team will keep SLA rules configurable              |
| UAT feedback window is limited to one week   | Arjun Rao / Priya Menon   | Late feedback may affect October 18 release       | Demo build to be shared by October 11, 2026                 |
| Audit history expectations may expand        | Arjun Rao                 | Could increase backend and UI effort              | Sprint scope limited to ownership and status change history |

## Action Items

| Action Item                                                       | Owner       | Due Date           | Status      |
| ----------------------------------------------------------------- | ----------- | ------------------ | ----------- |
| Share support ticket API credentials and sandbox access           | Priya Menon | September 16, 2026 | Open        |
| Finalize configurable SLA threshold rules in written format       | Priya Menon | September 17, 2026 | Open        |
| Complete dashboard drill-down table and filters                   | Arjun Rao   | September 25, 2026 | In Progress |
| Implement exception assignment and status workflow                | Arjun Rao   | October 2, 2026    | Planned     |
| Prepare demo build for client review                              | Arjun Rao   | October 11, 2026   | Planned     |
| Nominate UAT reviewers from South and West India operations teams | Priya Menon | October 6, 2026    | Open        |

## Next Follow-Up Meeting

**Date:** September 19, 2026  
**Time:** 10:30 AM - 11:00 AM IST  
**Location:** Microsoft Teams  
**Purpose:** Sprint checkpoint to review credential handover, dashboard progress, SLA rule configuration, and any blockers that may affect the October 11 demo build.

## Closing Notes

The meeting concluded with both parties aligned on the sprint scope and release timeline. The client emphasized that operational usability is more important than broad feature coverage for this release. The delivery team confirmed that the October 18 deadline is achievable if the pending credentials and SLA rules are provided by the agreed dates.
