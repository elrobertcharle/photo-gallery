'use client';

import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList as List } from "react-window";
import "@styles/styles.css";
import { Photo } from "@/photos";
import { useState, useEffect, useRef, useCallback } from "react";
import PhotoRow from "@/interfacePhotoRow";

const rowHeight: number = 500;
const photoWidth: number = 500;
const pageSize = 5;
const initialPageCount = 3;

export default function Gallery({ rows, rowWidth, onScroll }: { rows: PhotoRow[], rowWidth: number, onScroll: ({ scrollDirection, scrollOffset, scrollUpdateWasRequested }) => void }) {
    console.log('rows', rows);
    const [page, setPage] = useState(initialPageCount);
    //const [items, setItems] = useState(() => photos.slice(0, initialPageCount * pageSize));
    const firstRender = useRef(true);

    // useEffect(() => {
    //     if (firstRender.current) {
    //         firstRender.current = false;
    //         return;
    //     }

    //     const addPage = () => {
    //         var newItems = photos.slice((page - 1) * pageSize, pageSize * page);
    //         setItems((currentItems) => currentItems.concat(newItems));
    //     };

    //     addPage();
    // }, [page]);


    const getRowHeight = useCallback((index: number) => {
        return rows[index].correctHeight;
    }, [rows]);


    const Row = useCallback(({ index, style, data }: { index: number, style: any, data: PhotoRow[] }) => {
        const row = data[index];
        // const startIndex = itemsPerRow * index;
        // const endIndex = startIndex + itemsPerRow;
        // console.log('startIndex', startIndex, 'items.length', items.length)
        // const rowItems = items.slice(startIndex, endIndex);
        //console.log('data', data);
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
            height={rowHeight * 2}
            itemCount={rows.length}
            itemSize={getRowHeight}
            width={rowWidth}
            overscanCount={1}
            itemData={rows}
            onScroll={onScroll}
        >
            {Row}
        </List>
    );
}