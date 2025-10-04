"use client";

import { useEffect, useRef, useState } from "react";

// Native resolution of the canvas (design coordinates)
const NATIVE_WIDTH = 1920;
const NATIVE_HEIGHT = 1080;

export function useScaledCanvas() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: viewportWidth, height: viewportHeight } = entry.contentRect;
        
        // Calculate the scale to fit the native canvas within the viewport
        // while maintaining aspect ratio
        const scaleX = viewportWidth / NATIVE_WIDTH;
        const scaleY = viewportHeight / NATIVE_HEIGHT;
        const newScale = Math.min(scaleX, scaleY);
        
        setScale(newScale);
      }
    });

    resizeObserver.observe(viewport);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  /**
   * Translates mouse coordinates from screen space to native canvas coordinates.
   * This is CRITICAL for proper positioning on the scaled canvas.
   */
  const translateMouseCoordinates = (clientX: number, clientY: number) => {
    if (!contentRef.current) {
      return { x: 0, y: 0 };
    }

    // Get the bounding rectangle of the SCALED CONTENT (not the viewport)
    const rect = contentRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to the scaled content
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;
    
    // Convert to native coordinates by dividing by the scale factor
    const nativeX = mouseX / scale;
    const nativeY = mouseY / scale;
    
    return { x: nativeX, y: nativeY };
  };

  return {
    scale,
    viewportRef,
    contentRef,
    translateMouseCoordinates,
    nativeWidth: NATIVE_WIDTH,
    nativeHeight: NATIVE_HEIGHT,
  };
}
