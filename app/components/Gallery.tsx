'use client';

import { VariableSizeList as List } from "react-window";
import "@styles/styles.css";
import { useEffect, useRef, useCallback } from "react";
import PhotoRow from "@/interfacePhotoRow";

export type OnGalleryScrollEvent = (scrollTop: number, scrollHeight: number, clientHeight: number) => void;

export default function Gallery({ rows, rowWidth, height, onScroll }: { rows: PhotoRow[], rowWidth: number, height: number, onScroll: OnGalleryScrollEvent }) {
    const listRef = useRef<List>(null);
    const outerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.resetAfterIndex(0, true);
        }
    }, [rowWidth]);

    const getRowHeight = useCallback((index: number) => {
        return rows[index].correctHeight;
    }, [rows]);


    const Row = useCallback(({ index, style, data }: { index: number, style: any, data: PhotoRow[] }) => {
        let className = "photo";
        if (rows[index].scale == 1) {
            className = "";
        }
        const row = data[index];
        return (
            <div style={style}>
                <div style={{ display: "flex" }}>
                    {row.photos.map((photo) => <img key={photo.alt} alt={photo.alt} title={photo.alt} src={photo.src} className={className} style={{ height: `${row.correctHeight}px` }}></img>)}
                </div>
            </div>
        );
    }, [rows]);

    const onListScroll = useCallback(() => {
        const container = outerRef.current;
        if (!container) return;

        const { scrollTop, scrollHeight, clientHeight } = container;
        if (onScroll)
            onScroll(scrollTop, scrollHeight, clientHeight)
    }, []);


    return (

        <List
            ref={listRef}
            outerRef={outerRef}
            className="List"
            height={height}
            itemCount={rows.length}
            itemSize={getRowHeight}
            width={rowWidth}
            overscanCount={2}
            itemData={rows}
            onScroll={onListScroll}
        >
            {Row}
        </List>
    );
}