"use client";

import { useState, useCallback } from "react";
import type { ToolbarItemType, PlacedItemType } from "@/types";

const INITIAL_ITEMS: ToolbarItemType[] = [
  { id: "item-004", name: "Comida", shape: "image", imagePath: "/images/food.png", limit: 10 },
  { id: "item-005", name: "Silla", shape: "image", imagePath: "/images/silla.png", limit: 10 }
];

const DEFAULT_SIZE = 140;
const MIN_SIZE = 50;
const MAX_SIZE = 400;

export function useEditorState() {
  const [availableItems] = useState<ToolbarItemType[]>(INITIAL_ITEMS);
  const [placedItems, setPlacedItems] = useState<PlacedItemType[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(true); // Start in Edit Mode

  const getItemCountOnCanvas = useCallback(
    (itemId: string): number => {
      return placedItems.filter((item) => item.itemId === itemId).length;
    },
    [placedItems]
  );

  const addItemToCanvas = useCallback(
    (itemId: string, position: { x: number; y: number }) => {
      const item = availableItems.find((i) => i.id === itemId);
      if (!item) return;

      const currentCount = getItemCountOnCanvas(itemId);
      if (currentCount >= item.limit) return;

      const newItem: PlacedItemType = {
        instanceId: `${itemId}-${Date.now()}-${Math.random()}`,
        itemId,
        position,
        size: DEFAULT_SIZE
      };

      setPlacedItems((prev) => [...prev, newItem]);
    },
    [availableItems, getItemCountOnCanvas]
  );

  const updateItemPosition = useCallback((instanceId: string, newPosition: { x: number; y: number }) => {
    setPlacedItems((prev) => prev.map((item) => (item.instanceId === instanceId ? { ...item, position: newPosition } : item)));
  }, []);

  const updateItemSize = useCallback((instanceId: string, newSize: number) => {
    // Clamp size between MIN_SIZE and MAX_SIZE
    const clampedSize = Math.max(MIN_SIZE, Math.min(MAX_SIZE, newSize));
    setPlacedItems((prev) => prev.map((item) => (item.instanceId === instanceId ? { ...item, size: clampedSize } : item)));
  }, []);

  const removeItemFromCanvas = useCallback((instanceId: string) => {
    setPlacedItems((prev) => prev.filter((item) => item.instanceId !== instanceId));
  }, []);

  return {
    availableItems,
    placedItems,
    isEditMode,
    setIsEditMode,
    addItemToCanvas,
    getItemCountOnCanvas,
    updateItemPosition,
    updateItemSize,
    removeItemFromCanvas
  };
}
