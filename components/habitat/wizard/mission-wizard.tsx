"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { MissionConfig, HabitatConfig, Destination, LaunchVehicle, HabitatType, HabitatShape } from "@/types"
import { DestinationStep } from "./destination-step"
import { CrewStep } from "./crew-step"
import { VehicleStep } from "./vehicle-step"
import { HabitatStep } from "./habitat-step"
import { DimensionsStep } from "./dimensions-step"
import { SummaryStep } from "./summary-step"
import { Rocket, ArrowLeft, ArrowRight, Check } from "lucide-react"

interface MissionWizardProps {
  onComplete: (mission: MissionConfig, habitat: HabitatConfig) => void
  onSkip?: () => void
}

export function MissionWizard({ onComplete, onSkip }: MissionWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)

  // Mission configuration state
  const [destination, setDestination] = useState<Destination>("lunar-surface")
  const [crewSize, setCrewSize] = useState(4)
  const [duration, setDuration] = useState(180)
  const [launchVehicle, setLaunchVehicle] = useState<LaunchVehicle>("sls")
  const [habitatType, setHabitatType] = useState<HabitatType>("metallic")
  const [habitatShape, setHabitatShape] = useState<HabitatShape>("cylindrical")
  const [dimensions, setDimensions] = useState({ width: 4.5, height: 10.0 })

  const steps = [
    {
      title: "Choose Destination",
      description: "Select where your habitat will be deployed",
      icon: "🌍"
    },
    {
      title: "Mission Parameters",
      description: "Define crew size and mission duration",
      icon: "👨‍🚀"
    },
    {
      title: "Launch Vehicle",
      description: "Select the vehicle that will deliver your habitat",
      icon: "🚀"
    },
    {
      title: "Habitat Configuration",
      description: "Choose the type and shape of your habitat",
      icon: "🏗️"
    },
    {
      title: "Define Dimensions",
      description: "Set the size of your habitat within constraints",
      icon: "📏"
    },
    {
      title: "Review & Confirm",
      description: "Review all parameters before starting",
      icon: "✅"
    }
  ]

  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    const missionConfig: MissionConfig = {
      crewSize,
      durationDays: duration,
      destination,
      launchVehicle
    }

    const habitatConfig: HabitatConfig = {
      shape: habitatShape,
      type: habitatType,
      dimensions: {
        width: dimensions.width,
        height: dimensions.height
      },
      volume: calculateVolume(habitatShape, dimensions.width, dimensions.height),
      levels: 1
    }

    onComplete(missionConfig, habitatConfig)
  }

  const calculateVolume = (shape: HabitatShape, width: number, height: number): number => {
    switch (shape) {
      case "cylindrical":
        return Math.PI * Math.pow(width / 2, 2) * height
      case "spherical":
        return (4 / 3) * Math.PI * Math.pow(width / 2, 3)
      case "toroidal":
        return 2 * Math.PI * Math.PI * (width / 2) * Math.pow(2, 2)
      case "modular":
        return 3 * Math.PI * Math.pow(width / 2, 2) * height
      default:
        return 0
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Rocket className="w-10 h-10 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Mission Configuration</h1>
          </div>
          <p className="text-blue-200/80 text-lg">
            Configure your space habitat mission parameters
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-blue-200">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-blue-200">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps Indicator */}
        <div className="flex items-center justify-between mb-8 px-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col items-center transition-all ${index <= currentStep ? 'opacity-100' : 'opacity-40'
                }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xl mb-2 transition-all ${index < currentStep
                    ? 'bg-green-500 text-white'
                    : index === currentStep
                      ? 'bg-blue-500 text-white ring-4 ring-blue-500/30'
                      : 'bg-slate-700 text-slate-400'
                  }`}
              >
                {index < currentStep ? <Check className="w-5 h-5" /> : step.icon}
              </div>
              <span className="text-xs text-white text-center hidden md:block max-w-[100px]">
                {step.title}
              </span>
            </div>
          ))}
        </div>

        {/* Main Content Card */}
        <Card className="bg-slate-900/50 border-blue-500/30 backdrop-blur-sm p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-blue-200/60">{steps[currentStep].description}</p>
          </div>

          {/* Step Content */}
          <div className="min-h-[400px]">
            {currentStep === 0 && (
              <DestinationStep
                selected={destination}
                onSelect={setDestination}
              />
            )}
            {currentStep === 1 && (
              <CrewStep
                crewSize={crewSize}
                duration={duration}
                onCrewSizeChange={setCrewSize}
                onDurationChange={setDuration}
              />
            )}
            {currentStep === 2 && (
              <VehicleStep
                selected={launchVehicle}
                onSelect={setLaunchVehicle}
              />
            )}
            {currentStep === 3 && (
              <HabitatStep
                type={habitatType}
                shape={habitatShape}
                onTypeChange={setHabitatType}
                onShapeChange={setHabitatShape}
              />
            )}
            {currentStep === 4 && (
              <DimensionsStep
                shape={habitatShape}
                vehicle={launchVehicle}
                habitatType={habitatType}
                dimensions={dimensions}
                onDimensionsChange={setDimensions}
              />
            )}
            {currentStep === 5 && (
              <SummaryStep
                destination={destination}
                crewSize={crewSize}
                duration={duration}
                launchVehicle={launchVehicle}
                habitatType={habitatType}
                habitatShape={habitatShape}
                dimensions={dimensions}
              />
            )}
          </div>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="border-blue-500/30 text-white hover:bg-blue-500/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex gap-2">
            {onSkip && currentStep === 0 && (
              <Button
                variant="ghost"
                onClick={onSkip}
                className="text-blue-300 hover:bg-blue-500/10"
              >
                Skip Tutorial
              </Button>
            )}
          </div>

          <Button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {currentStep === steps.length - 1 ? (
              <>
                Start Designing
                <Check className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Skip Link */}
        {currentStep > 0 && onSkip && (
          <div className="text-center mt-4">
            <button
              onClick={onSkip}
              className="text-sm text-blue-300/60 hover:text-blue-300 transition-colors"
            >
              Skip and use default configuration
            </button>
          </div>
        )}
      </div>
    </div>
  )
}