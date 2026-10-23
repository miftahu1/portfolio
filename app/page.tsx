import Hero from "@/components/sections/Hero";
import StackBento from "@/components/sections/StackBento";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectsGrid from "@/components/sections/ProjectsGrid";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import CommentForm from "@/components/ui/CommentForm";
import CommentList from "@/components/sections/CommentList";
import { Suspense } from "react";
import Skeleton from "@/components/ui/Skeleton";
import PostsGrid from "@/components/sections/PostsGrid";
import FeaturedPhotos from "@/components/sections/FeaturedPhotos";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StackBento />
      <AboutSection />
      <ProjectsGrid limit={3} />
      <FeaturedPhotos />
      <PostsGrid limit={3} />
      <section className="py-12 md:py-24">
        <SectionHeading
          title="Feedbacks"
          description="Kind words, honest notes, anything in between."
        />
        <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="lg:sticky lg:top-24">
            <CommentForm />
          </div>
          <Suspense fallback={<Skeleton className="h-48 rounded-[28px]" />}>
            <CommentList />
          </Suspense>
        </div>
      </section>
      <ContactSection />
    </>
  );
}