"use client"

import { useState, useCallback } from "react"
import type { ToolbarItemType, PlacedItemType } from "@/types"

const INITIAL_ITEMS: ToolbarItemType[] = [
  { id: "item-001", name: "Componente A", shape: "square", limit: 5 },
  { id: "item-002", name: "Componente B", shape: "circle", limit: 3 },
  { id: "item-003", name: "Componente C", shape: "triangle", limit: 2 },
]

export function useEditorState() {
  const [availableItems] = useState<ToolbarItemType[]>(INITIAL_ITEMS)
  const [placedItems, setPlacedItems] = useState<PlacedItemType[]>([])

  const getItemCountOnCanvas = useCallback(
    (itemId: string): number => {
      return placedItems.filter((item) => item.itemId === itemId).length
    },
    [placedItems],
  )

  const addItemToCanvas = useCallback(
    (itemId: string, position: { x: number; y: number }) => {
      const item = availableItems.find((i) => i.id === itemId)
      if (!item) return

      const currentCount = getItemCountOnCanvas(itemId)
      if (currentCount >= item.limit) return

      const newItem: PlacedItemType = {
        instanceId: `${itemId}-${Date.now()}-${Math.random()}`,
        itemId,
        position,
      }

      setPlacedItems((prev) => [...prev, newItem])
    },
    [availableItems, getItemCountOnCanvas],
  )

  const updateItemPosition = useCallback(
    (instanceId: string, newPosition: { x: number; y: number }) => {
      setPlacedItems((prev) =>
        prev.map((item) =>
          item.instanceId === instanceId
            ? { ...item, position: newPosition }
            : item
        )
      )
    },
    []
  )

  return {
    availableItems,
    placedItems,
    addItemToCanvas,
    getItemCountOnCanvas,
    updateItemPosition,
  }
}
