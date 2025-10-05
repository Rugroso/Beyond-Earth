"use client"

import { useState } from "react"
import { MissionWizard } from "@/components/habitat/wizard/mission-wizard"
import type { MissionConfig, HabitatConfig } from "@/types"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Rocket, Users, Calendar, Box, Ruler, ArrowLeft } from "lucide-react"

export default function HabitatDesignerPage() {
  const [showWizard, setShowWizard] = useState(true)
  const [missionConfig, setMissionConfig] = useState<MissionConfig | null>(null)
  const [habitatConfig, setHabitatConfig] = useState<HabitatConfig | null>(null)

  const handleWizardComplete = (mission: MissionConfig, habitat: HabitatConfig) => {
    setMissionConfig(mission)
    setHabitatConfig(habitat)
    setShowWizard(false)

    // Save to localStorage for persistence
    localStorage.setItem('currentMission', JSON.stringify(mission))
    localStorage.setItem('currentHabitat', JSON.stringify(habitat))
  }

  const handleSkipWizard = () => {
    // Use default configuration
    const defaultMission: MissionConfig = {
      crewSize: 4,
      durationDays: 180,
      destination: "lunar-surface",
      launchVehicle: "sls"
    }

    const defaultHabitat: HabitatConfig = {
      shape: "cylindrical",
      type: "metallic",
      dimensions: {
        width: 4.5,
        height: 10.0
      },
      volume: 159,
      levels: 1
    }

    setMissionConfig(defaultMission)
    setHabitatConfig(defaultHabitat)
    setShowWizard(false)

    localStorage.setItem('currentMission', JSON.stringify(defaultMission))
    localStorage.setItem('currentHabitat', JSON.stringify(defaultHabitat))
  }

  if (showWizard) {
    return <MissionWizard onComplete={handleWizardComplete} onSkip={handleSkipWizard} />
  }

  // Main designer interface (placeholder for now)
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Configuration Summary */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setShowWizard(true)}
            className="text-blue-300 hover:bg-blue-500/10 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Reconfigure Mission
          </Button>

          <Card className="bg-slate-900/50 border-blue-500/30 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Rocket className="w-10 h-10 text-blue-400" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Habitat Designer</h1>
                  <p className="text-blue-200/60">Design your space habitat interior</p>
                </div>
              </div>

              {missionConfig && habitatConfig && (
                <div className="flex gap-4">
                  <div className="text-center">
                    <Users className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                    <p className="text-xl font-bold text-white">{missionConfig.crewSize}</p>
                    <p className="text-xs text-blue-200/60">Crew</p>
                  </div>
                  <div className="text-center">
                    <Calendar className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                    <p className="text-xl font-bold text-white">{missionConfig.durationDays}</p>
                    <p className="text-xs text-blue-200/60">Days</p>
                  </div>
                  <div className="text-center">
                    <Box className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                    <p className="text-xl font-bold text-white">{habitatConfig.volume.toFixed(0)}</p>
                    <p className="text-xs text-blue-200/60">m³</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Coming Soon Placeholder */}
        <Card className="bg-slate-900/50 border-blue-500/30 p-12">
          <div className="text-center max-w-3xl mx-auto">
            <div className="text-6xl mb-6">🚧</div>
            <h2 className="text-3xl font-bold text-white mb-4">Main Designer Interface Coming Soon!</h2>
            <p className="text-lg text-blue-200/80 mb-8">
              The mission configuration wizard is now complete! The next phase will include:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎨</span> Functional Areas Palette
                </h3>
                <ul className="space-y-2 text-sm text-blue-200/80">
                  <li>• Drag & drop 13 functional areas</li>
                  <li>• Sleep quarters, hygiene, food prep</li>
                  <li>• Exercise, medical, workstations</li>
                  <li>• Real-time NASA validation</li>
                </ul>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <span className="text-2xl">🖼️</span> Interactive Canvas
                </h3>
                <ul className="space-y-2 text-sm text-blue-200/80">
                  <li>• Visual habitat layout designer</li>
                  <li>• Resizable functional areas</li>
                  <li>• Grid-based positioning</li>
                  <li>• Scale: 50px = 1 meter</li>
                </ul>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <span className="text-2xl">✅</span> Validation Panel
                </h3>
                <ul className="space-y-2 text-sm text-blue-200/80">
                  <li>• Green/yellow/red status indicators</li>
                  <li>• Size compliance checking</li>
                  <li>• Adjacency rule validation</li>
                  <li>• Missing area warnings</li>
                </ul>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <span className="text-2xl">📊</span> Metrics Dashboard
                </h3>
                <ul className="space-y-2 text-sm text-blue-200/80">
                  <li>• Total area and volume usage</li>
                  <li>• Compliance score (0-100)</li>
                  <li>• Area breakdown charts</li>
                  <li>• Export to PNG/PDF</li>
                </ul>
              </Card>
            </div>

            {missionConfig && habitatConfig && (
              <div className="mt-8 pt-8 border-t border-blue-500/30">
                <h3 className="text-white font-bold mb-4">Your Current Configuration:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-blue-200/60 mb-1">Destination</p>
                    <p className="text-white font-semibold capitalize">
                      {missionConfig.destination.replace(/-/g, ' ')}
                    </p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-blue-200/60 mb-1">Habitat Type</p>
                    <p className="text-white font-semibold capitalize">{habitatConfig.type}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-blue-200/60 mb-1">Shape</p>
                    <p className="text-white font-semibold capitalize">{habitatConfig.shape}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-blue-200/60 mb-1">Dimensions</p>
                    <p className="text-white font-semibold">
                      {habitatConfig.dimensions.width}m × {habitatConfig.dimensions.height}m
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}