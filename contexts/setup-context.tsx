"use client"

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { SetupConfig, LayoutConstraints } from '@/types/setup'
import { generateConstraints } from '@/utils/constraints-generator'

interface SetupContextType {
  setup: SetupConfig
  updateSetup: (updates: Partial<SetupConfig>) => void
  constraints: LayoutConstraints | null
  generateLayoutConstraints: () => LayoutConstraints
  isSetupComplete: () => boolean
  resetSetup: () => void
}

const SetupContext = createContext<SetupContextType | null>(null)

const INITIAL_SETUP: SetupConfig = {
  destination: null,
  duration: null,
  crewSize: null,
  canvasSize: null
}

export function SetupProvider({ children }: { children: ReactNode }) {
  const [setup, setSetup] = useState<SetupConfig>(INITIAL_SETUP)
  const [constraints, setConstraints] = useState<LayoutConstraints | null>(null)

  const updateSetup = (updates: Partial<SetupConfig>) => {
    console.log('Updating setup with:', updates)
    setSetup(prev => {
      const newSetup = { ...prev, ...updates }
      console.log('New setup:', newSetup)
      return newSetup
    })
  }

  const isSetupComplete = () => {
    const complete = !!(setup.destination && setup.duration && setup.crewSize && setup.canvasSize)
    console.log('isSetupComplete:', complete, setup)
    return complete
  }

  const generateLayoutConstraints = () => {
    console.log('generateLayoutConstraints called with setup:', setup)
    
    if (!isSetupComplete()) {
      console.error('Setup incompleto:', setup)
      throw new Error('El setup debe estar completo antes de generar constraints')
    }
    
    try {
      const newConstraints = generateConstraints(setup)
      console.log('Constraints generados:', newConstraints)
      setConstraints(newConstraints)
      return newConstraints
    } catch (error) {
      console.error('Error generando constraints:', error)
      throw error
    }
  }

  const resetSetup = () => {
    console.log('Resetting setup')
    setSetup(INITIAL_SETUP)
    setConstraints(null)
  }

  const value = {
    setup,
    updateSetup,
    constraints,
    generateLayoutConstraints,
    isSetupComplete,
    resetSetup
  }

  console.log('SetupProvider rendering with value:', value)

  return (
    <SetupContext.Provider value={value}>
      {children}
    </SetupContext.Provider>
  )
}

export function useSetup() {
  const context = useContext(SetupContext)
  if (!context) {
    throw new Error('useSetup debe usarse dentro de SetupProvider')
  }
  return context
}