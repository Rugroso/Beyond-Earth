"use client"

import { MissionWizard } from "@/components/habitat/wizard/mission-wizard"
import type { MissionConfigWizard, HabitatConfig } from "@/types"
import { useRouter } from "next/navigation"

export function StepFour() {
  const router = useRouter()

  const handleComplete = (mission: MissionConfigWizard, habitat: HabitatConfig) => {
    // Save configuration to localStorage
    const config = {
      crewSize: mission.crewSize,
      durationDays: mission.durationDays,
      destination: mission.destination,
      habitatType: habitat.type,
      launchVehicle: mission.launchVehicle,
      shape: habitat.shape,
      dimensions: habitat.dimensions,
      volume: habitat.volume,
      levels: habitat.levels
    }

    localStorage.setItem('missionConfig', JSON.stringify(config))

    // Navigate to designer
    router.push('/designer')
  }

  return (
    <div className="w-full h-full">
      <MissionWizard onComplete={handleComplete} />
    </div>
  )
}
