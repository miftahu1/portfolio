import BlogList from "@/components/sections/BlogList";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata = {
  title: "Blog – Mifta.dev",
};

export default function BlogPage() {
  return (
    <div className="pt-2 md:pt-4">
      <SectionHeading
        level={1}
        title="Blog"
        description="Longer-form notes on engineering, design, and the process behind building interfaces that feel good to use."
      />
      <BlogList hideHeading />
    </div>
  );
}