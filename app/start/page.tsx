"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { StepOne, StepTwo, StepThree, StepFour } from "@/components/steps"
import { Howl } from "howler"

// Definir los pasos del tutorial - IMPORTANTE: Incluir StepFour
const STEPS = [StepOne, StepTwo, StepThree, StepFour]

export default function StartPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const backgroundMusicRef = useRef<Howl | null>(null)

  useEffect(() => {
    // Initialize Howler background music
    backgroundMusicRef.current = new Howl({
      src: ['/music/arrival.wav'],
      loop: true,
      volume: 0.6,
      autoplay: true,
      onload: () => {
        console.log('Tutorial music loaded')
      }
    })

    return () => {
      // Cleanup Howler instance
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.unload()
      }
    }
  }, [])

  const handleNext = () => {
    console.log('📍 Current step:', currentStep, 'Total steps:', STEPS.length)
    if (currentStep < STEPS.length - 1) {
      console.log('➡️ Going to next step:', currentStep + 1)
      setCurrentStep(currentStep + 1)
    } else {
      console.log('✅ Already at last step')
    }
    // El último paso (StepFour) maneja la navegación al juego
  }

  const handleBack = () => {
    if (currentStep > 0) {
      console.log('⬅️ Going back to step:', currentStep - 1)
      setCurrentStep(currentStep - 1)
    } else {
      console.log('🏠 Going back to home')
      router.push("/")
    }
  }

  const CurrentStepComponent = STEPS[currentStep]
  
  console.log('🎬 Rendering step', currentStep + 1, 'of', STEPS.length)

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900">
      {/* Fondo con estrellas */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="star-small"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Header con indicador de progreso */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center gap-2">
          {STEPS.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-12 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? "bg-blue-500"
                  : index < currentStep
                  ? "bg-blue-300"
                  : "bg-gray-600"
              }`}
            />
          ))}
        </div>
        <div className="text-white text-sm font-medium">
          Paso {currentStep + 1} de {STEPS.length}
        </div>
      </div>

      {/* Contenido del paso actual */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-5xl animate-fade-in">
          <CurrentStepComponent onNext={handleNext} onBack={handleBack} />
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes twinkle-small {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .star-small {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          animation: twinkle-small 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}