'use client'
import { useState, useRef, useLayoutEffect, useCallback } from 'react';
import PhotoRow from '@/interfacePhotoRow';
import { Photo } from '@/photos';
import Gallery, { OnGalleryScrollEvent } from '@/app/components/Gallery';

interface Props {
    photos: Photo[];
    desiredRowHeight: number;
    verticalItemSpace: number;
    horizontalItemSpace: number;
    rowClassName?: string | null;
    itemClassName?: string | null;
}

interface Size {
    width: number;
    height: number;
}

const initialPageCount = 10;

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

export default function GalleryContainer({ photos, desiredRowHeight, verticalItemSpace, horizontalItemSpace, rowClassName, itemClassName }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerSize, setContainerSize] = useState<Size>({ width: 0, height: 0 });
    const [rows, setRows] = useState<PhotoRow[]>([]);
    const [page, setPage] = useState(initialPageCount);

    const rowLooksGood = (desiredRowWidth: number, currectRowWidth: number, maxShrinkScale: number, maxStretch: number): { good: boolean, scale: number } => {
        const result = { good: true, scale: 0 };
        const scale = desiredRowWidth / currectRowWidth;
        result.good = scale >= maxShrinkScale && scale <= maxStretch;
        result.scale = scale;
        return result;
    }

    const computeRows = (photos: Photo[], desiredRowHeight: number, hItemSpace: number, rowWidth: number): PhotoRow[] => {
        let result: PhotoRow[] = [];
        let currectRow: PhotoRow = { photos: [], correctHeight: 0, scale: 0 };
        let currectRowWidth: number = 0;
        let currectPhotoWidth: number = 0;
        const maxShrinkScale = 1.2;
        const maxStretchScale = 0.8;
        photos.map((photo, index) => {
            currectPhotoWidth = photo.aspectRatio * desiredRowHeight;
            if (currectRow.photos.length == 0 || currectRowWidth + hItemSpace + currectPhotoWidth < rowWidth) {
                currectRow.photos.push(photo);
                currectRowWidth += (hItemSpace + currectPhotoWidth);

                if (index == photos.length - 1 && currectRow != result[result.length - 1]) {
                    result.push(currectRow);
                    const looksGoodNow = rowLooksGood(rowWidth, currectRowWidth, maxShrinkScale, maxStretchScale);
                    if (looksGoodNow.good) {
                        currectRow.correctHeight = Math.ceil(desiredRowHeight * looksGoodNow.scale);
                        currectRow.scale = looksGoodNow.scale;
                    } else {
                        currectRow.correctHeight = desiredRowHeight;
                        currectRow.scale = 1;
                    }
                }
            }
            else {
                const looksGoodNow = rowLooksGood(rowWidth, currectRowWidth, maxShrinkScale, maxStretchScale);
                const looksGoodWithAnother = rowLooksGood(rowWidth, currectRowWidth + hItemSpace + currectPhotoWidth, maxShrinkScale, maxStretchScale);
                const desviation1 = Math.abs(looksGoodNow.scale - 1);
                const desviation2 = Math.abs(looksGoodWithAnother.scale - 1);
                if (desviation2 < desviation1) {
                    currectRow.photos.push(photo);
                    result.push(currectRow);
                    currectRow.correctHeight = Math.ceil(desiredRowHeight * looksGoodWithAnother.scale);
                    currectRow.scale = looksGoodWithAnother.scale;

                    //reset
                    currectRowWidth = 0;
                    currectRow = { photos: [], correctHeight: 0, scale: 0 };
                } else {
                    result.push(currectRow);

                    currectRow.correctHeight = Math.ceil(desiredRowHeight * looksGoodNow.scale);
                    currectRow.scale = looksGoodNow.scale;
                    currectRow = { photos: [photo], correctHeight: 0, scale: 0 };
                    currectRowWidth = currectPhotoWidth;
                }
            }
        });
        return result;
    };

    const onScroll: OnGalleryScrollEvent = useCallback((scrollTop, scrollHeight, clientHeight) => {
        const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

        if (distanceFromBottom === 0) {
            console.log('Reached the bottom of the page!');
            setPage((prev) => prev + 1);
        }
    }, []);

    // Measure container size
    useLayoutEffect(() => {
        const handleResize = (entries) => {
            if (!entries || entries.length === 0) {
                return;
            }
            const { width, height } = entries[0].contentRect;
            setContainerSize({ width, height });
        };

        const debouncedHandleResize = debounce(handleResize, 300);

        const ro = new ResizeObserver(debouncedHandleResize);
        ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, []);

    // Recompute rows when width or photos change
    useLayoutEffect(() => {
        if (containerSize.width > 0) {
            const newRows = computeRows(photos, desiredRowHeight, horizontalItemSpace, containerSize.width);
            setRows(newRows);
        }
    }, [photos, desiredRowHeight, containerSize]);

    return (
        <div ref={containerRef} style={{ width: "100%" }}>
            <Gallery onScroll={onScroll} rows={rows} rowWidth={containerSize.width} height={containerSize.height} rowClassName={rowClassName} itemClassName={itemClassName} verticalItemSpace={verticalItemSpace} horizontalItemSpace={horizontalItemSpace} />
        </div>
    );
}