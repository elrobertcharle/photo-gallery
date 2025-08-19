'use client';

import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList as List } from "react-window";
import "@styles/styles.css";
import { Photo } from "@/photos";
import { useState, useEffect, useRef, useCallback } from "react";
import PhotoRow from "@/interfacePhotoRow";

export default function Gallery({ rows, rowWidth, height, onScroll }: { rows: PhotoRow[], rowWidth: number, height: number, onScroll: ({ scrollDirection, scrollOffset, scrollUpdateWasRequested }) => void }) {
    const getRowHeight = useCallback((index: number) => {
        return rows[index].correctHeight;
    }, [rows]);
    

    const Row = useCallback(({ index, style, data }: { index: number, style: any, data: PhotoRow[] }) => {
        const row = data[index];
        return (
            <div style={style}>
                <div style={{ display: "flex" }}>
                    {row.photos.map((photo) => <img key={photo.alt} alt={photo.alt} title={photo.alt} src={photo.src} style={{ width: `100%`, height: `${row.correctHeight}px` }}></img>)}
                </div>
            </div>
        );
    }, [rows]);


    return (

        <List
            className="List"
            height={height}
            itemCount={rows.length}
            itemSize={getRowHeight}
            width={rowWidth}
            overscanCount={5}
            itemData={rows}
            onScroll={onScroll}
        >
            {Row}
        </List>
    );
}