export default function cloudinaryLoader({ src, width, quality }: {
  src: string;
  width: number;
  quality?: number;
}) {
  // If not a Cloudinary URL, return as-is
  if (!src.includes('res.cloudinary.com')) {
    return src;
  }

  // Parse the Cloudinary URL
  const parts = src.split('/upload/');
  if (parts.length !== 2) return src;

  // Add Cloudinary transformations
  const transformations = [
    `f_auto`,  // Auto format (WebP/AVIF)
    `q_${quality || 75}`,  // Quality
    `w_${width}`,  // Width
    `c_limit`,  // Don't upscale
  ].join(',');

  // Return optimized URL
  return `${parts[0]}/upload/${transformations}/${parts[1]}`;
}
