"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Info, Ruler } from "lucide-react"
import type { HabitatShape, LaunchVehicle, HabitatType } from "@/types"
import { LAUNCH_VEHICLES, calculateVolume, validateDimensions } from "@/lib/habitat/habitat-configs"

interface DimensionsStepProps {
  shape: HabitatShape
  vehicle: LaunchVehicle
  habitatType: HabitatType
  dimensions: { width: number; height: number }
  onDimensionsChange: (dimensions: { width: number; height: number }) => void
}

export function DimensionsStep({
  shape,
  vehicle,
  habitatType,
  dimensions,
  onDimensionsChange
}: DimensionsStepProps) {
  const vehicleData = LAUNCH_VEHICLES[vehicle]
  const volume = calculateVolume(shape, dimensions.width, dimensions.height)
  const validation = validateDimensions(vehicle, habitatType, shape, dimensions.width, dimensions.height)

  const isInflatableOrISRU = habitatType === "inflatable" || habitatType === "in-situ"

  return (
    <div className="space-y-6">
      {/* Width Control */}
      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Ruler className="w-6 h-6 text-blue-400" />
          <div>
            <Label className="text-white text-lg font-semibold">Habitat Width (Diameter)</Label>
            <p className="text-sm text-blue-200/60">
              {isInflatableOrISRU ? "Deployed diameter" : `Maximum ${vehicleData.maxDiameter}m`}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Slider
              value={[dimensions.width]}
              onValueChange={(value) => onDimensionsChange({ ...dimensions, width: value[0] })}
              min={2}
              max={20}
              step={0.5}
              className="flex-1"
            />
            <div className="w-32">
              <Input
                type="number"
                value={dimensions.width}
                onChange={(e) => onDimensionsChange({ ...dimensions, width: Number(e.target.value) })}
                step={0.5}
                min={2}
                max={20}
                className="bg-slate-700 border-slate-600 text-white text-center"
              />
            </div>
            <span className="text-white font-semibold w-12">m</span>
          </div>

          {!isInflatableOrISRU && dimensions.width > vehicleData.maxDiameter && (
            <div className="flex items-start gap-2 bg-red-900/20 border border-red-500/30 rounded-lg p-3">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-200">
                Width exceeds {vehicleData.name} fairing diameter ({vehicleData.maxDiameter}m).
                Consider selecting an inflatable or in-situ habitat type.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Height Control */}
      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Ruler className="w-6 h-6 text-blue-400 rotate-90" />
          <div>
            <Label className="text-white text-lg font-semibold">Habitat Height (Length)</Label>
            <p className="text-sm text-blue-200/60">
              {isInflatableOrISRU ? "Deployed height/length" : `Maximum ${vehicleData.maxHeight}m`}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Slider
              value={[dimensions.height]}
              onValueChange={(value) => onDimensionsChange({ ...dimensions, height: value[0] })}
              min={3}
              max={30}
              step={0.5}
              className="flex-1"
            />
            <div className="w-32">
              <Input
                type="number"
                value={dimensions.height}
                onChange={(e) => onDimensionsChange({ ...dimensions, height: Number(e.target.value) })}
                step={0.5}
                min={3}
                max={30}
                className="bg-slate-700 border-slate-600 text-white text-center"
              />
            </div>
            <span className="text-white font-semibold w-12">m</span>
          </div>

          {!isInflatableOrISRU && dimensions.height > vehicleData.maxHeight && (
            <div className="flex items-start gap-2 bg-red-900/20 border border-red-500/30 rounded-lg p-3">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-200">
                Height exceeds {vehicleData.name} fairing height ({vehicleData.maxHeight}m).
                Consider selecting an inflatable or in-situ habitat type.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Calculated Volume */}
      <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30 p-6">
        <div className="flex items-start gap-3">
          <Info className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="text-white font-semibold mb-4">Calculated Specifications</h4>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                <p className="text-2xl font-bold text-white">{dimensions.width.toFixed(1)}</p>
                <p className="text-xs text-blue-200/60">Width (m)</p>
              </div>
              <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                <p className="text-2xl font-bold text-white">{dimensions.height.toFixed(1)}</p>
                <p className="text-xs text-blue-200/60">Height (m)</p>
              </div>
              <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                <p className="text-2xl font-bold text-white">{volume.toFixed(1)}</p>
                <p className="text-xs text-blue-200/60">Volume (m³)</p>
              </div>
            </div>

            {/* Validation Status */}
            {validation.valid ? (
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">✓ Dimensions are compatible with {vehicleData.name}</span>
              </div>
            ) : (
              <div className="space-y-2">
                {validation.warnings.map((warning, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-yellow-400">
                    <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{warning}</span>
                  </div>
                ))}
              </div>
            )}

            {isInflatableOrISRU && (
              <div className="mt-4 pt-4 border-t border-blue-500/30">
                <p className="text-sm text-blue-200/80">
                  <strong>Note:</strong> {habitatType === "inflatable" ? "Inflatable" : "In-situ"} habitats
                  are not constrained by launch vehicle fairing dimensions. They can be much larger once deployed.
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Quick Presets */}
      <Card className="bg-slate-800/50 border-slate-700 p-5">
        <h4 className="text-white font-semibold mb-3">Quick Presets</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => onDimensionsChange({ width: 4.5, height: 10.0 })}
            className="px-4 py-3 rounded-lg bg-slate-700 hover:bg-blue-600 text-white text-sm transition-colors"
          >
            <p className="font-semibold">Small</p>
            <p className="text-xs text-blue-200/60">4.5m × 10m</p>
          </button>
          <button
            onClick={() => onDimensionsChange({ width: 6.0, height: 12.0 })}
            className="px-4 py-3 rounded-lg bg-slate-700 hover:bg-blue-600 text-white text-sm transition-colors"
          >
            <p className="font-semibold">Medium</p>
            <p className="text-xs text-blue-200/60">6m × 12m</p>
          </button>
          <button
            onClick={() => onDimensionsChange({ width: 8.0, height: 15.0 })}
            className="px-4 py-3 rounded-lg bg-slate-700 hover:bg-blue-600 text-white text-sm transition-colors"
          >
            <p className="font-semibold">Large</p>
            <p className="text-xs text-blue-200/60">8m × 15m</p>
          </button>
          <button
            onClick={() => onDimensionsChange({ width: 10.0, height: 20.0 })}
            className="px-4 py-3 rounded-lg bg-slate-700 hover:bg-blue-600 text-white text-sm transition-colors"
          >
            <p className="font-semibold">Extra Large</p>
            <p className="text-xs text-blue-200/60">10m × 20m</p>
          </button>
        </div>
      </Card>
    </div>
  )
}