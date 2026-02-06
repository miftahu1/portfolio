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
        
        // Basic filename validation
        if (fileName.includes('/') || fileName.includes('..')) {
            return NextResponse.json({ message: 'Invalid file name' }, { status: 400 });
        }

        const deletePath = path.join(demoDir, fileName);
        try {
            await fs.unlink(deletePath);
            return NextResponse.json({ message: "Page deleted" });
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                return NextResponse.json({ message: 'File not found' }, { status: 404 });
            }
            // For other errors, let the outer handler create a 500 response
            throw error;
        }

      default:
        return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
    }
  } catch (error: any) {
    console.error(error);
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { message: "Internal Server Error", error: message },
      { status: 500 }
    );
  }
}

export { handler as GET, handler as POST, handler as DELETE };
