// /app/components/SimpleVirtualizer.tsx
'use client';

import React, { useState, useMemo, useRef, UIEvent } from 'react';

interface SimpleVirtualizerProps {
    itemCount: number;
    getItemHeight: (index: number) => number;
    children: React.ComponentType<{ index: number; style: React.CSSProperties }>;
    height: number;
    width: number | string;
    overscanCount?: number;
    onScrollCallback?: (metrics: { scrollOffset: number, scrollHeight: number, clientHeight: number }) => void;
}

export default function SimpleVirtualizer({
    itemCount,
    getItemHeight,
    children: Row,
    height,
    width,
    overscanCount = 5,
    onScrollCallback
}: SimpleVirtualizerProps) {

    const [scrollTop, setScrollTop] = useState(0);

    // Memoize the position of each item to avoid recalculating on every render.
    // Each item will have its height and its distance from the top of the list.
    const itemPositions = useMemo(() => {
        const positions = [];
        let currentPosition = 0;
        for (let i = 0; i < itemCount; i++) {
            const itemHeight = getItemHeight(i);
            positions[i] = { top: currentPosition, height: itemHeight };
            currentPosition += itemHeight;
        }
        return positions;
    }, [itemCount, getItemHeight]);

    // The total height of the scrollable area.
    const totalHeight = itemPositions.length > 0 ? itemPositions[itemCount - 1].top + itemPositions[itemCount - 1].height : 0;

    // Determine the start and end index of the items to render.
    const { startIndex, endIndex } = useMemo(() => {
        // Find the first item that is partially or fully in the viewport.
        const visibleStartIndex = itemPositions.findIndex(
            (item) => item.top + item.height > scrollTop
        );

        // Find the first item that is completely outside the bottom of the viewport.
        let visibleEndIndex = itemPositions.findIndex(
            (item) => item.top > scrollTop + height
        );
        
        // If all remaining items are visible, the end index is the last item.
        if (visibleEndIndex === -1) {
            visibleEndIndex = itemCount - 1;
        }

        // Apply the overscan count to render items before and after the visible range.
        const start = Math.max(0, visibleStartIndex - overscanCount);
        const end = Math.min(itemCount - 1, visibleEndIndex + overscanCount);

        return { startIndex: start, endIndex: end };
    }, [scrollTop, height, itemCount, itemPositions, overscanCount]);


    // Generate the visible items based on the calculated start and end indexes.
    const visibleItems = [];
    for (let i = startIndex; i <= endIndex; i++) {
        const style: React.CSSProperties = {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${itemPositions[i].height}px`,
            transform: `translateY(${itemPositions[i].top}px)`,
        };
        visibleItems.push(<Row key={i} index={i} style={style} />);
    }

    const handleScroll = (event: UIEvent<HTMLDivElement>) => {
        const newScrollTop = event.currentTarget.scrollTop;
        setScrollTop(newScrollTop);

        // Pass useful metrics to the parent for tasks like infinite loading.
        if (onScrollCallback) {
            onScrollCallback({
                scrollOffset: newScrollTop,
                scrollHeight: totalHeight,
                clientHeight: height,
            });
        }
    };

    return (
        <div
            style={{
                height,
                width,
                overflow: 'auto',
                position: 'relative',
            }}
            onScroll={handleScroll}
        >
            {/* This inner div has the total height of all items, creating the correct scrollbar. */}
            <div
                style={{
                    height: `${totalHeight}px`,
                    width: '100%',
                    position: 'relative',
                }}
            >
                {/* These are the absolutely positioned, visible items. */}
                {visibleItems}
            </div>
        </div>
    );
}