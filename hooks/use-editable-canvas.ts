"use client";

import type React from "react";

import { useContext } from "react";
import { EditorContext } from "@/contexts/editor-context";

interface UseEditableCanvasProps {
  translateMouseCoordinates: (clientX: number, clientY: number) => { x: number; y: number };
}

export function useEditableCanvas({ translateMouseCoordinates }: UseEditableCanvasProps) {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditableCanvas must be used within EditorProvider");
  }

  const { addItemToCanvas, updateItemPosition, isEditMode } = context;

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    if (!isEditMode) return;
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    if (!isEditMode) return;
    event.preventDefault();

    // Translate mouse coordinates from screen space to native canvas coordinates
    const { x, y } = translateMouseCoordinates(event.clientX, event.clientY);

    // Check if we're moving an existing item
    const instanceId = event.dataTransfer.getData("instanceId");
    if (instanceId) {
      // Repositioning an existing item
      updateItemPosition(instanceId, { x, y });
      return;
    }

    // Adding a new item from the toolbar
    const itemId = event.dataTransfer.getData("itemId");
    if (!itemId) return;

    addItemToCanvas(itemId, { x, y });
  };

  return {
    handleDragOver,
    handleDrop,
    isEditMode
  };
}
