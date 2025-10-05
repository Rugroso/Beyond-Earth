"use client"

import { useContext, useRef, useState } from "react"
import type { PlacedZone } from "@/types"
import { EditorContext } from "@/contexts/editor-context"
import { FUNCTIONAL_AREA_REQUIREMENTS } from "@/lib/habitat/functional-areas"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PlacedZoneProps {
  zone: PlacedZone
}

export function PlacedZone({ zone }: PlacedZoneProps) {
  const context = useContext(EditorContext)
  const [isResizing, setIsResizing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const resizeStartRef = useRef<{ dimensions: { width: number; height: number }; mouseX: number; mouseY: number } | null>(null)
  const dragStartRef = useRef<{ zoneX: number; zoneY: number; mouseX: number; mouseY: number } | null>(null)

  if (!context) return null

  const { isEditMode, removeZone, updateZonePosition, updateZoneDimensions, validationResult, missionConfig } = context
  const requirements = FUNCTIONAL_AREA_REQUIREMENTS[zone.zoneType]

  // Check if this zone has validation errors
  const hasError = validationResult.issues.some(
    issue => issue.severity === "error" && issue.affectedZoneId === zone.instanceId
  )

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    removeZone(zone.instanceId)
  }

  const handleDragStart = (e: React.MouseEvent) => {
    if (!isEditMode || isResizing) return

    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('[data-resize-handle]')) {
      return
    }

    e.stopPropagation()
    setIsDragging(true)

    const canvas = document.querySelector('[data-canvas="true"]') as HTMLElement
    if (!canvas) return

    const canvasRect = canvas.getBoundingClientRect()
    const scale = canvasRect.width / parseFloat(canvas.style.width || "1920")

    dragStartRef.current = {
      zoneX: zone.position.x,
      zoneY: zone.position.y,
      mouseX: e.clientX,
      mouseY: e.clientY
    }

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!dragStartRef.current) return

      const deltaX = moveEvent.clientX - dragStartRef.current.mouseX
      const deltaY = moveEvent.clientY - dragStartRef.current.mouseY

      const nativeDeltaX = deltaX / scale
      const nativeDeltaY = deltaY / scale

      const newX = dragStartRef.current.zoneX + nativeDeltaX
      const newY = dragStartRef.current.zoneY + nativeDeltaY

      updateZonePosition(zone.instanceId, { x: newX, y: newY })
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

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsResizing(true)
    resizeStartRef.current = {
      dimensions: zone.dimensions,
      mouseX: e.clientX,
      mouseY: e.clientY
    }

    const canvas = document.querySelector('[data-canvas="true"]') as HTMLElement
    const canvasRect = canvas.getBoundingClientRect()
    const scale = canvasRect.width / parseFloat(canvas.style.width || "1920")

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!resizeStartRef.current) return

      const deltaX = moveEvent.clientX - resizeStartRef.current.mouseX
      const deltaY = moveEvent.clientY - resizeStartRef.current.mouseY

      const nativeDeltaX = deltaX / scale
      const nativeDeltaY = deltaY / scale

      const newWidth = Math.max(50, resizeStartRef.current.dimensions.width + nativeDeltaX)
      const newHeight = Math.max(50, resizeStartRef.current.dimensions.height + nativeDeltaY)

      updateZoneDimensions(zone.instanceId, { width: newWidth, height: newHeight })
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

  return (
    <div
      data-zone-id={zone.instanceId}
      className={`absolute transition-all ${isEditMode && !isResizing ? (isDragging ? "cursor-grabbing z-50" : "cursor-grab hover:opacity-90") : "cursor-default"}`}
      onMouseDown={isEditMode && !isResizing ? handleDragStart : undefined}
      style={{
        left: `${zone.position.x}px`,
        top: `${zone.position.y}px`,
        transform: "translate(-50%, -50%)",
        transition: isDragging ? "none" : "all 0.2s ease",
        pointerEvents: "auto",
      }}
    >
      <div
        className={`relative rounded-lg border-2 ${hasError
            ? "bg-red-500/20 border-red-500 shadow-lg shadow-red-500/50"
            : isDragging
              ? "shadow-2xl ring-2 ring-blue-500"
              : "shadow-lg"
          }`}
        style={{
          width: `${zone.dimensions.width}px`,
          height: `${zone.dimensions.height}px`,
          backgroundColor: hasError ? undefined : `${requirements.color}40`,
          borderColor: hasError ? undefined : requirements.color,
          borderLeftWidth: "6px",
        }}
      >
        {/* Zone Label */}
        <div
          className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-white pointer-events-none"
        >
          <span>{requirements.icon}</span>
          <span>{zone.zoneType.replace(/-/g, " ")}</span>
        </div>

        {/* Area Display */}
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white pointer-events-none">
          {zone.areaM2.toFixed(1)} m²
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

            {/* Resize handle - bottom right corner */}
            <div
              data-resize-handle="true"
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 hover:bg-blue-600 cursor-nwse-resize rounded-br-lg shadow-lg z-10 flex items-end justify-end pointer-events-auto"
              onMouseDown={handleResizeStart}
              style={{
                clipPath: "polygon(100% 0, 100% 100%, 0 100%)"
              }}
            >
              <div className="absolute bottom-1 right-1 flex flex-col gap-0.5 pointer-events-none">
                <div className="w-3 h-0.5 bg-white/70"></div>
                <div className="w-2 h-0.5 bg-white/70 ml-auto"></div>
              </div>
            </div>
          </>
        )}

        {/* Error Indicator */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              TOO SMALL
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
