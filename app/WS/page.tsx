'use server'

import WS from "@/app/components/WS";
import getPhotos from "@/photos";

export default async function PageWS() {
  const photos = await getPhotos(); // server-side
  return <WS photos={photos} />;
}
