"use client"

import type React from "react"

import { useContext } from "react"
import type { ToolbarItemType } from "@/types"
import { EditorContext } from "@/contexts/editor-context"
import { cn } from "@/lib/utils"

interface ToolbarItemProps {
  item: ToolbarItemType
}

export function ToolbarItem({ item }: ToolbarItemProps) {
  const context = useContext(EditorContext)
  if (!context) return null

  const { getItemCountOnCanvas } = context
  const count = getItemCountOnCanvas(item.id)
  const isDisabled = count >= item.limit

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    if (isDisabled) {
      event.preventDefault()
      return
    }
    event.dataTransfer.setData("itemId", item.id)
  }

  return (
    <div
      draggable={!isDisabled}
      onDragStart={handleDragStart}
      className={cn(
        "relative flex h-20 w-20 items-center justify-center bg-muted transition-all rounded-lg",
        isDisabled ? "cursor-not-allowed opacity-40" : "cursor-grab hover:bg-muted/80 active:cursor-grabbing",
      )}
    >
      {item.shape === "image" && item.imagePath && (
        <img 
          src={item.imagePath} 
          alt={item.name} 
          className="h-16 w-16 object-contain"
          draggable={false}
        />
      )}
    </div>
  )
}
