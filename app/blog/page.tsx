import BlogList from "@/components/sections/BlogList";

export const metadata = {
  title: "Blog – Mifta.dev",
};

export default function BlogPage() {
  return (
    <>
      <h1 className="font-display text-2xl text-white md:text-3xl">Blog</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Longer-form notes on engineering, design, and the process behind
        building interfaces that feel good to use.
      </p>
      <BlogList />
    </>
  );
}

