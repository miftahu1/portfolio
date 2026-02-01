import { deleteImage } from '@/lib/cloudinary';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { publicId } = await request.json();

  if (!publicId) {
    return NextResponse.json({ error: 'publicId is required' }, { status: 400 });
  }

  try {
    await deleteImage(publicId);
    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}