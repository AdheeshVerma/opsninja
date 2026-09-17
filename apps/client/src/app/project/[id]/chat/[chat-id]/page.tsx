import ProjectChatDetailsPage from "@/component/ProjectChatDetailsPage";

type PageProps = {
  params: Promise<{
    "chat-id": string;
    id: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { "chat-id": chatId, id } = await params;

  return <ProjectChatDetailsPage chatId={chatId} projectId={id} />;
}
