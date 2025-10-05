"use client"

import { useContext } from "react"
import { EditorContext } from "@/contexts/editor-context"
import { ToolbarItem } from "./toolbar-item"
import { Badge } from "@/components/ui/badge"
import { Info } from "lucide-react"

export function Toolbar() {
  const context = useContext(EditorContext)
  if (!context) return null

  const { availableItems } = context

  return (
    <div className="border-t border-white/10 bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-semibold">Áreas Funcionales</h3>
            <Badge variant="outline" className="border-blue-400 text-blue-300">
              {availableItems.length} disponibles
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-blue-200/60">
            <Info className="w-4 h-4" />
            <span>Arrastra las áreas al canvas para diseñar tu hábitat</span>
          </div>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {availableItems.map((item) => (
            <ToolbarItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}
