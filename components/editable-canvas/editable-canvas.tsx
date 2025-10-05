"use client"

import { useContext, useState, useEffect } from "react"
import { EditorContext } from "@/contexts/editor-context"
import { useEditableCanvas } from "@/hooks/use-editable-canvas"
import { useScaledCanvas } from "@/hooks/use-scaled-canvas"
import { PlacedItem } from "./placed-item"

export function EditableCanvas() {
  const context = useContext(EditorContext)
  const { scale, viewportRef, contentRef, translateMouseCoordinates, nativeWidth, nativeHeight } = useScaledCanvas()
  const { handleDragOver, handleDrop } = useEditableCanvas({ translateMouseCoordinates })
  const [stars, setStars] = useState<Array<{ id: number; left: number; top: number; size: number; delay: number }>>([])

  useEffect(() => {
    // Generate random stars for the canvas background
    const generatedStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 3,
    }))
    setStars(generatedStars)
  }, [])

  if (!context) return null

  const { placedItems, clearSelection, backgroundImage } = context

  // Ordenar items por z-index para renderizar en el orden correcto
  // Manejar items sin zIndex asignándoles 0 por defecto
  const sortedItems = [...placedItems].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))

  // Calculate the scaled dimensions
  const scaledWidth = nativeWidth * scale
  const scaledHeight = nativeHeight * scale

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only clear selection if clicking directly on the canvas background
    // (not on a placed item)
    if (e.target === e.currentTarget) {
      clearSelection()
    }
  }

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
          data-canvas="true"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleCanvasClick}
          className="relative shadow-2xl overflow-hidden"
          style={{
            width: `${nativeWidth}px`,
            height: `${nativeHeight}px`,
            transformOrigin: 'top left',
            transform: `scale(${scale})`,
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: '#000000',
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Stars layer */}
          <div className="absolute inset-0 pointer-events-none">
            {stars.map((star) => (
              <div
                key={star.id}
                className="star"
                style={{
                  position: 'absolute',
                  left: `${star.left}%`,
                  top: `${star.top}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  background: 'white',
                  borderRadius: '50%',
                  animation: `twinkle 3s ease-in-out infinite`,
                  animationDelay: `${star.delay}s`,
                }}
              />
            ))}
          </div>

          {/* Placed items layer */}
          {sortedItems.map((item) => (
            <PlacedItem key={item.instanceId} item={item} />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  )
}
