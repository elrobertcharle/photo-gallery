'use server';

import { Photo } from "@/photos";

const height: number = 500;

export default async function N({ photos }: { photos: Photo[] }) {

    return (<div>
        {photos.map((p, index) =>
            <div key={index} style={{height:`${height}px`}}>
                <img src={p.src} style={{ width: "auto", height: `${height}px` }}></img>
            </div>)}
    </div>);
}

