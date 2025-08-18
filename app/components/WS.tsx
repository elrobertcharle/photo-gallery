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


    const rowLooksGood = (desiredRowWidth: number, currectRowWidth: number, maxShrinkScale: number, maxStretch: number): { good: boolean, scale: number } => {
        const result = { good: true, scale: 0 };
        const scale = currectRowWidth / desiredRowWidth;
        result.good = scale >= maxShrinkScale && scale <= maxStretch;
        result.scale = scale;
        return result;
    }

    interface PhotoRow {
        photos: Photo[];
        correctHeight: number;
    };

    const computeRows = (photos: Photo[], desiredRowHeight: number, rowWidth: number): PhotoRow[] => {
        let result: PhotoRow[] = [];
        let currectRow: PhotoRow = { photos: [], correctHeight: 0 };
        let currectRowWidth: number = 0;
        let currectPhotoWidth: number = 0;
        const maxShrinkScale = 1.2;
        const maxStretchScale = 1.2;
        photos.map((photo) => {
            currectPhotoWidth = photo.aspectRatio * desiredRowHeight;
            if (currectRow.photos.length == 0 || currectRowWidth + currectPhotoWidth < rowWidth) {
                currectRow.photos.push(photo);
                currectRowWidth += currectPhotoWidth;
            }
            else {
                const looksGoodNow = rowLooksGood(rowWidth, currectRowWidth, maxShrinkScale, maxStretchScale);
                const looksGoodWithAnother = rowLooksGood(rowWidth, currectRowWidth + currectPhotoWidth, maxShrinkScale, maxStretchScale);
                const desviation1 = Math.abs(looksGoodNow.scale - 1);
                const desviation2 = Math.abs(looksGoodWithAnother.scale - 1);
                if (desviation2 < desviation1) {
                    currectRow.photos.push(photo)
                }
                result.push(currectRow);
                //reset
                currectRowWidth = 0;
                currectRow = { photos: [], correctHeight: 0 };
            }
        });
        return result;
    }

    const Row = useCallback(({ index, style, data }: { index: number, style: any, data: { rowCount: number, itemsPerRow: number, items: Photo[] } }) => {
        const { rowCount, itemsPerRow } = data;
        const startIndex = itemsPerRow * index;
        const endIndex = startIndex + itemsPerRow;
        console.log('startIndex', startIndex, 'items.length', items.length)
        const rowItems = items.slice(startIndex, endIndex);
        return (
            <div style={style}>
                <div style={{ display: "flex" }}>
                    {rowItems.map((photo) => <img key={photo.alt} alt={photo.alt} title={photo.alt} src={photo.src} style={{ width: `${photoWidth}px`, height: `${rowHeight}px`, display: 'inline-block' }}></img>)}
                </div>
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