"use client"

import type React from "react"

import { createContext } from "react"
import type { EditorContextType } from "@/types"
import { useEditorState } from "@/hooks/use-editor-state"

export const EditorContext = createContext<EditorContextType | null>(null)

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const editorState = useEditorState()

  return <EditorContext.Provider value={editorState}>{children}</EditorContext.Provider>
}
