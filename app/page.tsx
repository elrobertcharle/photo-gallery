'use server'

import W from "@/app/components/W";
import getPhotos from "@/photos";

export default async function Page() {
  const photos = await getPhotos(); // server-side
  return <W photos={photos} />;
}
