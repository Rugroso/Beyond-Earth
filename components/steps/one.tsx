"use client"

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Rocket, Moon, ChevronRight } from 'lucide-react'
import { useSetup } from '@/contexts/setup-context'
import type { Destination } from '@/types/setup'

interface StepOneProps {
  onNext: () => void
}

export function StepOne({ onNext }: StepOneProps) {
  const { setup, updateSetup } = useSetup()

  const destinations = [
    {
      id: 'moon' as Destination,
      name: 'Luna',
      icon: Moon,
      description: 'Misión cercana, ideal para estancias cortas',
      distance: '384,400 km',
      gravity: '1/6 de la Tierra',
      color: 'from-gray-600 to-gray-800'
    },
    {
      id: 'mars' as Destination,
      name: 'Marte',
      icon: Rocket,
      description: 'Misión de larga duración, mayor autosuficiencia',
      distance: '225M km (promedio)',
      gravity: '38% de la Tierra',
      color: 'from-red-600 to-orange-700'
    }
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Paso 1: Destino</h2>
        <p className="text-xl text-gray-300">¿Hacia dónde se dirige tu misión?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {destinations.map((dest) => (
          <Card
            key={dest.id}
            className={`cursor-pointer transition-all hover:scale-105 ${
              setup.destination === dest.id
                ? 'ring-4 ring-blue-500 bg-blue-950/50'
                : 'hover:bg-slate-800/50'
            }`}
            onClick={() => updateSetup({ destination: dest.id })}
          >
            <div className="p-6 space-y-4">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${dest.color} flex items-center justify-center mx-auto`}>
                <dest.icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white text-center">{dest.name}</h3>
              <p className="text-gray-400 text-center text-sm">{dest.description}</p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex justify-between">
                  <span>Distancia:</span>
                  <span className="text-white">{dest.distance}</span>
                </div>
                <div className="flex justify-between">
                  <span>Gravedad:</span>
                  <span className="text-white">{dest.gravity}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={onNext}
          disabled={!setup.destination}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700"
        >
          Siguiente <ChevronRight className="ml-2" />
        </Button>
      </div>
    </div>
  )
}