"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Info, AlertCircle, CheckCircle2 } from "lucide-react"
import { FUNCTIONAL_AREA_REQUIREMENTS, getMinimumArea, getRequiredAreas, getOptionalAreas } from "@/lib/habitat/functional-areas"
import type { FunctionalAreaType } from "@/types"
import { useState } from "react"

interface FunctionalAreasPaletteProps {
  crewSize: number
  durationDays: number
  placedAreas: Array<{ type: FunctionalAreaType; area: number }>
  onAreaDragStart: (areaType: FunctionalAreaType) => void
}

export function FunctionalAreasPalette({
  crewSize,
  durationDays,
  placedAreas,
  onAreaDragStart
}: FunctionalAreasPaletteProps) {
  const [selectedArea, setSelectedArea] = useState<FunctionalAreaType | null>(null)

  const requiredAreas = getRequiredAreas()
  const optionalAreas = getOptionalAreas()

  const isAreaPlaced = (areaType: FunctionalAreaType) => {
    return placedAreas.some(area => area.type === areaType)
  }

  const getAreaStatus = (areaType: FunctionalAreaType) => {
    const placed = placedAreas.find(area => area.type === areaType)
    if (!placed) return { status: 'not-placed', icon: AlertCircle, color: 'text-slate-400' }

    const minRequired = getMinimumArea(areaType, crewSize, durationDays)
    if (placed.area >= minRequired) {
      return { status: 'compliant', icon: CheckCircle2, color: 'text-green-400' }
    }
    return { status: 'undersized', icon: AlertCircle, color: 'text-yellow-400' }
  }

  const renderAreaCard = (areaType: FunctionalAreaType) => {
    const requirements = FUNCTIONAL_AREA_REQUIREMENTS[areaType]
    const minArea = getMinimumArea(areaType, crewSize, durationDays)
    const status = getAreaStatus(areaType)
    const StatusIcon = status.icon
    const isPlaced = isAreaPlaced(areaType)

    return (
      <Card
        key={areaType}
        draggable
        onDragStart={() => onAreaDragStart(areaType)}
        onClick={() => setSelectedArea(selectedArea === areaType ? null : areaType)}
        className={`p-4 cursor-move transition-all hover:scale-105 ${selectedArea === areaType
            ? 'border-blue-500 bg-blue-900/30 shadow-lg shadow-blue-500/20'
            : 'border-slate-700 hover:border-blue-400/50 bg-slate-800/50'
          }`}
        style={{ borderLeftColor: requirements.color, borderLeftWidth: '4px' }}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{requirements.icon}</span>
            <div>
              <h4 className="text-white font-semibold text-sm">{areaType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</h4>
              {requirements.required && (
                <Badge variant="outline" className="text-xs border-red-400 text-red-400">Required</Badge>
              )}
            </div>
          </div>
          <StatusIcon className={`w-5 h-5 ${status.color}`} />
        </div>

        <p className="text-xs text-slate-400 mb-3">{requirements.description}</p>

        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-blue-200/60">Min. Area:</span>
            <span className="text-white font-semibold">{minArea.toFixed(1)} m²</span>
          </div>
          {isPlaced && (
            <div className="flex justify-between">
              <span className="text-blue-200/60">Current:</span>
              <span className={`font-semibold ${status.color}`}>
                {placedAreas.find(a => a.type === areaType)?.area.toFixed(1)} m²
              </span>
            </div>
          )}
        </div>

        {selectedArea === areaType && (
          <div className="mt-3 pt-3 border-t border-slate-700 space-y-2 text-xs">
            {requirements.adjacentTo && requirements.adjacentTo.length > 0 && (
              <div>
                <span className="text-green-400">✓ Best near:</span>
                <p className="text-slate-300 ml-4">{requirements.adjacentTo.join(', ')}</p>
              </div>
            )}
            {requirements.separateFrom && requirements.separateFrom.length > 0 && (
              <div>
                <span className="text-red-400">✗ Keep away from:</span>
                <p className="text-slate-300 ml-4">{requirements.separateFrom.join(', ')}</p>
              </div>
            )}
          </div>
        )}
      </Card>
    )
  }

  const completionStats = {
    requiredPlaced: requiredAreas.filter(isAreaPlaced).length,
    totalRequired: requiredAreas.length,
    optionalPlaced: optionalAreas.filter(isAreaPlaced).length,
    totalOptional: optionalAreas.length
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-white font-bold text-lg mb-2">Functional Areas</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-800/50 p-2 rounded">
            <p className="text-slate-400">Required</p>
            <p className="text-white font-semibold">
              {completionStats.requiredPlaced}/{completionStats.totalRequired}
            </p>
          </div>
          <div className="bg-slate-800/50 p-2 rounded">
            <p className="text-slate-400">Optional</p>
            <p className="text-white font-semibold">
              {completionStats.optionalPlaced}/{completionStats.totalOptional}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="required" className="flex-1 flex flex-col">
        <TabsList className="w-full grid grid-cols-2 bg-slate-800">
          <TabsTrigger value="required" className="data-[state=active]:bg-red-600">
            Required ({completionStats.totalRequired})
          </TabsTrigger>
          <TabsTrigger value="optional" className="data-[state=active]:bg-blue-600">
            Optional ({completionStats.totalOptional})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="required" className="flex-1 overflow-auto p-4 space-y-3">
          {requiredAreas.map(renderAreaCard)}
        </TabsContent>

        <TabsContent value="optional" className="flex-1 overflow-auto p-4 space-y-3">
          {optionalAreas.map(renderAreaCard)}
        </TabsContent>
      </Tabs>

      {/* Info Footer */}
      <div className="p-4 border-t border-slate-700 bg-blue-900/20">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-200/80">
            Drag areas onto the canvas to design your habitat. Areas are sized based on crew ({crewSize}) and mission duration ({durationDays} days).
          </p>
        </div>
      </div>
    </div>
  )
}
