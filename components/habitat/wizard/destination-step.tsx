"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Destination } from "@/types"
import { DESTINATIONS } from "@/lib/habitat/habitat-configs"
import { Info } from "lucide-react"

interface DestinationStepProps {
  selected: Destination
  onSelect: (destination: Destination) => void
}

export function DestinationStep({ selected, onSelect }: DestinationStepProps) {
  const destinations: Array<{ id: Destination; data: typeof DESTINATIONS[Destination] }> = [
    { id: "lunar-surface", data: DESTINATIONS["lunar-surface"] },
    { id: "mars-surface", data: DESTINATIONS["mars-surface"] },
    { id: "deep-space", data: DESTINATIONS["deep-space"] },
    { id: "transit", data: DESTINATIONS["transit"] }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {destinations.map(({ id, data }) => (
          <Card
            key={id}
            onClick={() => onSelect(id)}
            className={`p-6 cursor-pointer transition-all hover:scale-105 ${selected === id
                ? "border-blue-500 bg-blue-900/30 shadow-lg shadow-blue-500/20"
                : "border-slate-700 hover:border-blue-400/50 bg-slate-800/50"
              }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{data.icon}</span>
                <h3 className="text-xl font-bold text-white">{data.name}</h3>
              </div>
              {selected === id && (
                <Badge className="bg-blue-500">Selected</Badge>
              )}
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-blue-400 font-semibold min-w-[100px]">Gravity:</span>
                <span className="text-white">{data.gravity}g</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400 font-semibold min-w-[100px]">Radiation:</span>
                <span className="text-white">{data.radiation}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400 font-semibold min-w-[100px]">Temperature:</span>
                <span className="text-white">{data.temperature}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  {data.considerations.map((consideration, index) => (
                    <p key={index} className="text-xs text-blue-200/70">• {consideration}</p>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Educational Info Box */}
      <Card className="bg-blue-900/20 border-blue-500/30 p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-white font-semibold mb-2">NASA Artemis Program</h4>
            <p className="text-sm text-blue-200/80">
              NASA's Artemis program aims to return humans to the Moon and establish a sustainable presence there.
              The Moon will serve as a proving ground for technologies and operational approaches that will inform
              future human missions to Mars. Your habitat design will need to account for the unique challenges of
              each destination.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}