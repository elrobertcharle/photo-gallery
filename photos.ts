// app/photos.ts (or wherever you want)
import fs from "fs";
import path from "path";

export interface Photo {
  src: string;
  width: number;
  height: number;
  alt: string;
}

function imageLink(
  path: string,
  width: number,
  height: number,
  extension: string
) {
  return `/images/${path}.${width}x${height}.${extension}`;
}

export default async function getPhotos(): Promise<Photo[]> {
  const imagesDir = path.join(process.cwd(), "public", "images");
  const files = fs.readdirSync(imagesDir);

  const imageFiles = files.filter(f => f.endsWith(".jpg"));

  const photos = imageFiles.map((f, index) => {
    const matcher = f.match(/^(.*)\.(\d+)x(\d+)\.(.+)$/);
    if (!matcher) {
      console.log('bad pic', f, index);
      return null;
    };

    const [, filePath, w, h, extension] = matcher;
    const width = parseInt(w, 10);
    const height = parseInt(h, 10);

    return {
      src: imageLink(filePath, width, height, extension),
      width,
      height,
      alt: index.toString()
    } as Photo;
  }).filter(Boolean) as Photo[];

  return photos;
}
