"use client"

import { useContext, useRef, useState } from "react"
import type { PlacedItemType } from "@/types"
import { EditorContext } from "@/contexts/editor-context"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PlacedObjectProps {
  object: PlacedItemType
}

export function PlacedObject({ object }: PlacedObjectProps) {
  const context = useContext(EditorContext)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef<{ objX: number; objY: number; mouseX: number; mouseY: number } | null>(null)

  if (!context) return null

  const { isEditMode, removeItemFromCanvas, updateItemPosition, availableItems } = context
  const itemDefinition = availableItems.find(item => item.id === object.itemId)

  if (!itemDefinition) return null

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    removeItemFromCanvas(object.instanceId)
  }

  const handleDragStart = (e: React.MouseEvent) => {
    if (!isEditMode) return

    const target = e.target as HTMLElement
    if (target.closest('button')) {
      return
    }

    e.stopPropagation()
    setIsDragging(true)

    const canvas = document.querySelector('[data-canvas="true"]') as HTMLElement
    if (!canvas) return

    const canvasRect = canvas.getBoundingClientRect()
    const scale = canvasRect.width / parseFloat(canvas.style.width || "1920")

    dragStartRef.current = {
      objX: object.position.x,
      objY: object.position.y,
      mouseX: e.clientX,
      mouseY: e.clientY
    }

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!dragStartRef.current) return

      const deltaX = moveEvent.clientX - dragStartRef.current.mouseX
      const deltaY = moveEvent.clientY - dragStartRef.current.mouseY

      const nativeDeltaX = deltaX / scale
      const nativeDeltaY = deltaY / scale

      const newX = dragStartRef.current.objX + nativeDeltaX
      const newY = dragStartRef.current.objY + nativeDeltaY

      updateItemPosition(object.instanceId, { x: newX, y: newY })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      dragStartRef.current = null
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  return (
    <div
      className={`absolute transition-all ${isEditMode ? (isDragging ? "cursor-grabbing z-50" : "cursor-grab hover:opacity-90") : "cursor-default"
        }`}
      onMouseDown={isEditMode ? handleDragStart : undefined}
      style={{
        left: `${object.position.x}px`,
        top: `${object.position.y}px`,
        transform: `translate(-50%, -50%)`,
        transition: isDragging ? "none" : "all 0.2s ease",
        pointerEvents: "auto",
      }}
    >
      <div
        className={`relative flex items-center justify-center rounded-lg border-2 ${isDragging
          ? "shadow-2xl ring-2 ring-blue-500 bg-white"
          : "shadow-lg bg-white hover:shadow-xl"
          }`}
        style={{
          width: `${object.size}px`,
          height: `${object.size}px`,
          borderColor: itemDefinition.color || "#3b82f6",
          borderLeftWidth: "4px",
        }}
      >
        {/* Object Icon */}
        <div className="text-center pointer-events-none w-full h-full flex items-center justify-center">
          <span
            className="block"
            style={{ fontSize: `${object.size * 0.5}px` }}
          >
            {itemDefinition.icon || "📦"}
          </span>
        </div>

        {/* Object Label */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm px-1 py-0.5 text-center text-xs font-semibold text-white pointer-events-none rounded-b-lg"
        >
          {itemDefinition.name}
        </div>

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
          </>
        )}
      </div>
    </div>
  )
}
