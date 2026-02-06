import { fetchPageByTitle } from "@/lib/firestore";
import { notFound } from "next/navigation";

export default async function DemoPage({ params }: { params: { slug: string } }) {
    const page = await fetchPageByTitle(params.slug.replace('.html', ''));

    if (!page) {
        return notFound();
    }

    return (
        <div dangerouslySetInnerHTML={{ __html: page.content }} />
    );
}
