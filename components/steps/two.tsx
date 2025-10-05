"use client"

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Calendar, ChevronRight, ChevronLeft } from 'lucide-react'
import { useSetup } from '@/contexts/setup-context'

interface StepTwoProps {
  onNext: () => void
  onBack: () => void
}

export function StepTwo({ onNext, onBack }: StepTwoProps) {
  const { setup, updateSetup } = useSetup()

  const durations = [
    { days: 7, label: '1 Semana', desc: 'Misión exploratoria corta' },
    { days: 30, label: '1 Mes', desc: 'Misión estándar' },
    { days: 90, label: '3 Meses', desc: 'Misión extendida' },
    { days: 180, label: '6 Meses', desc: 'Misión de larga duración' },
    { days: 365, label: '1 Año', desc: 'Misión de residencia permanente' }
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Paso 2: Duración</h2>
        <p className="text-xl text-gray-300">¿Cuánto tiempo durará la misión?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {durations.map((dur) => (
          <Card
            key={dur.days}
            className={`cursor-pointer transition-all hover:scale-105 bg-black/80 border-white/20 ${
              setup.duration === dur.days
                ? 'ring-4 ring-blue-500'
                : 'hover:bg-black/90'
            }`}
            onClick={() => updateSetup({ duration: dur.days })}
          >
            <div className="p-6 space-y-3 text-center">
              <Calendar className="w-12 h-12 text-blue-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">{dur.label}</h3>
              <p className="text-sm text-gray-400">{dur.desc}</p>
              <p className="text-2xl font-bold text-blue-400">{dur.days} días</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-between max-w-5xl mx-auto">
        <Button onClick={onBack} variant="outline" size="lg" className="border-white text-white hover:bg-white/20">
          <ChevronLeft className="mr-2" /> Atrás
        </Button>
        <Button onClick={onNext} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={!setup.duration}>
          Siguiente <ChevronRight className="ml-2" />
        </Button>
      </div>
    </div>
  )
}