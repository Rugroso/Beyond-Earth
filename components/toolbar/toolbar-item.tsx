"use client"

import { useContext } from "react"
import type { ToolbarItemType } from "@/types"
import { EditorContext } from "@/contexts/editor-context"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

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
        "relative flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all",
        "hover:scale-105",
        isDisabled 
          ? "cursor-not-allowed opacity-40 border-slate-600" 
          : "cursor-grab active:cursor-grabbing border-slate-600 hover:border-blue-400 bg-slate-800/50 hover:bg-slate-700/50"
      )}
      style={{
        borderLeftColor: isDisabled ? undefined : item.color,
        borderLeftWidth: isDisabled ? undefined : "4px"
      }}
    >
      {/* Icon */}
      {item.icon && (
        <div className="text-3xl mb-1">{item.icon}</div>
      )}
      
      {/* Name */}
      <span className="text-white text-xs font-medium text-center leading-tight">
        {item.name}
      </span>

      {/* Counter Badge */}
      <Badge 
        variant={count >= item.limit ? "destructive" : "secondary"}
        className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
      >
        {count}
      </Badge>
    </div>
  )
}
