export type ItemCategory = "basics" | "entertainment" | "miscellaneous";

export interface ToolbarItemType {
  id: string;
  name: string;
  shape: "triangle" | "square" | "circle" | "image";
  limit: number;
  category: ItemCategory;
  imagePath?: string; // Path to the image if shape is "image"
}

export interface PlacedItemType {
  instanceId: string;
  itemId: string;
  position: {
    x: number;
    y: number;
  };
  size: number; // Size in pixels (base: 80, min: 50, max: 200)
  zIndex: number; // Layer order (higher = on top)
}

export interface EditorContextType {
  availableItems: ToolbarItemType[];
  placedItems: PlacedItemType[];
  selectedItemIds: Set<string>;
  isEditMode: boolean;
  setIsEditMode: (isEditMode: boolean) => void;
  addItemToCanvas: (itemId: string, position: { x: number; y: number }) => void;
  getItemCountOnCanvas: (itemId: string) => number;
  updateItemPosition: (instanceId: string, newPosition: { x: number; y: number }) => void;
  updateItemSize: (instanceId: string, newSize: number) => void;
  removeItemFromCanvas: (instanceId: string) => void;
  selectItem: (instanceId: string, options?: { shiftKey?: boolean; ctrlKey?: boolean }) => void;
  clearSelection: () => void;
  deleteSelectedItems: () => void;
  isItemSelected: (instanceId: string) => boolean;
  bringToFront: (instanceIds: string[]) => void;
  sendToBack: (instanceIds: string[]) => void;
  bringForward: (instanceIds: string[]) => void;
  sendBackward: (instanceIds: string[]) => void;
}
