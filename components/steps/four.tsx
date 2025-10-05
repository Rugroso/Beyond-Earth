
"use client"

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Maximize2, Rocket, ChevronLeft } from 'lucide-react'
import { useSetup } from '@/contexts/setup-context'
import { useRouter } from 'next/navigation'
import type { CanvasSize } from '@/types/setup'

interface StepFourProps {
  onNext: () => void
  onBack: () => void
}

export function StepFour({ onNext, onBack }: StepFourProps) {
  const { setup, updateSetup, generateLayoutConstraints, isSetupComplete } = useSetup()
  const router = useRouter()

  const sizes = [
    { id: 'small' as CanvasSize, label: 'Pequeño', width: 800, height: 600, desc: 'Hábitat compacto' },
    { id: 'medium' as CanvasSize, label: 'Mediano', width: 1200, height: 800, desc: 'Hábitat estándar' },
    { id: 'large' as CanvasSize, label: 'Grande', width: 1600, height: 1000, desc: 'Hábitat espacioso' },
    { id: 'xlarge' as CanvasSize, label: 'Extra Grande', width: 2000, height: 1200, desc: 'Hábitat expandido' }
  ]

  const handleStartMission = () => {
    if (!setup.canvasSize) return
    
    if (!isSetupComplete()) {
      alert('Por favor completa todos los pasos antes de comenzar')
      return
    }

    try {
      generateLayoutConstraints()
      router.push('/game')
    } catch (error) {
      alert('Error al iniciar la misión: ' + (error as Error).message)
    }
  }

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Paso 4: Tamaño del Hábitat</h2>
        <p className="text-xl text-gray-300">Elige las dimensiones de tu espacio de construcción</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sizes.map((size) => (
          <Card
            key={size.id}
            className={`cursor-pointer transition-all hover:scale-105 ${
              setup.canvasSize === size.id
                ? 'ring-4 ring-blue-500 bg-blue-950/50'
                : 'hover:bg-slate-800/50'
            }`}
            onClick={() => updateSetup({ canvasSize: size.id })}
          >
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-center">
                <Maximize2 className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white text-center">{size.label}</h3>
              <p className="text-sm text-gray-400 text-center">{size.desc}</p>
              <div className="bg-slate-800 rounded p-2 text-center">
                <p className="text-blue-400 font-mono text-sm">
                  {size.width} × {size.height} px
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-between items-center gap-4 pt-4">
        <Button 
          onClick={onBack} 
          variant="outline" 
          size="lg"
          className="text-lg px-8 py-6"
        >
          <ChevronLeft className="mr-2 h-5 w-5" /> Atrás
        </Button>
        
        <Button
          onClick={handleStartMission}
          disabled={!setup.canvasSize}
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6"
        >
          Comenzar Misión <Rocket className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}