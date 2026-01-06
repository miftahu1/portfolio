import ProjectsGrid from "@/components/sections/ProjectsGrid";

export const metadata = {
  title: "Projects – Mifta.dev",
};

export default function ProjectsPage() {
  return (
    <>
      <h1 className="font-display text-2xl text-white md:text-3xl">Projects</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        A curated selection of work spanning product engineering, UI/UX, and
        motion-driven experiences.
      </p>
      <ProjectsGrid />
    </>
  );
}

