import { createPhoto, fetchPhotos } from "@/lib/firestore";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get('featured') === 'true';

  try {
    const photos = await fetchPhotos(featured);
    return NextResponse.json(photos);
  } catch (error) {
    console.error("Error fetching photos:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { publicId, title, description } = await request.json();
    if (!publicId) {
      return new NextResponse("Bad Request: publicId is required", { status: 400 });
    }
    const photo = await createPhoto(publicId, title, description);
    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error("Error creating photo:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
