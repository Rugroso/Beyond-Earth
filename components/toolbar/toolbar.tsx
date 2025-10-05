"use client"

import { useContext, useState } from "react"
import { EditorContext } from "@/contexts/editor-context"
import { ToolbarItem } from "./toolbar-item"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ItemCategory } from "@/types"

const CATEGORY_LABELS: Record<ItemCategory, string> = {
  basics: "Basics",
  entertainment: "Entertainment",
  miscellaneous: "Miscellaneous"
}

export function Toolbar() {
  const context = useContext(EditorContext)
  const [activeCategory, setActiveCategory] = useState<ItemCategory>("basics")

  if (!context) return null

  const { availableItems } = context

  // Agrupar items por categoría
  const itemsByCategory = availableItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<ItemCategory, typeof availableItems>)

  // Obtener las categorías disponibles
  const availableCategories = Object.keys(itemsByCategory) as ItemCategory[]

  return (
    <div className="h-full bg-slate-900 border-t-2 border-blue-500/50 flex flex-col">
      {/* Header compacto */}
      <div className="flex-shrink-0 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center justify-between px-3 py-1.5">
          <p className="text-xs text-slate-400 font-medium">Drag the elements on your base</p>
        </div>
      </div>

      {/* Tabs de categorías */}
      <Tabs
        value={activeCategory}
        onValueChange={(value) => setActiveCategory(value as ItemCategory)}
        className="flex-1 flex flex-col"
      >
        <TabsList className="w-full grid grid-cols-3 bg-slate-800/50 rounded-none border-b border-slate-700 h-auto p-1">
          {availableCategories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 text-xs py-2"
            >
              {CATEGORY_LABELS[category]}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Contenido de cada categoría */}
        {availableCategories.map((category) => (
          <TabsContent
            key={category}
            value={category}
            className="flex-1 m-0 p-4 overflow-y-auto"
          >
            <div className="flex flex-wrap items-center justify-center gap-4">
              {itemsByCategory[category].map((item) => (
                <ToolbarItem key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
