"use client"

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Users, ChevronRight, ChevronLeft } from 'lucide-react'
import { useSetup } from '@/contexts/setup-context'

interface StepThreeProps {
  onNext: () => void
  onBack: () => void
}

export function StepThree({ onNext, onBack }: StepThreeProps) {
  const { setup, updateSetup } = useSetup()

  const crewSizes = [1, 2, 3, 4, 5, 6, 7, 8]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Paso 3: Tripulación</h2>
        <p className="text-xl text-gray-300">¿Cuántas personas vivirán en el hábitat?</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {crewSizes.map((size) => (
          <Card
            key={size}
            className={`cursor-pointer transition-all hover:scale-105 bg-black/80 border-white/20 ${
              setup.crewSize === size
                ? 'ring-4 ring-blue-500'
                : 'hover:bg-black/90'
            }`}
            onClick={() => updateSetup({ crewSize: size })}
          >
            <div className="p-6 space-y-3 text-center">
              <Users className="w-10 h-10 text-blue-400 mx-auto" />
              <p className="text-3xl font-bold text-white">{size}</p>
              <p className="text-sm text-gray-400">
                {size === 1 ? 'persona' : 'personas'}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-between max-w-4xl mx-auto">
        <Button onClick={onBack} variant="outline" size="lg" className="border-white text-white hover:bg-white/20">
          <ChevronLeft className="mr-2" /> Atrás
        </Button>
        <Button onClick={onNext} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={!setup.crewSize}>
          Siguiente <ChevronRight className="ml-2" />
        </Button>
      </div>
    </div>
  )
}