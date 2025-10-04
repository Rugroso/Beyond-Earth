"use client"

import { useContext } from "react"
import { EditorContext } from "@/contexts/editor-context"
import { useEditableCanvas } from "@/hooks/use-editable-canvas"
import { useScaledCanvas } from "@/hooks/use-scaled-canvas"
import { PlacedItem } from "./placed-item"

export function EditableCanvas() {
  const context = useContext(EditorContext)
  const { scale, viewportRef, contentRef, translateMouseCoordinates, nativeWidth, nativeHeight } = useScaledCanvas()
  const { handleDragOver, handleDrop } = useEditableCanvas({ translateMouseCoordinates })

  if (!context) return null

  const { placedItems } = context

  // Calculate the scaled dimensions
  const scaledWidth = nativeWidth * scale
  const scaledHeight = nativeHeight * scale

  return (
    // Viewport layer: flexible container that centers its content
    <div 
      ref={viewportRef}
      className="relative h-full w-full overflow-hidden bg-slate-800"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Wrapper to hold the scaled content and center it properly */}
      <div
        style={{
          width: `${scaledWidth}px`,
          height: `${scaledHeight}px`,
          position: 'relative',
        }}
      >
        {/* Content layer: fixed native dimensions with scale transform */}
        <div
          ref={contentRef}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="relative bg-white shadow-2xl"
          style={{
            width: `${nativeWidth}px`,
            height: `${nativeHeight}px`,
            transformOrigin: 'top left',
            transform: `scale(${scale})`,
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          {placedItems.map((item) => (
            <PlacedItem key={item.instanceId} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}
