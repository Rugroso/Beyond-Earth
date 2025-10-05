"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { HabitatType, HabitatShape } from "@/types"
import { HABITAT_TYPES, HABITAT_SHAPE_TEMPLATES } from "@/lib/habitat/habitat-configs"
import { Check, X } from "lucide-react"

interface HabitatStepProps {
  type: HabitatType
  shape: HabitatShape
  onTypeChange: (type: HabitatType) => void
  onShapeChange: (shape: HabitatShape) => void
}

export function HabitatStep({ type, shape, onTypeChange, onShapeChange }: HabitatStepProps) {
  const types: HabitatType[] = ["metallic", "inflatable", "in-situ"]
  const shapes: HabitatShape[] = ["cylindrical", "spherical", "toroidal", "modular"]

  return (
    <div className="space-y-6">
      {/* Habitat Type Selection */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Construction Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {types.map((typeId) => {
            const typeData = HABITAT_TYPES[typeId]
            return (
              <Card
                key={typeId}
                onClick={() => onTypeChange(typeId)}
                className={`p-5 cursor-pointer transition-all hover:scale-105 ${type === typeId
                    ? "border-blue-500 bg-blue-900/30 shadow-lg shadow-blue-500/20"
                    : "border-slate-700 hover:border-blue-400/50 bg-slate-800/50"
                  }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{typeData.icon}</span>
                  {type === typeId && (
                    <Badge className="bg-blue-500">Selected</Badge>
                  )}
                </div>

                <h4 className="text-white font-bold mb-2">{typeData.name}</h4>
                <p className="text-xs text-blue-200/70 mb-3">{typeData.description}</p>

                <div className="space-y-2 text-xs">
                  <p className="text-blue-300 font-semibold">⏱ {typeData.constructionTime}</p>

                  <div className="space-y-1">
                    {typeData.advantages.slice(0, 2).map((adv, idx) => (
                      <div key={idx} className="flex items-start gap-1">
                        <Check className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-green-200/80">{adv}</span>
                      </div>
                    ))}
                    {typeData.disadvantages.slice(0, 1).map((dis, idx) => (
                      <div key={idx} className="flex items-start gap-1">
                        <X className="w-3 h-3 text-red-400 mt-0.5 flex-shrink-0" />
                        <span className="text-red-200/80">{dis}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Habitat Shape Selection */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Habitat Shape</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {shapes.map((shapeId) => {
            const shapeData = HABITAT_SHAPE_TEMPLATES[shapeId]
            return (
              <Card
                key={shapeId}
                onClick={() => onShapeChange(shapeId)}
                className={`p-4 cursor-pointer transition-all hover:scale-105 ${shape === shapeId
                    ? "border-blue-500 bg-blue-900/30 shadow-lg shadow-blue-500/20"
                    : "border-slate-700 hover:border-blue-400/50 bg-slate-800/50"
                  }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{shapeData.icon}</div>
                  <h4 className="text-white font-semibold text-sm mb-1">
                    {shapeData.name.replace(" Habitat", "")}
                  </h4>
                  {shape === shapeId && (
                    <Badge className="bg-blue-500 text-xs">Selected</Badge>
                  )}
                </div>
              </Card>
            )
          })}
        </div>

        {/* Shape Details */}
        <Card className="bg-slate-800/50 border-slate-700 p-5 mt-4">
          <div className="flex items-start gap-3">
            <span className="text-3xl">{HABITAT_SHAPE_TEMPLATES[shape].icon}</span>
            <div className="flex-1">
              <h4 className="text-white font-bold mb-2">{HABITAT_SHAPE_TEMPLATES[shape].name}</h4>
              <p className="text-sm text-blue-200/80 mb-4">{HABITAT_SHAPE_TEMPLATES[shape].description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-blue-300 font-semibold mb-2">Advantages</p>
                  <div className="space-y-1">
                    {HABITAT_SHAPE_TEMPLATES[shape].advantages.map((adv, idx) => (
                      <div key={idx} className="flex items-start gap-1">
                        <Check className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-green-200/80">{adv}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-blue-300 font-semibold mb-2">Disadvantages</p>
                  <div className="space-y-1">
                    {HABITAT_SHAPE_TEMPLATES[shape].disadvantages.map((dis, idx) => (
                      <div key={idx} className="flex items-start gap-1">
                        <X className="w-3 h-3 text-red-400 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-red-200/80">{dis}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}