"use client"

import { useContext, useRef, useState } from "react"
import type { PlacedObject as PlacedObjectType } from "@/types"
import { EditorContext } from "@/contexts/editor-context"
import { getObjectDisplay } from "@/lib/habitat/object-definitions"
import { OBJECT_DEFINITIONS } from "@/lib/habitat/object-definitions"
import { X, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PlacedObjectProps {
  object: PlacedObjectType
}

export function PlacedObject({ object }: PlacedObjectProps) {
  const context = useContext(EditorContext)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef<{ objX: number; objY: number; mouseX: number; mouseY: number } | null>(null)

  if (!context) return null

  const { isEditMode, removeObject, updateObjectPosition, updateObjectRotation } = context
  const definition = OBJECT_DEFINITIONS[object.objectType]

  if (!definition) return null

  // Get display (emoji or asset image)
  const display = getObjectDisplay(object.objectType)

  // Convert meters to pixels (50px = 1m scale)
  const PIXELS_PER_METER = 50
  const widthPx = definition.width * PIXELS_PER_METER * object.size
  const heightPx = definition.height * PIXELS_PER_METER * object.size

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    removeObject(object.instanceId)
  }

  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    updateObjectRotation(object.instanceId, (object.rotation + 90) % 360)
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

      updateObjectPosition(object.instanceId, { x: newX, y: newY })
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
        transform: `translate(-50%, -50%) rotate(${object.rotation}deg)`,
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
          width: `${widthPx}px`,
          height: `${heightPx}px`,
          borderColor: definition.color,
          borderLeftWidth: "4px",
        }}
      >
        {/* Object Icon or Image */}
        <div className="text-center pointer-events-none w-full h-full flex items-center justify-center">
          {display.type === 'image' ? (
            <img
              src={display.value}
              alt={definition.name}
              className="max-w-full max-h-full object-contain"
              style={{ width: '90%', height: '90%' }}
            />
          ) : (
            <span
              className="block"
              style={{ fontSize: `${Math.min(widthPx, heightPx) * 0.6}px` }}
            >
              {display.value}
            </span>
          )}
        </div>

        {/* Object Label */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm px-1 py-0.5 text-center text-xs font-semibold text-white pointer-events-none rounded-b-lg"
        >
          {definition.name}
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

            {/* Rotate button */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute -top-2 -left-2 h-6 w-6 rounded-full shadow-lg z-10 pointer-events-auto"
              onClick={handleRotate}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <RotateCw className="h-3 w-3" />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
