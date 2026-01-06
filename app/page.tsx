import Hero from "@/components/sections/Hero";
import ProjectsGrid from "@/components/sections/ProjectsGrid";
import BlogList from "@/components/sections/BlogList";
import ContactSection from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProjectsGrid limit={3} />
      <BlogList limit={3} />
      <ContactSection />
    </>
  );
}

