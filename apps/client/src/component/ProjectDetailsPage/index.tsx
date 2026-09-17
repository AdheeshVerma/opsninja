import PageScaffold from "@/component/PageScaffold";

type ProjectDetailsPageProps = {
  projectId: string;
};

export default function ProjectDetailsPage({
  projectId,
}: ProjectDetailsPageProps) {
  return (
    <PageScaffold
      title="Project details"
      description="View project-level context and related collaboration surfaces."
      details={[{ label: "Project ID", value: projectId }]}
    />
  );
}
