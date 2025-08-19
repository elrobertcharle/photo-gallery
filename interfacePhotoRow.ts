import { Photo } from "@/photos";


export default interface PhotoRow {
    photos: Photo[];
    correctHeight: number;
    scale: number;
};