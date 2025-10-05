"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Destination, LaunchVehicle, HabitatType, HabitatShape } from "@/types"
import { DESTINATIONS, LAUNCH_VEHICLES, HABITAT_TYPES, HABITAT_SHAPE_TEMPLATES, calculateVolume, getRecommendedCrewSize } from "@/lib/habitat/habitat-configs"
import { CheckCircle, Users, Calendar, Rocket, Package, Ruler, Box } from "lucide-react"

interface SummaryStepProps {
  destination: Destination
  crewSize: number
  duration: number
  launchVehicle: LaunchVehicle
  habitatType: HabitatType
  habitatShape: HabitatShape
  dimensions: { width: number; height: number }
}

export function SummaryStep({
  destination,
  crewSize,
  duration,
  launchVehicle,
  habitatType,
  habitatShape,
  dimensions
}: SummaryStepProps) {
  const destinationData = DESTINATIONS[destination]
  const vehicleData = LAUNCH_VEHICLES[launchVehicle]
  const typeData = HABITAT_TYPES[habitatType]
  const shapeData = HABITAT_SHAPE_TEMPLATES[habitatShape]
  const volume = calculateVolume(habitatShape, dimensions.width, dimensions.height)
  const recommended = getRecommendedCrewSize(volume, duration)

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <Card className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-500/30 p-6">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-8 h-8 text-green-400" />
          <div>
            <h3 className="text-xl font-bold text-white">Configuration Complete!</h3>
            <p className="text-green-200/80">Review your mission parameters below and start designing your habitat.</p>
          </div>
        </div>
      </Card>

      {/* Mission Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Destination Card */}
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{destinationData.icon}</span>
            <div>
              <p className="text-xs text-blue-200/60">Destination</p>
              <h3 className="text-xl font-bold text-white">{destinationData.name}</h3>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-200/60">Gravity:</span>
              <span className="text-white font-semibold">{destinationData.gravity}g</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-200/60">Radiation:</span>
              <span className="text-white font-semibold">{destinationData.radiation}</span>
            </div>
          </div>
        </Card>

        {/* Mission Parameters Card */}
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-xs text-blue-200/60">Crew Size</p>
                <p className="text-2xl font-bold text-white">{crewSize} Astronauts</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-xs text-blue-200/60">Mission Duration</p>
                <p className="text-2xl font-bold text-white">{duration} Days</p>
                <p className="text-xs text-blue-200/60">
                  ({Math.floor(duration / 30)} months, {(duration / 365).toFixed(1)} years)
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Habitat Configuration */}
      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Habitat Configuration</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Launch Vehicle */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Rocket className="w-5 h-5 text-blue-400" />
              <p className="text-xs text-blue-200/60">Launch Vehicle</p>
            </div>
            <p className="text-white font-bold">{vehicleData.name}</p>
            <p className="text-sm text-blue-200/70">
              {vehicleData.maxDiameter}m × {vehicleData.maxHeight}m fairing
            </p>
          </div>

          {/* Habitat Type */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-blue-400" />
              <p className="text-xs text-blue-200/60">Construction Type</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{typeData.icon}</span>
              <p className="text-white font-bold">{typeData.name}</p>
            </div>
          </div>

          {/* Habitat Shape */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Box className="w-5 h-5 text-blue-400" />
              <p className="text-xs text-blue-200/60">Habitat Shape</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{shapeData.icon}</span>
              <p className="text-white font-bold">{shapeData.name}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Dimensions & Volume */}
      <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Ruler className="w-6 h-6 text-blue-400" />
          <h3 className="text-lg font-bold text-white">Physical Specifications</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-4xl font-bold text-white">{dimensions.width.toFixed(1)}</p>
            <p className="text-sm text-blue-200/60">Width (m)</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-white">{dimensions.height.toFixed(1)}</p>
            <p className="text-sm text-blue-200/60">Height (m)</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-white">{volume.toFixed(1)}</p>
            <p className="text-sm text-blue-200/60">Total Volume (m³)</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-white">{(volume / crewSize).toFixed(1)}</p>
            <p className="text-sm text-blue-200/60">Volume/Crew (m³)</p>
          </div>
        </div>

        {/* Crew Size Recommendation */}
        <div className="mt-6 pt-4 border-t border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-200/80">
                Recommended crew size for this volume: <strong className="text-white">{recommended.min}-{recommended.max} crew</strong>
              </p>
            </div>
            {crewSize >= recommended.min && crewSize <= recommended.max ? (
              <Badge className="bg-green-500">✓ Optimal</Badge>
            ) : crewSize < recommended.min ? (
              <Badge className="bg-yellow-500">⚠ Spacious</Badge>
            ) : (
              <Badge className="bg-orange-500">⚠ Cramped</Badge>
            )}
          </div>
        </div>
      </Card>

      {/* Next Steps */}
      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-3">What's Next?</h3>
        <div className="space-y-2 text-sm text-blue-200/80">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <p>Design the interior layout with 13 functional areas (sleep, hygiene, food prep, etc.)</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <p>Place equipment and objects (spacesuits, furniture, storage)</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <p>Validate your design against NASA standards</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <p>Save and share your habitat design with the community</p>
          </div>
        </div>
      </Card>
    </div>
  )
}