"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, XCircle, TrendingUp, Users, Calendar, Ruler } from "lucide-react"
import { FUNCTIONAL_AREA_REQUIREMENTS, getMinimumArea, getMinimumVolume, getRequiredAreas } from "@/lib/habitat/functional-areas"
import type { FunctionalAreaType } from "@/types"

interface MetricsDashboardProps {
  crewSize: number
  durationDays: number
  totalArea: number
  totalVolume: number
  placedAreas: Array<{ type: FunctionalAreaType; area: number; volume: number }>
}

export function MetricsDashboard({
  crewSize,
  durationDays,
  totalArea,
  totalVolume,
  placedAreas
}: MetricsDashboardProps) {

  // Calculate total required minimums
  const requiredAreas = getRequiredAreas()
  const totalRequiredArea = requiredAreas.reduce((sum, areaType) => {
    return sum + getMinimumArea(areaType, crewSize, durationDays)
  }, 0)

  const totalRequiredVolume = requiredAreas.reduce((sum, areaType) => {
    return sum + getMinimumVolume(areaType, crewSize, durationDays)
  }, 0)

  // Calculate current totals
  const currentTotalArea = placedAreas.reduce((sum, area) => sum + area.area, 0)
  const currentTotalVolume = placedAreas.reduce((sum, area) => sum + area.volume, 0)

  // Calculate compliance metrics
  const areaCompliance = Math.min((currentTotalArea / totalRequiredArea) * 100, 100)
  const volumeCompliance = Math.min((currentTotalVolume / totalRequiredVolume) * 100, 100)

  // Check individual area compliance
  const areasCompliance = requiredAreas.map(areaType => {
    const placed = placedAreas.find(a => a.type === areaType)
    const minRequired = getMinimumArea(areaType, crewSize, durationDays)

    return {
      type: areaType,
      isPlaced: !!placed,
      currentArea: placed?.area || 0,
      requiredArea: minRequired,
      isCompliant: placed && placed.area >= minRequired
    }
  })

  const compliantAreas = areasCompliance.filter(a => a.isCompliant).length
  const totalRequiredCount = requiredAreas.length

  // Calculate NASA habitable volume per crew
  const habitableVolumePerCrew = currentTotalVolume / crewSize
  const nasaMinVolumePerCrew = 25 // m³ minimum per crew member
  const nasaRecommendedVolumePerCrew = durationDays > 365 ? 50 : durationDays > 180 ? 40 : 30

  const volumePerCrewStatus =
    habitableVolumePerCrew >= nasaRecommendedVolumePerCrew ? 'excellent' :
      habitableVolumePerCrew >= nasaMinVolumePerCrew ? 'adequate' : 'insufficient'

  // Overall compliance score
  const overallScore = Math.round(
    (areaCompliance * 0.4 + volumeCompliance * 0.3 + (compliantAreas / totalRequiredCount) * 100 * 0.3)
  )

  const getScoreStatus = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-green-400', bgColor: 'bg-green-900/30', icon: CheckCircle2 }
    if (score >= 70) return { label: 'Good', color: 'text-blue-400', bgColor: 'bg-blue-900/30', icon: TrendingUp }
    if (score >= 50) return { label: 'Fair', color: 'text-yellow-400', bgColor: 'bg-yellow-900/30', icon: AlertCircle }
    return { label: 'Poor', color: 'text-red-400', bgColor: 'bg-red-900/30', icon: XCircle }
  }

  const scoreStatus = getScoreStatus(overallScore)
  const ScoreIcon = scoreStatus.icon

  return (
    <div className="h-full flex flex-col space-y-4 p-4 overflow-auto">
      {/* Mission Parameters */}
      <Card className="bg-slate-800/50 border-slate-700 p-4">
        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-400" />
          Mission Parameters
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-slate-900/50 p-2 rounded">
            <p className="text-slate-400 text-xs">Crew Size</p>
            <p className="text-white font-semibold">{crewSize} members</p>
          </div>
          <div className="bg-slate-900/50 p-2 rounded">
            <p className="text-slate-400 text-xs">Duration</p>
            <p className="text-white font-semibold">{durationDays} days</p>
          </div>
        </div>
      </Card>

      {/* Overall Compliance Score */}
      <Card className={`border-slate-700 p-4 ${scoreStatus.bgColor}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold">NASA Compliance</h3>
          <Badge className={`${scoreStatus.color}`}>
            <ScoreIcon className="w-3 h-3 mr-1" />
            {scoreStatus.label}
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Progress value={overallScore} className="h-3" />
          </div>
          <span className={`text-2xl font-bold ${scoreStatus.color}`}>{overallScore}%</span>
        </div>
      </Card>

      {/* Area Compliance */}
      <Card className="bg-slate-800/50 border-slate-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold text-sm flex items-center gap-2">
            <Ruler className="w-4 h-4 text-blue-400" />
            Total Area
          </h3>
          <Badge variant={areaCompliance >= 100 ? "default" : "outline"}>
            {currentTotalArea.toFixed(1)} / {totalRequiredArea.toFixed(1)} m²
          </Badge>
        </div>
        <Progress value={areaCompliance} className="h-2 mb-2" />
        <p className="text-xs text-slate-400">
          {areaCompliance >= 100 ? '✓ Meets minimum area requirements' : `Need ${(totalRequiredArea - currentTotalArea).toFixed(1)} m² more`}
        </p>
      </Card>

      {/* Volume Compliance */}
      <Card className="bg-slate-800/50 border-slate-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold text-sm">Total Volume</h3>
          <Badge variant={volumeCompliance >= 100 ? "default" : "outline"}>
            {currentTotalVolume.toFixed(1)} / {totalRequiredVolume.toFixed(1)} m³
          </Badge>
        </div>
        <Progress value={volumeCompliance} className="h-2 mb-2" />
        <p className="text-xs text-slate-400">
          {volumeCompliance >= 100 ? '✓ Meets minimum volume requirements' : `Need ${(totalRequiredVolume - currentTotalVolume).toFixed(1)} m³ more`}
        </p>
      </Card>

      {/* Volume Per Crew */}
      <Card className="bg-slate-800/50 border-slate-700 p-4">
        <h3 className="text-white font-semibold text-sm mb-3">Habitable Volume per Crew</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Current</span>
            <span className={`font-semibold ${volumePerCrewStatus === 'excellent' ? 'text-green-400' :
                volumePerCrewStatus === 'adequate' ? 'text-yellow-400' : 'text-red-400'
              }`}>
              {habitableVolumePerCrew.toFixed(1)} m³/crew
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">NASA Minimum</span>
            <span className="text-white">{nasaMinVolumePerCrew} m³/crew</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">NASA Recommended</span>
            <span className="text-white">{nasaRecommendedVolumePerCrew} m³/crew</span>
          </div>
        </div>
      </Card>

      {/* Required Areas Status */}
      <Card className="bg-slate-800/50 border-slate-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold text-sm">Required Areas</h3>
          <Badge variant={compliantAreas === totalRequiredCount ? "default" : "outline"}>
            {compliantAreas} / {totalRequiredCount}
          </Badge>
        </div>
        <div className="space-y-2 max-h-64 overflow-auto">
          {areasCompliance.map(area => {
            const req = FUNCTIONAL_AREA_REQUIREMENTS[area.type]
            return (
              <div key={area.type} className="flex items-center justify-between p-2 bg-slate-900/50 rounded text-xs">
                <div className="flex items-center gap-2">
                  <span>{req.icon}</span>
                  <span className="text-slate-300">{area.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  {!area.isPlaced ? (
                    <XCircle className="w-4 h-4 text-slate-400" />
                  ) : area.isCompliant ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                  )}
                  <span className={area.isCompliant ? 'text-green-400' : area.isPlaced ? 'text-yellow-400' : 'text-slate-400'}>
                    {area.currentArea.toFixed(1)} / {area.requiredArea.toFixed(1)} m²
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Design Tips */}
      <Card className="bg-blue-900/20 border-blue-500/30 p-4">
        <h3 className="text-blue-300 font-semibold text-sm mb-2">💡 Design Tips</h3>
        <ul className="space-y-1 text-xs text-blue-200/80">
          {overallScore < 50 && <li>• Add more required functional areas</li>}
          {areaCompliance < 100 && <li>• Increase area of undersized zones</li>}
          {volumeCompliance < 100 && <li>• Add ceiling height to increase volume</li>}
          {habitableVolumePerCrew < nasaRecommendedVolumePerCrew && <li>• Add more living space for crew comfort</li>}
          {compliantAreas === totalRequiredCount && areaCompliance >= 100 && <li>✓ All requirements met! Consider adding optional areas.</li>}
        </ul>
      </Card>
    </div>
  )
}
