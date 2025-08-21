'use server'

import GalleryContainer from "@/app/components/GalleryContainer"
import getPhotos from "@/photos";

export default async function PageWS() {
  const photos = await getPhotos(); // server-side
  return <GalleryContainer photos={photos} desiredRowHeight={500} verticalItemSpace={16} horizontalItemSpace={16} />;
}
