import PageScaffold from "@/component/PageScaffold";

type MeetingSummaryPageProps = {
  projectId: string;
};

export default function MeetingSummaryPage({
  projectId,
}: MeetingSummaryPageProps) {
  return (
    <PageScaffold
      title="Meeting summaries"
      description="Review shareable meeting summaries and action status for this project."
      details={[{ label: "Project ID", value: projectId }]}
    />
  );
}
