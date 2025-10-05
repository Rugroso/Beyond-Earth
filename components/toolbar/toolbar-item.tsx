"use client"

import type React from "react"

import { useContext } from "react"
import type { ToolbarItemType } from "@/types"
import { EditorContext } from "@/contexts/editor-context"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ToolbarItemProps {
  item: ToolbarItemType
}

export function ToolbarItem({ item }: ToolbarItemProps) {
  const context = useContext(EditorContext)
  if (!context) return null

  const { getItemCountOnCanvas } = context
  const count = getItemCountOnCanvas(item.id)
  const isDisabled = count >= item.limit
  const needsMore = item.minRequired > 0 && count < item.minRequired
  const isMet = item.minRequired > 0 && count >= item.minRequired

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    if (isDisabled) {
      event.preventDefault()
      return
    }
    event.dataTransfer.setData("itemId", item.id)
  }

  const tooltipContent = () => {
    if (item.minRequired === 0) return `${item.name} (${count}/${item.limit})`

    if (needsMore) {
      return `${item.name}: Need ${item.minRequired - count} more (${count}/${item.minRequired})`
    }

    return `${item.name}: Complete ✓ (${count}/${item.minRequired})`
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
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

            {/* Requirement indicator badge */}
            {item.minRequired > 0 && (
              <div className={cn(
                "absolute -top-1 -right-1 flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full text-xs font-bold shadow-lg",
                isMet ? "bg-green-500 text-white" : "bg-red-500 text-white"
              )}>
                {count}/{item.minRequired}
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
