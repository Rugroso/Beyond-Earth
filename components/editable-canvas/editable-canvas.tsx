"use client"

import { useContext } from "react"
import { EditorContext } from "@/contexts/editor-context"
import { useEditableCanvas } from "@/hooks/use-editable-canvas"
import { PlacedItem } from "./placed-item"

export function EditableCanvas() {
  const context = useContext(EditorContext)
  const { handleDragOver, handleDrop } = useEditableCanvas()

  if (!context) return null

  const { placedItems } = context

  return (
    <div onDragOver={handleDragOver} onDrop={handleDrop} className="relative h-full w-full bg-background">
      {placedItems.map((item) => (
        <PlacedItem key={item.instanceId} item={item} />
      ))}
    </div>
  )
}
