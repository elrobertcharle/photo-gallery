'use server'

import N from "@/app/components/N";
import getPhotos from "@/photos";

export default async function PageN() {
  const photos = await getPhotos(); // server-side
  return <N photos={photos} />;
}
