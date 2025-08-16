'use client';

import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import "@styles/styles.css";
import { Photo } from "@/photos";
import { useState, useEffect, useRef, useCallback } from "react";

const rowHeight: number = 500;
const photoWidth: number = 500;
const pageSize = 5;
const initialPageCount = 3;

export default function WS({ photos }: { photos: Photo[] }) {
    const [page, setPage] = useState(initialPageCount);
    const [items, setItems] = useState(() => photos.slice(0, initialPageCount * pageSize));
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


    const Row = useCallback(({ index, style, data }: { index: number, style: any, data: { rowCount: number, itemsPerRow: number, items: Photo[] } }) => {
        const { rowCount, itemsPerRow } = data;
        const startIndex = itemsPerRow * index;
        const endIndex = startIndex + itemsPerRow;
        console.log('startIndex', startIndex, 'items.length', items.length)
        const rowItems = items.slice(startIndex, endIndex);
        return (
            <div style={style}>
                {rowItems.map((photo) => <img key={photo.alt} alt={photo.alt} title={photo.alt} src={photo.src} style={{ width: `${photoWidth}px`, height: `${rowHeight}px`, display: 'inline-block' }}></img>)}
            </div>
        );
    }, [items]);

    const onScroll = useCallback(({ scrollDirection, scrollOffset, scrollUpdateWasRequested }) => {
        const container = outerRef.current;
        if (!container) return;

        const { scrollTop, scrollHeight, clientHeight } = container;
        const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

        if (distanceFromBottom === 0) {
            console.log('Reached the bottom of the page!');
            setPage((prev) => prev + 1);
        }
    }, []);


    return (
        <AutoSizer>
            {({ height, width }) => {
                const itemsPerRow = Math.floor(width / photoWidth);
                const rowCount = Math.ceil(items.length / itemsPerRow);
                console.log('rowCount', rowCount);

                const itemData = { itemsPerRow, items };

                return (

                    <>
                        <List outerRef={outerRef}
                            className="List"
                            height={rowHeight * 2}
                            itemCount={rowCount}
                            itemSize={rowHeight}
                            width={width}
                            overscanCount={1}
                            itemData={itemData}
                            onScroll={onScroll}
                        >
                            {Row}
                        </List>
                    </>
                );
            }}
        </AutoSizer>);
}