"use client";

import { useState, useCallback, useEffect } from "react";
import type { ToolbarItemType, PlacedItemType } from "@/types";

const INITIAL_ITEMS: ToolbarItemType[] = [
  {
    id: "item-001",
    name: "Comida",
    shape: "image",
    imagePath: "/images/food.png",
    limit: 10,
    minRequired: 2,
    category: "basics"
  },
  {
    id: "item-002",
    name: "Silla",
    shape: "image",
    imagePath: "/images/silla.png",
    limit: 10,
    minRequired: 4,
    category: "basics"
  },
  { id: "item-003", name: "Mesa", shape: "image", imagePath: "/images/table.png", limit: 10, minRequired: 1, category: "basics" },
  {
    id: "item-004",
    name: "Retrete",
    shape: "image",
    imagePath: "/images/toilet.png",
    limit: 10,
    minRequired: 1,
    category: "basics"
  },
  {
    id: "item-005",
    name: "Café",
    shape: "image",
    imagePath: "/images/coffee.png",
    limit: 10,
    minRequired: 1,
    category: "basics"
  },
  {
    id: "item-006",
    name: "Cartas",
    shape: "image",
    imagePath: "/images/cards.png",
    limit: 10,
    minRequired: 0,
    category: "entertainment"
  },
  { id: "item-007", name: "Cama", shape: "image", imagePath: "/images/bed.png", limit: 10, minRequired: 3, category: "basics" },
  {
    id: "item-008",
    name: "tv",
    shape: "image",
    imagePath: "/images/tv.png",
    limit: 10,
    minRequired: 0,
    category: "entertainment"
  },
  {
    id: "item-009",
    name: "labubu",
    shape: "image",
    imagePath: "/images/labubu.png",
    limit: 10,
    minRequired: 0,
    category: "miscellaneous"
  },
  {
    id: "item-010",
    name: "shower",
    shape: "image",
    imagePath: "/images/shower.png",
    limit: 10,
    minRequired: 1,
    category: "basics"
  },
  {
    id: "item-011",
    name: "handwash",
    shape: "image",
    imagePath: "/images/handwash.png",
    limit: 10,
    minRequired: 1,
    category: "basics"
  },
  {
    id: "item-012",
    name: "refri",
    shape: "image",
    imagePath: "/images/refri.png",
    limit: 10,
    minRequired: 1,
    category: "basics"
  },
  {
    id: "item-013",
    name: "medkit",
    shape: "image",
    imagePath: "/images/medkit.png",
    limit: 10,
    minRequired: 1,
    category: "basics"
  },
  {
    id: "item-014",
    name: "trashcan",
    shape: "image",
    imagePath: "/images/trashcan.png",
    limit: 10,
    minRequired: 1,
    category: "basics"
  },
  {
    id: "item-015",
    name: "toolbox",
    shape: "image",
    imagePath: "/images/toolbox.png",
    limit: 10,
    minRequired: 1,
    category: "basics"
  },
  {
    id: "item-016",
    name: "closet",
    shape: "image",
    imagePath: "/images/closet.png",
    limit: 10,
    minRequired: 2,
    category: "basics"
  },
  {
    id: "item-017",
    name: "kitchen",
    shape: "image",
    imagePath: "/images/kitchen.png",
    limit: 10,
    minRequired: 1,
    category: "basics"
  }
];

const DEFAULT_SIZE = 140;
const MIN_SIZE = 50;
const MAX_SIZE = 400;

