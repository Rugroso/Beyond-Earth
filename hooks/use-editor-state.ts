"use client";

import { useState, useCallback, useEffect } from "react";
import type { ToolbarItemType, PlacedItemType } from "@/types";
import { Computer } from "lucide-react";

const INITIAL_ITEMS: ToolbarItemType[] = [
  { id: "item-001", name: "Food", shape: "image", imagePath: "/images/food.png", limit: 10, minRequired: 2, category: "basics" },
  {
    id: "item-002",
    name: "Chair",
    shape: "image",
    imagePath: "/images/silla.png",
    limit: 2,
    minRequired: 4,
    category: "basics"
  },
  {
    id: "item-003",
    name: "Table",
    shape: "image",
    imagePath: "/images/table.png",
    limit: 1,
    minRequired: 1,
    category: "basics"
  },
  {
    id: "item-004",
    name: "Toilet",
    shape: "image",
    imagePath: "/images/toilet.png",
    limit: 1,
    minRequired: 1,
    category: "basics"
  },
  {
    id: "item-005",
    name: "Coffee",
    shape: "image",
    imagePath: "/images/coffee.png",
    limit: 2,
    minRequired: 1,
    category: "basics"
  },
  {
    id: "item-006",
    name: "Cards",
    shape: "image",
    imagePath: "/images/cards.png",
    limit: 1,
    minRequired: 0,
    category: "entertainment"
  },
  { id: "item-007", name: "Bed", shape: "image", imagePath: "/images/bed.png", limit: 10, minRequired: 3, category: "basics" },
  {
    id: "item-008",
    name: "TV",
    shape: "image",
    imagePath: "/images/tv.png",
    limit: 2,
    minRequired: 0,
    category: "entertainment"
  },
  {
    id: "item-009",
    name: "Labubu",
    shape: "image",
    imagePath: "/images/labubu.png",
    limit: 10,
    minRequired: 0,
    category: "miscellaneous"
  },
  {
    id: "item-010",
    name: "Shower",
    shape: "image",
    imagePath: "/images/shower.png",
    limit: 10,
    minRequired: 1,
    category: "basics"
  },
  {
    id: "item-011",
    name: "Handwash",
    shape: "image",
    imagePath: "/images/handwash.png",
    limit: 10,
    minRequired: 1,
    category: "basics"
  },
  {
    id: "item-012",
    name: "Fridge",
    shape: "image",
    imagePath: "/images/refri.png",
    limit: 10,
    minRequired: 1,
    category: "basics"
  },
  {
    id: "item-013",
    name: "Medkit",
    shape: "image",
    imagePath: "/images/medkit.png",
    limit: 10,
    minRequired: 1,
    category: "basics"
  },
  {
    id: "item-014",
    name: "Trashcan",
    shape: "image",
    imagePath: "/images/trashcan.png",
    limit: 10,
    minRequired: 1,
    category: "basics"
  },
  {
    id: "item-015",
    name: "Toolbox",
    shape: "image",
    imagePath: "/images/toolbox.png",
    limit: 10,
    minRequired: 1,
    category: "basics"
  },
  {
    id: "item-016",
    name: "Closet",
    shape: "image",
    imagePath: "/images/closet.png",
    limit: 10,
    minRequired: 2,
    category: "basics"
  },
  {
    id: "item-017",
    name: "Kitchen",
    shape: "image",
    imagePath: "/images/kitchen.png",
    limit: 10,
    minRequired: 1,
    category: "basics"
  },
  {
    id: "item-018",
    name: "Speaker",
    shape: "image",
    imagePath: "/images/speaker.png",
    limit: 10,
    minRequired: 0,
    category: "entertainment"
  },
  {
    id: "item-019",
    name: "Treadmill",
    shape: "image",
    imagePath: "/images/caminadora.png",
    limit: 10,
    minRequired: 1,
    category: "basics"
  },
  {
    id: "item-020",
    name: "Weights",
    shape: "image",
    imagePath: "/images/pesa.png",
    limit: 10,
    minRequired: 1,
    category: "basics"
  },
  {
    id: "item-021",
    name: "Computer",
    shape: "image",
    imagePath: "/images/computer.png",
    limit: 10,
    minRequired: 0,
    category: "entertainment"
  },
  {
    id: "item-022",
    name: "Radio",
    shape: "image",
    imagePath: "/images/radio.png",
    limit: 10,
    minRequired: 0,
    category: "miscellaneous"
  },
  {
    id: "item-023",
    name: "Solar Battery",
    shape: "image",
    imagePath: "/images/solar_battery.png",
    limit: 5,
    minRequired: 2,
    category: "basics"
  },
  {
    id: "item-024",
    name: "Clean Kit",
    shape: "image",
    imagePath: "/images/clean_kit.png",
    limit: 5,
    minRequired: 1,
    category: "basics"
  }
];

const DEFAULT_SIZE = 140;
const MIN_SIZE = 50;
const MAX_SIZE = 400;

export function useEditorState() {
  const [availableItems, setAvailableItems] = useState<ToolbarItemType[]>(INITIAL_ITEMS);
  const [placedItems, setPlacedItems] = useState<PlacedItemType[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const [isEditMode, setIsEditMode] = useState<boolean>(true);
  const [backgroundImage, setBackgroundImage] = useState<string>("/images/bg-1.png");

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

  const addCustomAsset = useCallback((name: string, imageDataUrl: string) => {
    const timestamp = Date.now();
    const newAsset: ToolbarItemType = {
      id: `custom-${timestamp}`,
      name: name,
      shape: "image",
      imagePath: imageDataUrl, // Using data URL directly
      limit: 15,
      minRequired: 0,
      category: "miscellaneous"
    };

    setAvailableItems((prev) => [...prev, newAsset]);
  }, []);

  return {
    availableItems,
    placedItems,
    selectedItemIds,
    isEditMode,
    backgroundImage,
    setIsEditMode,
    setBackgroundImage,
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
    areRequirementsMet,
    addCustomAsset
  };
}
