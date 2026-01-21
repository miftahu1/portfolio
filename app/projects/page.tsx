import ProjectsGrid from "@/components/sections/ProjectsGrid";

export const metadata = {
  title: "Projects – Mifta.dev",
};

export default function ProjectsPage() {
  return (
    <div className="py-16 md:py-24">
      <ProjectsGrid />
    </div>
  );
}
