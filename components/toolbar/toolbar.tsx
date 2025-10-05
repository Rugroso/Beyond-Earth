"use client"

import { useContext } from "react"
import { EditorContext } from "@/contexts/editor-context"
import { ToolbarItem } from "./toolbar-item"

export function Toolbar() {
  const context = useContext(EditorContext)
  if (!context) return null

  const { availableItems } = context

  return (
    <div className="border-t border-border bg-muted/30 p-6">
      <p className="text-center text-sm text-muted-foreground mb-4">Drag the elements on your base</p>
      <div className="flex items-center justify-center gap-4">
        {availableItems.map((item) => (
          <ToolbarItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