export function useEditorState() {
  const [availableItems] = useState<ToolbarItemType[]>(INITIAL_ITEMS);
  const [placedItems, setPlacedItems] = useState<PlacedItemType[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const [isEditMode, setIsEditMode] = useState<boolean>(true);

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

      // Calcular el z-index más alto actual de forma segura
      const maxZIndex = placedItems.length > 0 ? Math.max(0, ...placedItems.map((item) => item.zIndex || 0)) : 0;

      const newItem: PlacedItemType = {
        instanceId: `${itemId}-${Date.now()}-${Math.random()}`,
        itemId,
        position,
        size: DEFAULT_SIZE,
        zIndex: maxZIndex + 1 // Nuevo item siempre al frente
      };

      setPlacedItems((prev) => [...prev, newItem]);

      // Auto-select the newly added item
      setSelectedItemIds(new Set([newItem.instanceId]));
    },
    [availableItems, getItemCountOnCanvas, placedItems]
  );

  const updateItemPosition = useCallback((instanceId: string, newPosition: { x: number; y: number }) => {
    setPlacedItems((prev) => prev.map((item) => (item.instanceId === instanceId ? { ...item, position: newPosition } : item)));
  }, []);

  const bringItemToFront = useCallback((instanceId: string) => {
    setPlacedItems((prev) => {
      const itemIndex = prev.findIndex((item) => item.instanceId === instanceId);
      if (itemIndex === -1 || itemIndex === prev.length - 1) return prev; // Already at front or not found

      const newItems = [...prev];
      const [movedItem] = newItems.splice(itemIndex, 1);
      newItems.push(movedItem);

      return newItems;
    });
  }, []);

  const updateItemSize = useCallback((instanceId: string, newSize: number) => {
    const clampedSize = Math.max(MIN_SIZE, Math.min(MAX_SIZE, newSize));
    setPlacedItems((prev) => prev.map((item) => (item.instanceId === instanceId ? { ...item, size: clampedSize } : item)));
  }, []);

  const removeItemFromCanvas = useCallback((instanceId: string) => {
    setPlacedItems((prev) => prev.filter((item) => item.instanceId !== instanceId));
    setSelectedItemIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(instanceId);
      return newSet;
    });
  }, []);

  const selectItem = useCallback((instanceId: string, options?: { shiftKey?: boolean; ctrlKey?: boolean }) => {
    const { shiftKey = false, ctrlKey = false } = options || {};

    setSelectedItemIds((prev) => {
      const newSet = new Set(prev);

      if (shiftKey || ctrlKey) {
        // Multi-selection: toggle the item
        if (newSet.has(instanceId)) {
          newSet.delete(instanceId);
        } else {
          newSet.add(instanceId);
        }
      } else {
        // Single selection: replace all with this item
        newSet.clear();
        newSet.add(instanceId);
      }

      return newSet;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedItemIds(new Set());
  }, []);

  const deleteSelectedItems = useCallback(() => {
    setPlacedItems((prev) => prev.filter((item) => !selectedItemIds.has(item.instanceId)));
    setSelectedItemIds(new Set());
  }, [selectedItemIds]);

  const isItemSelected = useCallback(
    (instanceId: string) => {
      return selectedItemIds.has(instanceId);
    },
    [selectedItemIds]
  );

  const bringToFront = useCallback((instanceIds: string[]) => {
    setPlacedItems((prev) => {
      if (prev.length === 0) return prev;
      const maxZIndex = Math.max(0, ...prev.map((item) => item.zIndex || 0));
      return prev.map((item) => {
        if (instanceIds.includes(item.instanceId)) {
          return { ...item, zIndex: maxZIndex + 1 };
        }
        return item;
      });
    });
  }, []);

  const sendToBack = useCallback((instanceIds: string[]) => {
    setPlacedItems((prev) => {
      if (prev.length === 0) return prev;
      const minZIndex = Math.min(0, ...prev.map((item) => item.zIndex || 0));
      return prev.map((item) => {
        if (instanceIds.includes(item.instanceId)) {
          return { ...item, zIndex: minZIndex - 1 };
        }
        return item;
      });
    });
  }, []);

  const bringForward = useCallback((instanceIds: string[]) => {
    setPlacedItems((prev) => {
      return prev.map((item) => {
        if (instanceIds.includes(item.instanceId)) {
          return { ...item, zIndex: (item.zIndex || 0) + 1 };
        }
        return item;
      });
    });
  }, []);

  const sendBackward = useCallback((instanceIds: string[]) => {
    setPlacedItems((prev) => {
      return prev.map((item) => {
        if (instanceIds.includes(item.instanceId)) {
          return { ...item, zIndex: (item.zIndex || 0) - 1 };
        }
        return item;
      });
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Delete key - remove selected items
      if (event.key === "Delete" || event.key === "Backspace") {
        if (selectedItemIds.size > 0) {
          event.preventDefault();
          deleteSelectedItems();
        }
      }

      // Ctrl+A or Cmd+A - select all items
      if ((event.ctrlKey || event.metaKey) && event.key === "a") {
        event.preventDefault();
        const allIds = placedItems.map((item) => item.instanceId);
        setSelectedItemIds(new Set(allIds));
      }

      // Escape - clear selection
      if (event.key === "Escape") {
        clearSelection();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [placedItems, selectedItemIds, deleteSelectedItems, clearSelection]);

  const getRequirementsStatus = useCallback(() => {
    return availableItems
      .filter((item) => item.minRequired > 0) // Solo items con requirements
      .map((item) => {
        const current = getItemCountOnCanvas(item.id);
        return {
          itemId: item.id,
          name: item.name,
          current,
          required: item.minRequired,
          isMet: current >= item.minRequired
        };
      });
  }, [availableItems, getItemCountOnCanvas]);

  const areRequirementsMet = useCallback(() => {
    const status = getRequirementsStatus();
    return status.every((req) => req.isMet);
  }, [getRequirementsStatus]);

  return {
    availableItems,
    placedItems,
    selectedItemIds,
    isEditMode,
    setIsEditMode,
    addItemToCanvas,
    getItemCountOnCanvas,
    updateItemPosition,
    updateItemSize,
    removeItemFromCanvas,
    selectItem,
    clearSelection,
    deleteSelectedItems,
    isItemSelected,
    bringToFront,
    sendToBack,
    bringForward,
    sendBackward,
    getRequirementsStatus,
    areRequirementsMet
  };
}
