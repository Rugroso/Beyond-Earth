export interface ToolbarItemType {
  id: string;
  name: string;
  shape: "triangle" | "square" | "circle";
  limit: number;
}

export interface PlacedItemType {
  instanceId: string;
  itemId: string;
  position: {
    x: number;
    y: number;
  };
  size: number; // Size in pixels (base: 80, min: 50, max: 200)
}

export interface EditorContextType {
  availableItems: ToolbarItemType[];
  placedItems: PlacedItemType[];
  isEditMode: boolean;
  setIsEditMode: (isEditMode: boolean) => void;
  addItemToCanvas: (itemId: string, position: { x: number; y: number }) => void;
  getItemCountOnCanvas: (itemId: string) => number;
  updateItemPosition: (instanceId: string, newPosition: { x: number; y: number }) => void;
  updateItemSize: (instanceId: string, newSize: number) => void;
  removeItemFromCanvas: (instanceId: string) => void;
}
