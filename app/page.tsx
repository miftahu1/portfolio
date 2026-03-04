import Hero from "@/components/sections/Hero";
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
      <AboutSection />
      <ProjectsGrid limit={3} />
      <FeaturedPhotos />
      <PostsGrid limit={3} />
      <div className="space-y-12">
        <h2 className="font-display text-3xl font-bold text-center text-white">Feedbacks</h2>
        <CommentForm />
        <Suspense fallback={<Skeleton className="h-48 rounded-2xl" />}>
            <CommentList />
        </Suspense>
      </div>
      <ContactSection />
    </>
  );
}
