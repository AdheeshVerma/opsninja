import ProjectMeetingPage from "@/component/ProjectMeetingPage";

type PageProps = {
  params: Promise<{
    id: string;
    "meet-id": string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { id, "meet-id": meetingId } = await params;

  return <ProjectMeetingPage meetingId={meetingId} projectId={id} />;
}
