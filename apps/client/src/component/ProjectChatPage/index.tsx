import PageScaffold from "@/component/PageScaffold";

type ProjectChatPageProps = {
  projectId: string;
};

export default function ProjectChatPage({ projectId }: ProjectChatPageProps) {
  return (
    <PageScaffold
      title="Project chat"
      description="Access chat threads associated with this project."
      details={[{ label: "Project ID", value: projectId }]}
    />
  );
}
