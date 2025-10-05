"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, Info, AlertTriangle } from "lucide-react"

interface CrewStepProps {
  crewSize: number
  duration: number
  onCrewSizeChange: (size: number) => void
  onDurationChange: (days: number) => void
}

export function CrewStep({ crewSize, duration, onCrewSizeChange, onDurationChange }: CrewStepProps) {
  const getVolumePerCrew = () => {
    if (duration > 365) return 50
    if (duration > 180) return 40
    if (duration > 90) return 30
    return 25
  }

  const recommendedVolume = crewSize * getVolumePerCrew()

  const getMissionType = () => {
    if (duration <= 30) return { label: "Short Duration", color: "bg-green-500" }
    if (duration <= 180) return { label: "Medium Duration", color: "bg-yellow-500" }
    if (duration <= 365) return { label: "Long Duration", color: "bg-orange-500" }
    return { label: "Extended Duration", color: "bg-red-500" }
  }

  const missionType = getMissionType()

  return (
    <div className="space-y-8">
      {/* Crew Size Selector */}
      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-blue-400" />
          <div>
            <Label className="text-white text-lg font-semibold">Crew Size</Label>
            <p className="text-sm text-blue-200/60">Number of crew members (1-6)</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Slider
              value={[crewSize]}
              onValueChange={(value) => onCrewSizeChange(value[0])}
              min={1}
              max={6}
              step={1}
              className="flex-1"
            />
            <div className="w-20 text-center">
              <span className="text-3xl font-bold text-white">{crewSize}</span>
            </div>
          </div>

          {/* Crew Size Indicators */}
          <div className="grid grid-cols-6 gap-2">
            {[1, 2, 3, 4, 5, 6].map((size) => (
              <button
                key={size}
                onClick={() => onCrewSizeChange(size)}
                className={`p-3 rounded-lg border-2 transition-all ${crewSize === size
                    ? "border-blue-500 bg-blue-600 text-white"
                    : "border-slate-600 bg-slate-700 text-slate-300 hover:border-blue-400"
                  }`}
              >
                <Users className="w-5 h-5 mx-auto" />
                <p className="text-xs mt-1">{size}</p>
              </button>
            ))}
          </div>

          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
            <p className="text-sm text-blue-200/80">
              <strong>NASA Standard:</strong> Crew size affects required space for all functional areas.
              More crew members require proportionally larger living spaces, food storage, and exercise areas.
            </p>
          </div>
        </div>
      </Card>

      {/* Mission Duration */}
      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-blue-400" />
          <div>
            <Label className="text-white text-lg font-semibold">Mission Duration</Label>
            <p className="text-sm text-blue-200/60">Total days in space</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Slider
              value={[duration]}
              onValueChange={(value) => onDurationChange(value[0])}
              min={7}
              max={730}
              step={1}
              className="flex-1"
            />
            <div className="w-32">
              <Input
                type="number"
                value={duration}
                onChange={(e) => onDurationChange(Number(e.target.value))}
                min={7}
                max={730}
                className="bg-slate-700 border-slate-600 text-white text-center"
              />
            </div>
          </div>

          {/* Duration Display */}
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{Math.floor(duration / 7)}</p>
              <p className="text-xs text-blue-200/60">Weeks</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{Math.floor(duration / 30)}</p>
              <p className="text-xs text-blue-200/60">Months</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{(duration / 365).toFixed(1)}</p>
              <p className="text-xs text-blue-200/60">Years</p>
            </div>
            <Badge className={`${missionType.color} text-white`}>
              {missionType.label}
            </Badge>
          </div>

          {/* Quick Presets */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "1 Week", days: 7 },
              { label: "1 Month", days: 30 },
              { label: "6 Months", days: 180 },
              { label: "1 Year", days: 365 }
            ].map((preset) => (
              <button
                key={preset.days}
                onClick={() => onDurationChange(preset.days)}
                className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-blue-600 text-white text-xs transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Calculated Requirements */}
      <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30 p-6">
        <div className="flex items-start gap-3 mb-4">
          <Info className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
          <div>
            <h4 className="text-white font-semibold mb-2">Calculated Requirements</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-blue-200/60">Volume per Crew</p>
                <p className="text-xl font-bold text-white">{getVolumePerCrew()} m³</p>
              </div>
              <div>
                <p className="text-blue-200/60">Recommended Total Volume</p>
                <p className="text-xl font-bold text-white">{recommendedVolume} m³</p>
              </div>
            </div>
          </div>
        </div>

        {duration > 365 && (
          <div className="flex items-start gap-3 mt-4 pt-4 border-t border-blue-500/30">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-yellow-200/80">
              <strong>Extended Duration Mission:</strong> Missions longer than 1 year require significantly
              more space per crew member for psychological well-being and resource storage.
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}