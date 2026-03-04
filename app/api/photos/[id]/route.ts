import { deletePhoto, updatePhoto } from "@/lib/firestore";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await deletePhoto(id);
    // Also delete from Cloudinary
    // I will add this later, for now just deleting from firestore
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting photo:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();
    await updatePhoto(id, data);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error updating photo:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
