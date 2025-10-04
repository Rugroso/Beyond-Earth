"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { StepOne, StepTwo, StepThree } from "@/components/steps"

// Definir los pasos del tutorial
const STEPS = [StepOne, StepTwo, StepThree]

export default function StartPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Si es el último paso, ir al juego
      router.push("/game")
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      router.push("/")
    }
  }


  const CurrentStepComponent = STEPS[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === STEPS.length - 1

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

      {/* Header con indicador de progreso y botón Skip */}
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
      </div>

      {/* Contenido del paso actual */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="w-full max-w-4xl animate-fade-in">
          <CurrentStepComponent />
        </div>
      </div>

      {/* Controles de navegación */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <Button
          onClick={handleBack}
          variant="outline"
          size="lg"
          className="bg-white/10 hover:bg-white/20 text-white border-white/30"
        >
          {isFirstStep ? "Volver al Inicio" : "Atrás"}
        </Button>

        <Button
          onClick={handleNext}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLastStep ? "Comenzar Juego" : "Siguiente"}
        </Button>
      </div>

      {/* Secuencia de pasos , aqui vamos a poner las animaciones, estan en proceso*/}
        <div className="text-white text-xl font-bold absolute bottom-8 left-1/2 transform -translate-x-1/2">
          Paso {currentStep + 1} de {STEPS.length}
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
