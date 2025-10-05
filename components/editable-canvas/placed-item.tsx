"use client"

import { useContext, useRef, useState } from "react"
import type { PlacedItemType } from "@/types"
import { EditorContext } from "@/contexts/editor-context"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FUNCTIONAL_AREA_REQUIREMENTS } from "@/lib/habitat/functional-areas"
import type { FunctionalAreaType } from "@/types"

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
  
  // Obtener info del área funcional
  const areaRequirements = FUNCTIONAL_AREA_REQUIREMENTS[item.itemId as FunctionalAreaType]

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    removeItemFromCanvas(item.instanceId)
  }

  const handleDragStart = (e: React.MouseEvent) => {
    if (!isEditMode || isResizing) return

    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('[data-resize-handle]')) {
      return
    }

    e.stopPropagation()
    setIsDragging(true)

    const canvas = document.querySelector('[data-canvas="true"]')
    if (!canvas) return

    const canvasRect = canvas.getBoundingClientRect()

    const offsetX = e.clientX - canvasRect.left - item.position.x
    const offsetY = e.clientY - canvasRect.top - item.position.y
    setDragOffset({ x: offsetX, y: offsetY })

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newX = moveEvent.clientX - canvasRect.left - offsetX
      const newY = moveEvent.clientY - canvasRect.top - offsetY

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
      const delta = (deltaX + deltaY) / 2
      const newSize = Math.max(40, resizeStartRef.current.size + delta)
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
        className={`relative flex flex-col items-center justify-center rounded-lg border-2 ${
          isDragging ? "bg-slate-700/90 shadow-2xl ring-2 ring-blue-500" : "bg-slate-800/80"
        }`}
        style={{
          width: `${containerSize}px`,
          height: `${containerSize}px`,
          borderColor: areaRequirements?.color || "#64748b",
          borderLeftWidth: "6px",
          borderLeftColor: areaRequirements?.color
        }}
      >
        {/* Icon del área funcional */}
        {areaRequirements?.icon && (
          <div className="text-4xl mb-1">{areaRequirements.icon}</div>
        )}
        
        {/* Nombre del área */}
        <span className="text-white text-xs font-semibold text-center px-2 leading-tight">
          {itemDefinition.name}
        </span>

        {/* Tamaño en metros */}
        <div className="mt-1 text-xs text-blue-200/80">
          {(containerSize / 20).toFixed(1)}m
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

            {/* Resize handle */}
            <div
              data-resize-handle="true"
              className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 hover:bg-blue-600 cursor-nwse-resize rounded-br-lg shadow-lg z-10 flex items-end justify-end pointer-events-auto"
              onMouseDown={handleResizeStart}
              style={{
                clipPath: "polygon(100% 0, 100% 100%, 0 100%)"
              }}
            >
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
