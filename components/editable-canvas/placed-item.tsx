"use client"

import { useContext, useRef, useState } from "react"
import type { PlacedItemType } from "@/types"
import { EditorContext } from "@/contexts/editor-context"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PlacedItemProps {
  item: PlacedItemType
}

export function PlacedItem({ item }: PlacedItemProps) {
  const context = useContext(EditorContext)
  const [isResizing, setIsResizing] = useState(false)
  const resizeStartRef = useRef<{ size: number; mouseX: number; mouseY: number } | null>(null)
  
  if (!context) return null

  const { availableItems, isEditMode, removeItemFromCanvas, updateItemSize } = context
  const itemDefinition = availableItems.find((i) => i.id === item.itemId)
  if (!itemDefinition) return null

  const { shape } = itemDefinition

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    if (!isEditMode || isResizing) {
      event.preventDefault()
      return
    }
    event.dataTransfer.setData("instanceId", item.instanceId)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    removeItemFromCanvas(item.instanceId)
  }

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsResizing(true)
    resizeStartRef.current = {
      size: item.size,
      mouseX: e.clientX,
      mouseY: e.clientY
    }

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!resizeStartRef.current) return
      
      const deltaX = moveEvent.clientX - resizeStartRef.current.mouseX
      const deltaY = moveEvent.clientY - resizeStartRef.current.mouseY
      const delta = (deltaX + deltaY) / 2 // Average of both axes for diagonal scaling
      
      const newSize = resizeStartRef.current.size + delta
      updateItemSize(item.instanceId, newSize)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      resizeStartRef.current = null
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const containerSize = item.size
  const shapeSize = item.size * 0.5

  return (
    <div
      className={`absolute transition-all ${isEditMode && !isResizing ? "cursor-move wiggle" : "cursor-default"}`}
      draggable={isEditMode && !isResizing}
      onDragStart={handleDragStart}
      style={{
        left: `${item.position.x}px`,
        top: `${item.position.y}px`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div 
        className="relative flex items-center justify-center bg-muted rounded-lg"
        style={{
          width: `${containerSize}px`,
          height: `${containerSize}px`,
        }}
      >
        {shape === "triangle" && (
          <div 
            style={{
              width: 0,
              height: 0,
              borderLeft: `${shapeSize * 0.575}px solid transparent`,
              borderRight: `${shapeSize * 0.575}px solid transparent`,
              borderBottom: `${shapeSize}px solid hsl(var(--foreground) / 0.6)`,
            }}
          />
        )}
        {shape === "square" && (
          <div 
            className="bg-foreground/60 rounded"
            style={{
              width: `${shapeSize}px`,
              height: `${shapeSize}px`,
            }}
          />
        )}
        {shape === "circle" && (
          <div 
            className="bg-foreground/60 rounded-full"
            style={{
              width: `${shapeSize}px`,
              height: `${shapeSize}px`,
            }}
          />
        )}

        {isEditMode && (
          <>
            {/* Delete button */}
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-lg z-10"
              onClick={handleDelete}
            >
              <X className="h-3 w-3" />
            </Button>

            {/* Resize handle - bottom right corner */}
            <div
              className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 hover:bg-blue-600 cursor-nwse-resize rounded-br-lg shadow-lg z-10 flex items-end justify-end"
              onMouseDown={handleResizeStart}
              style={{
                clipPath: "polygon(100% 0, 100% 100%, 0 100%)"
              }}
            >
              {/* Grip lines */}
              <div className="absolute bottom-0.5 right-0.5 flex flex-col gap-0.5">
                <div className="w-2 h-0.5 bg-white/70"></div>
                <div className="w-1.5 h-0.5 bg-white/70 ml-auto"></div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
