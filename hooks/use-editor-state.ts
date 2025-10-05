"use client";

import { useState, useCallback } from "react";
import type { ToolbarItemType, PlacedItemType } from "@/types";

const INITIAL_ITEMS: ToolbarItemType[] = [
  { id: "item-001", name: "Comida", shape: "image", imagePath: "/images/food.png", limit: 10 },
  { id: "item-002", name: "Silla", shape: "image", imagePath: "/images/silla.png", limit: 10 },
  { id: "item-003", name: "Mesa", shape: "image", imagePath: "/images/table.png", limit: 10 },
  { id: "item-004", name: "Retrete", shape: "image", imagePath: "/images/toilet.png", limit: 10 },
  { id: "item-005", name: "Café", shape: "image", imagePath: "/images/coffee.png", limit: 10 },
  { id: "item-006", name: "Cartas", shape: "image", imagePath: "/images/cards.png", limit: 10 },
  { id: "item-007", name: "Cama", shape: "image", imagePath: "/images/bed.png", limit: 10 },
  { id: "item-008", name: "tv", shape: "image", imagePath: "/images/tv.png", limit: 10 },
  { id: "item-009", name: "labubu", shape: "image", imagePath: "/images/labubu.png", limit: 10 },
  { id: "item-010", name: "shower", shape: "image", imagePath: "/images/shower.png", limit: 10 },
  { id: "item-011", name: "handwash", shape: "image", imagePath: "/images/handwash.png", limit: 10 },
  { id: "item-012", name: "refri", shape: "image", imagePath: "/images/refri.png", limit: 10 },
  { id: "item-013", name: "medkit", shape: "image", imagePath: "/images/medkit.png", limit: 10 }
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

  const bringItemToFront = useCallback((instanceId: string) => {
    setPlacedItems((prev) => {
      const itemIndex = prev.findIndex(item => item.instanceId === instanceId);
      if (itemIndex === -1 || itemIndex === prev.length - 1) return prev; // Already at front or not found
      
      const newItems = [...prev];
      const [movedItem] = newItems.splice(itemIndex, 1);
      newItems.push(movedItem);
      
      return newItems;
    });
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
    removeItemFromCanvas,
    bringItemToFront
  };
}
