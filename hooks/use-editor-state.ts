"use client";

import { useState, useCallback } from "react";
import type { ToolbarItemType, PlacedItemType } from "@/types";
import type { FunctionalAreaType } from "@/types";
import { FUNCTIONAL_AREA_REQUIREMENTS } from "@/lib/habitat/functional-areas";

// Convertir las áreas funcionales de NASA en items para el toolbar
const createFunctionalAreaItems = (): ToolbarItemType[] => {
  const areas: FunctionalAreaType[] = [
    "sleep-quarters",
    "hygiene-waste", 
    "food-prep",
    "exercise",
    "workstation",
    "stowage",
    "medical",
    "common-area"
  ];

  return areas.map(area => {
    const requirements = FUNCTIONAL_AREA_REQUIREMENTS[area];
    return {
      id: area,
      name: area.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      shape: "square" as const, // Todas las áreas funcionales son cuadradas/rectangulares
      limit: 5, // Límite flexible para permitir múltiples instancias
      icon: requirements.icon,
      color: requirements.color
    };
  });
};

const FUNCTIONAL_AREA_ITEMS = createFunctionalAreaItems();

const DEFAULT_SIZE = 140;
const MIN_SIZE = 50;
const MAX_SIZE = 400;

export function useEditorState() {
  const [availableItems] = useState<ToolbarItemType[]>(FUNCTIONAL_AREA_ITEMS);
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

      // Calcular tamaño basado en área funcional
      // Para áreas más grandes como common-area, hacer el tamaño inicial más grande
      let initialSize = DEFAULT_SIZE;
      if (itemId === "common-area" || itemId === "exercise") {
        initialSize = 180;
      } else if (itemId === "sleep-quarters" || itemId === "stowage") {
        initialSize = 160;
      }

      const newItem: PlacedItemType = {
        instanceId: `${itemId}-${Date.now()}-${Math.random()}`,
        itemId,
        position,
        size: initialSize
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
