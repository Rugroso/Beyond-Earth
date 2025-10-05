"use client"

import { useContext, useEffect, useState } from "react"
import { EditableCanvas } from "@/components/editable-canvas/editable-canvas"
import { Toolbar } from "@/components/toolbar/toolbar"
import { EditorContext } from "@/contexts/editor-context"
import { Button } from "@/components/ui/button"
import { Edit3, Eye } from "lucide-react"

export default function GamePage() {
  const context = useContext(EditorContext)
  const [stars, setStars] = useState<Array<{ id: number; left: number; top: number; size: number; delay: number }>>([])

  useEffect(() => {
    // Generate random stars
    const generatedStars = Array.from({ length: 150 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 3,
    }))
    setStars(generatedStars)
  }, [])

  if (!context) return null

  const { isEditMode, setIsEditMode } = context

  return (
    <div className="relative flex h-screen flex-col bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900">
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Nebula effect */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>

      {/* Navigation Bar */}
      <header className="relative z-10 flex-shrink-0 border-b border-white/10 bg-slate-900/50 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-medium text-white">
            {isEditMode ? "Editing" : "Preview"}
          </h1>
          <Button
            variant={isEditMode ? "default" : "secondary"}
            size="sm"
            onClick={() => setIsEditMode(!isEditMode)}
            className="gap-2"
          >
            {isEditMode ? (
              <>
                <Eye className="h-4 w-4" />
                Preview
              </>
            ) : (
              <>
                <Edit3 className="h-4 w-4" />
                Edit
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Main Content Area - Canvas takes all available space */}
      <div className="relative z-10 flex-1 min-h-0">
        <EditableCanvas />
      </div>

      {/* Toolbar at bottom - only visible in EDIT mode */}
      {isEditMode && (
        <div className="relative z-10 flex-shrink-0">
          <Toolbar />
        </div>
      )}

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }

        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          animation: twinkle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
