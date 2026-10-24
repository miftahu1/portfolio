export const cloudUrl = (publicId: string, width: number) =>
  `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_${width}/v1/${publicId}`;

/** Fixed frame shapes: heights are known before images load, so nothing can re-flow. */
export const GRID_ASPECTS = ['aspect-[4/5]', 'aspect-square', 'aspect-[4/3]', 'aspect-[3/4]', 'aspect-[5/4]', 'aspect-[4/5]'];
