"use client"

import { useContext } from "react"
import { EditorContext } from "@/contexts/editor-context"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Package, Trash2, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DiagnosticsPanel() {
  const context = useContext(EditorContext)

  if (!context) return null

  const { availableItems, placedItems, selectedItemIds, deleteSelectedItems, clearSelection } = context

  const totalPlaced = placedItems.length
  const totalSelected = selectedItemIds.size

  return (
    <Card className="h-full flex flex-col bg-slate-900/95 border-slate-700">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-400" />
            Inventory
          </h3>
          <Badge variant="secondary" className="bg-blue-600">
            {totalPlaced} items
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-800 p-2 rounded">
            <span className="text-slate-400">Placed:</span>
            <span className="ml-2 text-white font-semibold">{totalPlaced}</span>
          </div>
          <div className="bg-slate-800 p-2 rounded">
            <span className="text-slate-400">Selected:</span>
            <span className="ml-2 text-white font-semibold">{totalSelected}</span>
          </div>
        </div>

        {/* Selection Actions */}
        {totalSelected > 0 && (
          <div className="mt-3 flex gap-2">
            <Button
              onClick={deleteSelectedItems}
              variant="destructive"
              size="sm"
              className="flex-1"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Delete ({totalSelected})
            </Button>
            <Button
              onClick={clearSelection}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Clear Selection
            </Button>
          </div>
        )}
      </div>

      {/* Items List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <h4 className="text-sm font-semibold text-white">Items Status</h4>
          </div>

          {availableItems.map((item) => {
            const count = placedItems.filter((p) => p.itemId === item.id).length
            const percentage = (count / item.limit) * 100
            const isAtLimit = count >= item.limit

            return (
              <Card
                key={item.id}
                className={`p-3 transition-all ${
                  isAtLimit
                    ? "bg-red-900/20 border-red-700"
                    : count > 0
                    ? "bg-slate-800/50 border-slate-600"
                    : "bg-slate-800/30 border-slate-700"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {item.imagePath ? (
                      <img
                        src={item.imagePath}
                        alt={item.name}
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      <div className="w-8 h-8 flex items-center justify-center text-xl">
                        📦
                      </div>
                    )}
                    <div>
                      <h5 className="text-white font-semibold text-sm">{item.name}</h5>
                      <p className="text-xs text-slate-400">
                        {count} / {item.limit} placed
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={isAtLimit ? "destructive" : count > 0 ? "default" : "outline"}
                    className="text-xs"
                  >
                    {count}/{item.limit}
                  </Badge>
                </div>

                <Progress
                  value={percentage}
                  className={`h-2 ${
                    isAtLimit
                      ? "[&>div]:bg-red-500"
                      : count > item.limit * 0.7
                      ? "[&>div]:bg-yellow-500"
                      : "[&>div]:bg-green-500"
                  }`}
                />

                {isAtLimit && (
                  <p className="text-xs text-red-400 mt-1">⚠ Limit reached</p>
                )}
              </Card>
            )
          })}
        </div>
      </ScrollArea>

      {/* Footer with tips */}
      <div className="flex-shrink-0 p-3 border-t border-slate-700 bg-slate-800/50">
        <div className="space-y-1 text-xs text-slate-400">
          <p>💡 <strong>Tip:</strong> Click to select, Shift+Click for multi-select</p>
          <p>⌨️ <strong>Shortcuts:</strong> Del = Delete, Ctrl+A = Select All, Esc = Clear</p>
        </div>
      </div>
    </Card>
  )
}
