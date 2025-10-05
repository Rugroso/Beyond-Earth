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
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const resizeStartRef = useRef<{ size: number; mouseX: number; mouseY: number } | null>(null)

  if (!context) return null

  const { availableItems, isEditMode, removeItemFromCanvas, updateItemPosition, updateItemSize } = context
  const itemDefinition = availableItems.find((i) => i.id === item.itemId)
  if (!itemDefinition) return null

  const { shape } = itemDefinition

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    removeItemFromCanvas(item.instanceId)
  }

  const handleDragStart = (e: React.MouseEvent) => {
    if (!isEditMode || isResizing) return

    // Don't start dragging if clicking on buttons or resize handle
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('[data-resize-handle]')) {
      return
    }

    e.stopPropagation()
    setIsDragging(true)

    // Get the canvas element (parent container)
    const canvas = document.querySelector('[data-canvas="true"]')
    if (!canvas) return

    const canvasRect = canvas.getBoundingClientRect()

    // Calculate offset from mouse to item's current position
    const offsetX = e.clientX - canvasRect.left - item.position.x
    const offsetY = e.clientY - canvasRect.top - item.position.y
    setDragOffset({ x: offsetX, y: offsetY })

    const handleMouseMove = (moveEvent: MouseEvent) => {
      // Calculate new position relative to canvas
      const newX = moveEvent.clientX - canvasRect.left - offsetX
      const newY = moveEvent.clientY - canvasRect.top - offsetY

      // Update position
      updateItemPosition(item.instanceId, { x: newX, y: newY })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
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

      const newSize = Math.max(40, resizeStartRef.current.size + delta) // Minimum size of 40px
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
      data-placed-item="true"
      data-shape={shape}
      data-x={item.position.x}
      data-y={item.position.y}
      data-size={item.size}
      className={`absolute transition-all ${isEditMode && !isResizing ? (isDragging ? "cursor-grabbing scale-110 z-50" : "cursor-grab hover:scale-105") : "cursor-default"}`}
      onMouseDown={isEditMode && !isResizing ? handleDragStart : undefined}
      style={{
        left: `${item.position.x}px`,
        top: `${item.position.y}px`,
        transform: "translate(-50%, -50%)",
        transition: isDragging ? "none" : "all 0.2s ease",
        pointerEvents: "auto",
      }}
    >
      <div
        className="relative flex items-center justify-center"
        style={{
          width: `${containerSize}px`,
          height: `${containerSize}px`,
        }}
      >
        {shape === "image" && itemDefinition.imagePath && (
          <img 
            src={itemDefinition.imagePath} 
            alt={itemDefinition.name}
            className="object-contain"
            style={{
              width: `${containerSize * 0.8}px`,
              height: `${containerSize * 0.8}px`,
            }}
            draggable={false}
          />
        )}

        {isEditMode && !isDragging && (
          <>
            {/* Delete button */}
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-lg z-10 pointer-events-auto"
              onClick={handleDelete}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <X className="h-3 w-3" />
            </Button>

            {/* Resize handle - bottom right corner */}
            <div
              data-resize-handle="true"
              className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 hover:bg-blue-600 cursor-nwse-resize rounded-br-lg shadow-lg z-10 flex items-end justify-end pointer-events-auto"
              onMouseDown={handleResizeStart}
              style={{
                clipPath: "polygon(100% 0, 100% 100%, 0 100%)"
              }}
            >
              {/* Grip lines */}
              <div className="absolute bottom-0.5 right-0.5 flex flex-col gap-0.5 pointer-events-none">
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
