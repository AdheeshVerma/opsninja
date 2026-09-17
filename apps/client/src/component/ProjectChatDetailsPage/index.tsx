import PageScaffold from "@/component/PageScaffold";

type ProjectChatDetailsPageProps = {
  chatId: string;
  projectId: string;
};

export default function ProjectChatDetailsPage({
  chatId,
  projectId,
}: ProjectChatDetailsPageProps) {
  return (
    <PageScaffold
      title="Chat thread"
      description="Read the selected chat thread for this project."
      details={[
        { label: "Project ID", value: projectId },
        { label: "Chat ID", value: chatId },
      ]}
    />
  );
}
