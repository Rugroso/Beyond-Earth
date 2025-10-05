"use client";

import { useEffect, useRef, useState } from "react";
import { useSetup } from "@/contexts/setup-context";
import { CANVAS_SIZES } from "@/types/setup";

export function useScaledCanvas() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const { setup } = useSetup();

  // Get native dimensions from setup, fallback to medium
  const canvasSize = setup.canvasSize || 'medium';
  const { width: NATIVE_WIDTH, height: NATIVE_HEIGHT } = CANVAS_SIZES[canvasSize];

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
  }, [NATIVE_WIDTH, NATIVE_HEIGHT]);

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
    nativeHeight: NATIVE_HEIGHT
  };
}