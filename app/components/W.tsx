'use client';

import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import "@styles/styles.css";
import { Photo } from "@/photos";

export default function W({ photos }: { photos: Photo[] }) {
    photos=photos.slice(0,8);
    const rowHeight: number = 500;

    const Row = ({ index, style, data }: { index: number, style: any, data: Photo[] }) => (
        <div style={style}>
            <img src={data[index].src} style={{ width: "auto", height: `${rowHeight}px` }}></img>
        </div>
    );
    return (
        <AutoSizer>
            {({ height, width }) => (
                <>
                    <List
                        className="List"
                        height={rowHeight * 2}
                        itemCount={photos.length}
                        itemSize={rowHeight}
                        width={width}
                        overscanCount={1}
                        itemData={photos}
                    >
                        {Row}
                    </List>
                </>
            )}
        </AutoSizer>);
}

