'use client';

import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList as List } from "react-window";
import "@styles/styles.css";
import { Photo } from "@/photos";
import { useState, useEffect, useRef, useCallback } from "react";
import PhotoRow from "@/interfacePhotoRow";

export default function G({ rows, rowWidth, height }: { rows: PhotoRow[], rowWidth: number, height: number }) {
    return (
        <div>
            {rows.map((row, idx) => (
                <div style={{ height: `${row.correctHeight}px`, display: "flex" }} key={idx}>
                    {row.photos.map((p) => (
                        <img key={p.alt} title={p.alt} alt={p.alt} src={p.src} style={{ height: `${row.correctHeight}px` }} className="photo" />
                    ))}
                </div>
            ))}
        </div>
    );
}