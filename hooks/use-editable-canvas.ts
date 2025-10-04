"use client"

import type React from "react"

import { useContext } from "react"
import { EditorContext } from "@/contexts/editor-context"

export function useEditableCanvas() {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error("useEditableCanvas must be used within EditorProvider")
  }

  const { addItemToCanvas, updateItemPosition } = context

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Check if we're moving an existing item
    const instanceId = event.dataTransfer.getData("instanceId")
    if (instanceId) {
      // Repositioning an existing item
      updateItemPosition(instanceId, { x, y })
      return
    }

    // Adding a new item from the toolbar
    const itemId = event.dataTransfer.getData("itemId")
    if (!itemId) return

    addItemToCanvas(itemId, { x, y })
  }

  return {
    handleDragOver,
    handleDrop,
  }
}
