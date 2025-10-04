export interface ToolbarItemType {
  id: string
  name: string
  shape: "triangle" | "square" | "circle"
  limit: number
}

export interface PlacedItemType {
  instanceId: string
  itemId: string
  position: {
    x: number
    y: number
  }
}

export interface EditorContextType {
  availableItems: ToolbarItemType[]
  placedItems: PlacedItemType[]
  addItemToCanvas: (itemId: string, position: { x: number; y: number }) => void
  getItemCountOnCanvas: (itemId: string) => number
}
