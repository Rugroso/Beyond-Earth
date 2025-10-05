"use client"

import { useState, useRef, useCallback } from "react"
import { MissionWizard } from "@/components/habitat/wizard/mission-wizard"
import { FunctionalAreasPalette } from "@/components/habitat/functional-areas-palette"
import { MetricsDashboard } from "@/components/habitat/metrics-dashboard"
import type { MissionConfigWizard, HabitatConfig, FunctionalAreaType, PlacedZone } from "@/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Rocket, ArrowLeft, Download, Save } from "lucide-react"
import { getMinimumArea, FUNCTIONAL_AREA_REQUIREMENTS } from "@/lib/habitat/functional-areas"

// Constants for canvas
const CANVAS_WIDTH = 1400
const CANVAS_HEIGHT = 800
const PIXELS_PER_METER = 20 // Scale: 20 pixels = 1 meter

export default function HabitatDesignerPage() {
  const [showWizard, setShowWizard] = useState(true)
  const [missionConfig, setMissionConfig] = useState<MissionConfigWizard | null>(null)
  const [habitatConfig, setHabitatConfig] = useState<HabitatConfig | null>(null)
  const [placedZones, setPlacedZones] = useState<PlacedZone[]>([])
  const [draggedAreaType, setDraggedAreaType] = useState<FunctionalAreaType | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleWizardComplete = (mission: MissionConfigWizard, habitat: HabitatConfig) => {
    setMissionConfig(mission)
    setHabitatConfig(habitat)
    setShowWizard(false)

    // Save to localStorage for persistence
    localStorage.setItem('currentMission', JSON.stringify(mission))
    localStorage.setItem('currentHabitat', JSON.stringify(habitat))
  }

  const handleSkipWizard = () => {
    const defaultMission: MissionConfigWizard = {
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

  const handleAreaDragStart = useCallback((areaType: FunctionalAreaType) => {
    setDraggedAreaType(areaType)
  }, [])

  const handleCanvasDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedAreaType || !missionConfig || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Calculate default dimensions based on requirements
    const minArea = getMinimumArea(draggedAreaType, missionConfig.crewSize, missionConfig.durationDays)
    const defaultWidthM = Math.sqrt(minArea * 1.5) // Make it 1.5x minimum for better starting size
    const defaultHeightM = defaultWidthM
    const defaultWidth = defaultWidthM * PIXELS_PER_METER
    const defaultHeight = defaultHeightM * PIXELS_PER_METER

    const newZone: PlacedZone = {
      instanceId: `zone-${Date.now()}-${Math.random()}`,
      zoneType: draggedAreaType,
      position: { x, y },
      dimensions: { width: defaultWidth, height: defaultHeight },
      areaM2: (defaultWidth * defaultHeight) / (PIXELS_PER_METER * PIXELS_PER_METER)
    }

    setPlacedZones(prev => [...prev, newZone])
    setDraggedAreaType(null)
  }, [draggedAreaType, missionConfig])

  const handleRemoveZone = useCallback((instanceId: string) => {
    setPlacedZones(prev => prev.filter(z => z.instanceId !== instanceId))
  }, [])

  const handleExportDesign = useCallback(() => {
    if (!missionConfig || !habitatConfig) return

    const designData = {
      mission: missionConfig,
      habitat: habitatConfig,
      zones: placedZones,
      exportedAt: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(designData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `habitat-design-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }, [missionConfig, habitatConfig, placedZones])

  if (showWizard) {
    return <MissionWizard onComplete={handleWizardComplete} onSkip={handleSkipWizard} />
  }

  if (!missionConfig || !habitatConfig) {
    return null
  }

  // Calculate metrics for dashboard
  const placedAreas = placedZones.map(zone => ({
    type: zone.zoneType,
    area: zone.areaM2,
    volume: zone.areaM2 * 3 // Assuming 3m ceiling height
  }))

  const totalArea = placedZones.reduce((sum, zone) => sum + zone.areaM2, 0)
  const totalVolume = totalArea * 3 // Assuming 3m ceiling height

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-blue-500/30 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-[2000px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setShowWizard(true)}
                className="text-blue-300 hover:bg-blue-500/10"
                size="sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Reconfigure
              </Button>
              <div className="flex items-center gap-3">
                <Rocket className="w-8 h-8 text-blue-400" />
                <div>
                  <h1 className="text-xl font-bold text-white">Habitat Designer</h1>
                  <p className="text-xs text-blue-200/60">
                    {missionConfig.crewSize} crew • {missionConfig.durationDays} days • {habitatConfig.volume.toFixed(0)} m³
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportDesign}
                className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-green-500/30 text-green-300 hover:bg-green-500/10"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0 max-w-[2000px] mx-auto w-full">
        {/* Left Sidebar - Functional Areas Palette */}
        <div className="w-80 flex-shrink-0 border-r border-blue-500/30 bg-slate-900/30 overflow-hidden">
          <FunctionalAreasPalette
            crewSize={missionConfig.crewSize}
            durationDays={missionConfig.durationDays}
            placedAreas={placedAreas}
            onAreaDragStart={handleAreaDragStart}
          />
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 p-6 overflow-auto">
          <Card className="bg-slate-800/50 border-slate-700 p-4 h-full">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-white font-bold text-lg">Design Canvas</h2>
                <p className="text-blue-200/60 text-sm">Drag functional areas from the left panel onto the canvas</p>
              </div>
              <div className="text-xs text-slate-400">
                Scale: {PIXELS_PER_METER}px = 1m
              </div>
            </div>

            {/* Canvas Area */}
            <div
              ref={canvasRef}
              onDragOver={handleCanvasDragOver}
              onDrop={handleCanvasDrop}
              className="relative bg-slate-900 rounded-lg border-2 border-dashed border-slate-600 overflow-hidden"
              style={{
                width: `${CANVAS_WIDTH}px`,
                height: `${CANVAS_HEIGHT}px`,
                backgroundImage: `
                  linear-gradient(rgba(100, 116, 139, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(100, 116, 139, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: `${PIXELS_PER_METER}px ${PIXELS_PER_METER}px`
              }}
            >
              {placedZones.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">
                  Drop functional areas here to start designing your habitat
                </div>
              )}

              {/* Render placed zones */}
              {placedZones.map((zone) => {
                const requirements = FUNCTIONAL_AREA_REQUIREMENTS[zone.zoneType]
                const minRequired = getMinimumArea(zone.zoneType, missionConfig.crewSize, missionConfig.durationDays)
                const isCompliant = zone.areaM2 >= minRequired

                return (
                  <div
                    key={zone.instanceId}
                    className="absolute group cursor-move hover:opacity-90 transition-opacity"
                    style={{
                      left: `${zone.position.x}px`,
                      top: `${zone.position.y}px`,
                      width: `${zone.dimensions.width}px`,
                      height: `${zone.dimensions.height}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div
                      className={`w-full h-full rounded-lg border-4 shadow-lg relative ${
                        isCompliant ? 'border-green-500' : 'border-red-500'
                      }`}
                      style={{
                        backgroundColor: `${requirements.color}40`,
                        borderLeftWidth: '8px',
                        borderLeftColor: requirements.color
                      }}
                    >
                      {/* Zone Label */}
                      <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-white">
                        <span>{requirements.icon}</span>
                        <span>{zone.zoneType.replace(/-/g, ' ')}</span>
                      </div>

                      {/* Area Display */}
                      <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
                        {zone.areaM2.toFixed(1)} m²
                        {!isCompliant && (
                          <span className="text-red-400 ml-2">
                            (need {minRequired.toFixed(1)} m²)
                          </span>
                        )}
                      </div>

                      {/* Delete Button */}
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveZone(zone.instanceId)}
                      >
                        <span className="text-xs">×</span>
                      </Button>

                      {/* Status Indicator */}
                      {!isCompliant && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                            TOO SMALL
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Instructions */}
            <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <p className="text-sm text-blue-200/80">
                <strong>💡 Tips:</strong> Drag functional areas from the left panel onto the canvas. 
                Green borders = meets requirements, Red borders = too small. 
                Grid squares = 1m × 1m. Click × to remove an area.
              </p>
            </div>
          </Card>
        </div>

        {/* Right Sidebar - Metrics Dashboard */}
        <div className="w-80 flex-shrink-0 border-l border-blue-500/30 bg-slate-900/30 overflow-hidden">
          <MetricsDashboard
            crewSize={missionConfig.crewSize}
            durationDays={missionConfig.durationDays}
            totalArea={habitatConfig.volume}
            totalVolume={totalVolume}
            placedAreas={placedAreas}
          />
        </div>
      </div>
    </div>
  )
}