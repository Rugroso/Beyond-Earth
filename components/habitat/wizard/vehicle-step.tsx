"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { LaunchVehicle } from "@/types"
import { LAUNCH_VEHICLES } from "@/lib/habitat/habitat-configs"
import { Rocket, Ruler, Weight } from "lucide-react"

interface VehicleStepProps {
  selected: LaunchVehicle
  onSelect: (vehicle: LaunchVehicle) => void
}

export function VehicleStep({ selected, onSelect }: VehicleStepProps) {
  const vehicles: LaunchVehicle[] = ["falcon-heavy", "sls", "starship", "custom"]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vehicles.map((vehicleId) => {
          const vehicle = LAUNCH_VEHICLES[vehicleId]
          return (
            <Card
              key={vehicleId}
              onClick={() => onSelect(vehicleId)}
              className={`p-6 cursor-pointer transition-all hover:scale-105 ${selected === vehicleId
                  ? "border-blue-500 bg-blue-900/30 shadow-lg shadow-blue-500/20"
                  : "border-slate-700 hover:border-blue-400/50 bg-slate-800/50"
                }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Rocket className="w-8 h-8 text-blue-400" />
                  <div>
                    <h3 className="text-lg font-bold text-white">{vehicle.name}</h3>
                    <p className="text-xs text-blue-200/60">{vehicle.description}</p>
                  </div>
                </div>
                {selected === vehicleId && (
                  <Badge className="bg-blue-500">Selected</Badge>
                )}
              </div>

              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-200/80">Max Diameter:</span>
                  </div>
                  <span className="font-bold text-white">{vehicle.maxDiameter}m</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-blue-400 rotate-90" />
                    <span className="text-blue-200/80">Max Height:</span>
                  </div>
                  <span className="font-bold text-white">{vehicle.maxHeight}m</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Weight className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-200/80">Payload to LEO:</span>
                  </div>
                  <span className="font-bold text-white">{(vehicle.maxPayloadMass / 1000).toFixed(0)}t</span>
                </div>
              </div>

              {/* Visual comparison bar */}
              <div className="mt-4 pt-4 border-t border-slate-700">
                <p className="text-xs text-blue-200/60 mb-2">Fairing Size Comparison</p>
                <div className="flex items-end gap-2 h-16">
                  <div
                    className="bg-blue-500/30 rounded-t flex-shrink-0 transition-all hover:bg-blue-500/50"
                    style={{
                      width: `${(vehicle.maxDiameter / 10) * 100}%`,
                      height: `${(vehicle.maxHeight / 30) * 100}%`
                    }}
                    title={`${vehicle.maxDiameter}m × ${vehicle.maxHeight}m`}
                  />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Info Card */}
      <Card className="bg-blue-900/20 border-blue-500/30 p-4">
        <div className="text-sm text-blue-200/80">
          <strong>Important:</strong> The launch vehicle determines the maximum dimensions of your habitat
          (for metallic types). Inflatable habitats can expand beyond fairing limits once deployed, while
          in-situ habitats are built on location and aren't constrained by launch vehicle size.
        </div>
      </Card>
    </div>
  )
}