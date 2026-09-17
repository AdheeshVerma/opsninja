import PageScaffold from "@/component/PageScaffold";

type ProjectMeetingPageProps = {
  meetingId: string;
  projectId: string;
};

export default function ProjectMeetingPage({
  meetingId,
  projectId,
}: ProjectMeetingPageProps) {
  return (
    <PageScaffold
      title="Meeting"
      description="View the shareable meeting record and related automation actions."
      details={[
        { label: "Project ID", value: projectId },
        { label: "Meeting ID", value: meetingId },
      ]}
    />
  );
}
