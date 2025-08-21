'use client';

import { VariableSizeList as List } from "react-window";
import "@styles/styles.css";
import { useEffect, useRef, useCallback } from "react";
import PhotoRow from "@/interfacePhotoRow";

export type OnGalleryScrollEvent = (scrollTop: number, scrollHeight: number, clientHeight: number) => void;

export interface Props {
    rows: PhotoRow[];
    rowWidth: number;
    height: number;
    onScroll: OnGalleryScrollEvent;
    rowClassName?: string | null;
    itemClassName?: string | null;
    verticalItemSpace: number;
    horizontalItemSpace: number;
};

export default function Gallery({ rows, rowWidth, height, onScroll, rowClassName, itemClassName, verticalItemSpace, horizontalItemSpace }: Props) {
    const listRef = useRef<List>(null);
    const outerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.resetAfterIndex(0, true);
        }
    }, [rowWidth]);

    const getRowHeight = useCallback((index: number) => {
        return rows[index].correctHeight + verticalItemSpace;
    }, [rows]);


    const Row = useCallback(({ index, style, data }: { index: number, style: any, data: PhotoRow[] }) => {
        const row = data[index];
        return (
            <div style={style}>
                <div className={rowClassName} style={{ display: "flex", gap: `${verticalItemSpace}px` }}>
                    {row.photos.map((photo) => <img key={photo.alt} alt={photo.alt} title={photo.alt} src={photo.src} className={itemClassName} style={{ height: `${row.correctHeight}px`, gap: `${horizontalItemSpace}px`, minWidth: 0}}></img>)}
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