"use client"

import { useContext } from "react"
import type { PlacedItemType } from "@/types"
import { EditorContext } from "@/contexts/editor-context"

interface PlacedItemProps {
  item: PlacedItemType
}

export function PlacedItem({ item }: PlacedItemProps) {
  const context = useContext(EditorContext)
  if (!context) return null

  const { availableItems } = context
  const itemDefinition = availableItems.find((i) => i.id === item.itemId)
  if (!itemDefinition) return null

  const { shape } = itemDefinition

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData("instanceId", item.instanceId)
  }

  return (
    <div
      className="absolute cursor-move"
      draggable={true}
      onDragStart={handleDragStart}
      style={{
        left: `${item.position.x}px`,
        top: `${item.position.y}px`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="relative flex h-20 w-20 items-center justify-center bg-muted rounded-lg">
        {shape === "triangle" && (
          <div className="h-0 w-0 border-b-[40px] border-l-[23px] border-r-[23px] border-b-foreground/60 border-l-transparent border-r-transparent" />
        )}
        {shape === "square" && <div className="h-10 w-10 bg-foreground/60 rounded" />}
        {shape === "circle" && <div className="h-10 w-10 bg-foreground/60 rounded-full" />}
      </div>
    </div>
  )
}
