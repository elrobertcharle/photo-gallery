'use client'
import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import PhotoRow from '@/interfacePhotoRow';
import { Photo } from '@/photos';
import Gallery from '@/app/components/Gallery';

interface Props {
    photos: Photo[];
    desiredRowHeight: number;
}

interface Size {
    width: number;
    height: number;
}

const initialPageCount = 10;

export default function GalleryContainer({ photos, desiredRowHeight }: Props) {
    // console.log('photos.length', photos.length);
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerSize, setContainerSize] = useState<Size>({ width: 0, height: 0 });
    const [rows, setRows] = useState<PhotoRow[]>([]);
    const [page, setPage] = useState(initialPageCount);

    const rowLooksGood = (desiredRowWidth: number, currectRowWidth: number, maxShrinkScale: number, maxStretch: number): { good: boolean, scale: number } => {
        const result = { good: true, scale: 0 };
        const scale = currectRowWidth / desiredRowWidth;
        result.good = scale >= maxShrinkScale && scale <= maxStretch;
        result.scale = scale;
        return result;
    }


    const computeRows = (photos: Photo[], desiredRowHeight: number, rowWidth: number): PhotoRow[] => {
        console.log('photos.length', photos.length)
        let result: PhotoRow[] = [];
        let currectRow: PhotoRow = { photos: [], correctHeight: 0, scale: 0 };
        let currectRowWidth: number = 0;
        let currectPhotoWidth: number = 0;
        const maxShrinkScale = 1.2;
        const maxStretchScale = 0.8;
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
                    result.push(currectRow);
                    currectRow.photos.push(photo);
                    currectRow.correctHeight = Math.ceil(desiredRowHeight * looksGoodWithAnother.scale);
                    currectRow.scale = looksGoodWithAnother.scale;

                    //reset
                    currectRowWidth = 0;
                    currectRow = { photos: [], correctHeight: 0, scale: 0 };

                    // console.log('rowWidth', rowWidth, currectRow.photos.reduce((ac, photo) => ac + photo.aspectRatio * desiredRowHeight, 0) * looksGoodWithAnother.scale)
                } else {
                    result.push(currectRow);

                    currectRow.correctHeight = Math.ceil(desiredRowHeight * looksGoodNow.scale);
                    currectRow.scale = looksGoodNow.scale;

                    // console.log('rowWidth', rowWidth, currectRow.photos.reduce((ac, photo) => ac + photo.aspectRatio * desiredRowHeight, 0) * looksGoodNow.scale)

                    currectRow = { photos: [photo], correctHeight: 0, scale: 0 };
                    currectRowWidth = currectPhotoWidth;
                }
            }
        });
        console.log('computeRows.length', result.reduce((ac, r) => ac + r.photos.length, 0));
        return result;
    };

    // Measure container width
    useLayoutEffect(() => {
        const ro = new ResizeObserver(entries => {
            for (let ent of entries) {
                setContainerSize({ width: ent.contentRect.width, height: ent.contentRect.height });
                console.log("width", ent.contentRect.width);
            }
        });
        ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, []);

    // Recompute rows when width or photos change
    useLayoutEffect(() => {
        if (containerSize.width > 0) {
            const newRows = computeRows(photos, desiredRowHeight, containerSize.width);
            // console.log("newRows",newRows)
            setRows(newRows);
        }
    }, [photos, desiredRowHeight, containerSize]);

    const onScroll = useCallback(({ scrollDirection, scrollOffset, scrollUpdateWasRequested }) => {
        const container = containerRef.current;
        if (!container) return;

        const { scrollTop, scrollHeight, clientHeight } = container;
        const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

        if (distanceFromBottom === 0) {
            console.log('Reached the bottom of the page!');
            setPage((prev) => prev + 1);
        }
    }, []);

    return (
        <div ref={containerRef} style={{ flex: 1, overflow: 'hidden', backgroundColor: "#F08080" }}>
            <Gallery rows={rows} onScroll={onScroll} rowWidth={containerSize.width} height={containerSize.height} />
        </div>
    );
}