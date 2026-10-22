import { NextRequest, NextResponse } from "next/server";
import { fetchPages, fetchPage, createPage, deletePage } from "@/lib/firestore";

async function handler(req: NextRequest) {
  const { method } = req;
  const id = req.nextUrl.searchParams.get("id");

  try {
    switch (method) {
      case "GET":
        if (id) {
          const page = await fetchPage(id);
          if (page) {
            return NextResponse.json(page);
          } else {
            return NextResponse.json({ message: "Page not found" }, { status: 404 });
          }
        } else {
          const pages = await fetchPages();
          return NextResponse.json({ files: pages.map(p => ({...p, fileName: p.title + ".html"})) });
        }

      case "POST":
        const { fileName, content } = await req.json();
        if (!fileName || !content) {
          return NextResponse.json({ message: "Bad Request" }, { status: 400 });
        }
        const title = fileName.replace(/\.html$/, "");
        await createPage({ title, content });
        return NextResponse.json({ message: "Page saved" });

      case "DELETE":
        const fileNameToDelete = req.nextUrl.searchParams.get("fileName");
        if (!fileNameToDelete) {
          return NextResponse.json({ message: "Bad Request" }, { status: 400 });
        }

        const pages = await fetchPages();
        const pageToDelete = pages.find(p => p.title + ".html" === fileNameToDelete);

        if (pageToDelete) {
          await deletePage(pageToDelete.id);
          return NextResponse.json({ message: "Page deleted" });
        } else {
          return NextResponse.json({ message: "Page not found" }, { status: 404 });
        }

      default:
        return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export { handler as GET, handler as POST, handler as DELETE };
