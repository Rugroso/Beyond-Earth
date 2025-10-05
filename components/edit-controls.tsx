"use client"

import { useContext } from "react"
import { EditorContext } from "@/contexts/editor-context"
import { Button } from "@/components/ui/button"
import { 
  ArrowUp, 
  ArrowDown, 
  MoveUp, 
  MoveDown,
  Layers
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function EditControls() {
  const context = useContext(EditorContext)

  if (!context) return null

  const { 
    selectedItemIds, 
    bringToFront, 
    sendToBack, 
    bringForward, 
    sendBackward,
    isEditMode 
  } = context

  const selectedIds = Array.from(selectedItemIds)
  const hasSelection = selectedIds.length > 0

  if (!isEditMode || !hasSelection) return null

  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-slate-800 rounded-lg border border-slate-700">
      <div className="flex items-center gap-1 mr-2">
        <Layers className="w-4 h-4 text-slate-400" />
        <span className="text-xs text-slate-400 font-medium">
          {selectedIds.length} selected
        </span>
      </div>

      <div className="h-4 w-px bg-slate-600" />

      <TooltipProvider delayDuration={300}>
        {/* Bring to Front */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => bringToFront(selectedIds)}
              className="h-8 px-2 hover:bg-slate-700"
            >
              <MoveUp className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bring to Front</p>
          </TooltipContent>
        </Tooltip>

        {/* Bring Forward */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => bringForward(selectedIds)}
              className="h-8 px-2 hover:bg-slate-700"
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bring Forward</p>
          </TooltipContent>
        </Tooltip>

        {/* Send Backward */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => sendBackward(selectedIds)}
              className="h-8 px-2 hover:bg-slate-700"
            >
              <ArrowDown className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Send Backward</p>
          </TooltipContent>
        </Tooltip>

        {/* Send to Back */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => sendToBack(selectedIds)}
              className="h-8 px-2 hover:bg-slate-700"
            >
              <MoveDown className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Send to Back</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
