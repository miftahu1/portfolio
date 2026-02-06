import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const demoDir = path.join(process.cwd(), "public", "demo");

async function handler(req: NextRequest) {
  const { method } = req;
  const fileName = req.nextUrl.searchParams.get("fileName");

  try {
    await fs.mkdir(demoDir, { recursive: true });

    switch (method) {
      case "GET":
        if (fileName) {
          const filePath = path.join(demoDir, fileName);
          const content = await fs.readFile(filePath, "utf-8");
          return NextResponse.json({ content });
        } else {
          const files = await fs.readdir(demoDir);
          return NextResponse.json({ files });
        }

      case "POST":
        const { fileName: newFileName, content } = await req.json();
        if (!newFileName || !content) {
            return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
        }
        const filePath = path.join(demoDir, newFileName);
        await fs.writeFile(filePath, content);
        return NextResponse.json({ message: "Page saved" });

      case "DELETE":
        if (!fileName) {
             return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
        }
        const deletePath = path.join(demoDir, fileName);
        await fs.unlink(deletePath);
        return NextResponse.json({ message: "Page deleted" });

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
