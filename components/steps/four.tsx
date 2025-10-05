import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Rocket, Users, Calendar, Globe, Package, Ruler } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

export function StepFour() {
  const [crewSize, setCrewSize] = useState(4)
  const [duration, setDuration] = useState(180)
  const [destination, setDestination] = useState<"lunar-surface" | "mars-surface" | "deep-space" | "leo">("lunar-surface")
  const [habitatType, setHabitatType] = useState<"metallic" | "inflatable" | "in-situ">("metallic")

  const destinations = [
    { id: "lunar-surface" as const, name: "Luna", icon: "🌙", desc: "Superficie lunar" },
    { id: "mars-surface" as const, name: "Marte", icon: "🔴", desc: "Superficie marciana" },
    { id: "deep-space" as const, name: "Espacio Profundo", icon: "🌌", desc: "Estación espacial" },
    { id: "leo" as const, name: "LEO", icon: "🛰️", desc: "Órbita baja terrestre" }
  ]

  const habitatTypes = [
    { id: "metallic" as const, name: "Metálico", icon: "🔩", color: "border-slate-500" },
    { id: "inflatable" as const, name: "Inflable", icon: "🎈", color: "border-orange-500" },
    { id: "in-situ" as const, name: "ISRU", icon: "🏗️", color: "border-yellow-500" }
  ]

  const handleSaveConfig = () => {
    const config = {
      crewSize,
      durationDays: duration,
      destination,
      habitatType,
      launchVehicle: "sls",
      shape: "cylindrical",
      dimensions: { width: 4.5, height: 10.0 },
      volume: 159,
      levels: 1
    }
    
    // Guardar en localStorage
    localStorage.setItem('missionConfig', JSON.stringify(config))
  }

  // Auto-save cuando cambian los valores
  const updateConfig = () => {
    handleSaveConfig()
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <Rocket className="w-10 h-10 text-blue-400" />
          Configura Tu Misión
        </h2>
        <p className="text-lg text-blue-200/80 max-w-3xl mx-auto">
          Define los parámetros de tu misión espacial antes de diseñar el hábitat
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full">
        {/* Crew Size */}
        <Card className="bg-slate-800/50 border-blue-500/30 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-bold text-white">Tripulación</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-blue-200/80">Miembros:</span>
              <Badge className="bg-blue-600 text-2xl px-4 py-2">{crewSize}</Badge>
            </div>
            <Slider
              value={[crewSize]}
              onValueChange={(val) => {
                setCrewSize(val[0])
                updateConfig()
              }}
              min={1}
              max={8}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-blue-200/60">
              Más tripulación = más espacio requerido
            </p>
          </div>
        </Card>

        {/* Mission Duration */}
        <Card className="bg-slate-800/50 border-purple-500/30 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-bold text-white">Duración</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-blue-200/80">Días:</span>
              <Badge className="bg-purple-600 text-2xl px-4 py-2">{duration}</Badge>
            </div>
            <Slider
              value={[duration]}
              onValueChange={(val) => {
                setDuration(val[0])
                updateConfig()
              }}
              min={7}
              max={730}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-blue-200/60">
              {duration < 30 ? "Misión corta" : duration < 180 ? "Misión media" : duration < 365 ? "Misión larga" : "Misión extendida"}
            </p>
          </div>
        </Card>

        {/* Destination */}
        <Card className="bg-slate-800/50 border-green-500/30 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 text-green-400" />
            <h3 className="text-xl font-bold text-white">Destino</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {destinations.map((dest) => (
              <button
                key={dest.id}
                onClick={() => {
                  setDestination(dest.id)
                  updateConfig()
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  destination === dest.id
                    ? "border-green-500 bg-green-900/30 scale-105"
                    : "border-slate-600 hover:border-green-400/50"
                }`}
              >
                <div className="text-3xl mb-2">{dest.icon}</div>
                <div className="text-white font-bold text-sm">{dest.name}</div>
                <div className="text-xs text-blue-200/60">{dest.desc}</div>
              </button>
            ))}
          </div>
        </Card>

        {/* Habitat Type */}
        <Card className="bg-slate-800/50 border-orange-500/30 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-6 h-6 text-orange-400" />
            <h3 className="text-xl font-bold text-white">Tipo de Hábitat</h3>
          </div>
          <div className="space-y-3">
            {habitatTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => {
                  setHabitatType(type.id)
                  updateConfig()
                }}
                className={`w-full p-3 rounded-lg border-2 transition-all flex items-center gap-3 ${
                  habitatType === type.id
                    ? `${type.color} bg-slate-700/50`
                    : "border-slate-600 hover:border-orange-400/50"
                }`}
              >
                <span className="text-2xl">{type.icon}</span>
                <span className="text-white font-semibold">{type.name}</span>
                {habitatType === type.id && (
                  <Badge className="ml-auto bg-green-600">✓</Badge>
                )}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Summary */}
      <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30 p-6 max-w-5xl w-full">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-xs text-blue-200/60">Tripulación</p>
                <p className="text-white font-bold">{crewSize} miembros</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-xs text-blue-200/60">Duración</p>
                <p className="text-white font-bold">{duration} días</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-xs text-blue-200/60">Destino</p>
                <p className="text-white font-bold capitalize">
                  {destinations.find(d => d.id === destination)?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-400" />
              <div>
                <p className="text-xs text-blue-200/60">Tipo</p>
                <p className="text-white font-bold">
                  {habitatTypes.find(h => h.id === habitatType)?.name}
                </p>
              </div>
            </div>
          </div>
          <Badge className="bg-green-600 text-lg px-4 py-2">
            ✓ Configuración Guardada
          </Badge>
        </div>
      </Card>

      <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg max-w-5xl w-full">
        <p className="text-green-200/90 text-center">
          <strong className="text-green-300">🎯 ¡Todo Listo!</strong> Tu misión está configurada.
          En el siguiente paso comenzarás a diseñar el interior del hábitat con drag & drop.
        </p>
      </div>
    </div>
  )
}
