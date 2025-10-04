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

  const shapeClasses = {
    square: "rounded-lg",
    circle: "rounded-full",
    triangle: "rounded-lg",
  }

  return (
    <div
      draggable={!isDisabled}
      onDragStart={handleDragStart}
      className={cn(
        "relative flex h-20 w-20 items-center justify-center bg-muted transition-all",
        shapeClasses[item.shape],
        isDisabled ? "cursor-not-allowed opacity-40" : "cursor-grab hover:bg-muted/80 active:cursor-grabbing",
      )}
    >
      {item.shape === "triangle" && (
        <div className="h-0 w-0 border-b-[40px] border-l-[23px] border-r-[23px] border-b-foreground/60 border-l-transparent border-r-transparent" />
      )}
      {item.shape === "square" && <div className="h-10 w-10 bg-foreground/60 rounded" />}
      {item.shape === "circle" && <div className="h-10 w-10 bg-foreground/60 rounded-full" />}
    </div>
  )
}
