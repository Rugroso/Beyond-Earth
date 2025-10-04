"use client"

import type React from "react"

import { useContext } from "react"
import { EditorContext } from "@/contexts/editor-context"

export function useEditableCanvas() {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error("useEditableCanvas must be used within EditorProvider")
  }

  const { addItemToCanvas } = context

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const itemId = event.dataTransfer.getData("itemId")
    if (!itemId) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    addItemToCanvas(itemId, { x, y })
  }

  return {
    handleDragOver,
    handleDrop,
  }
}
