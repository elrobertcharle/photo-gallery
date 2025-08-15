'use client';

import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import "@styles/styles.css";
import { Photo } from "@/photos";
import { useState, useEffect, useRef } from "react";

const rowHeight: number = 500;
const pageSize = 4;

export default function WS({ photos }: { photos: Photo[] }) {
    const [page, setPage] = useState(1);
    const [items, setItems] = useState(photos.slice(0, 4));
    const firstRender = useRef(true);
    const outerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }

        const addPage = () => {
            var newItems = photos.slice((page - 1) * pageSize, pageSize * page);
            setItems((currentItems) => currentItems.concat(newItems));
        };

        addPage();
    }, [page]);


    const Row = ({ index, style, data }: { index: number, style: any, data: Photo[] }) => (
        <div style={style}>
            <img src={data[index].src} style={{ width: "auto", height: `${rowHeight}px` }}></img>
        </div>
    );

    const onScroll = ({ scrollDirection, scrollOffset, scrollUpdateWasRequested }) => {
        const container = outerRef.current;
        if (!container) return;

        const { scrollTop, scrollHeight, clientHeight } = container;
        const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

        const endReached = distanceFromBottom == 0;
        if (endReached) {
            console.log('Reached the bottom of the page!');
             setPage((prev) => prev + 1);
        }
    };


    return (
        <AutoSizer>
            {({ height, width }) => (
                <>
                    <List outerRef={outerRef}
                        className="List"
                        height={rowHeight * 2}
                        itemCount={items.length}
                        itemSize={rowHeight}
                        width={width}
                        overscanCount={1}
                        itemData={items}
                        onScroll={onScroll}
                    >
                        {Row}
                    </List>
                </>
            )}
        </AutoSizer>);
}