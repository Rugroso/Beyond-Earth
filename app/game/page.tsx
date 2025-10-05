"use client"

import { useContext, useEffect, useRef, useState } from "react"
import { EditableCanvas } from "@/components/editable-canvas/editable-canvas"
import { Toolbar } from "@/components/toolbar/toolbar"
import { EditorContext } from "@/contexts/editor-context"
import { Button } from "@/components/ui/button"
import { EditControls } from "@/components/edit-controls"
import { Edit3, Eye, Download, Loader2 } from "lucide-react"
import { useCanvasCapture } from "@/hooks/use-canvas-capture"
import { useToast } from "@/hooks/use-toast"
import { Howl } from "howler"

export default function GamePage() {
  const context = useContext(EditorContext)
  const { downloadAsImage } = useCanvasCapture()
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)
  const [stars, setStars] = useState<Array<{ id: number; left: number; top: number; size: number; delay: number }>>([])
  const backgroundMusicRef = useRef<Howl | null>(null)

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

    // Initialize Howler background music
    backgroundMusicRef.current = new Howl({
      src: ['/music/azzezi-nebula-view.wav'],
      loop: true,
      volume: 0.7,
      autoplay: true,
      onload: () => {
        console.log('Background music loaded')
      }
    })

    return () => {
      // Cleanup Howler instance
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.unload()
      }
    }
  }, [])

  if (!context) return null

  const { isEditMode, setIsEditMode } = context

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await downloadAsImage()
      toast({
        title: "Success!",
        description: "Your design has been exported as PNG.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

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
            {isEditMode ? "Editando" : "Vista previa"}
          </h1>
          <div className="flex items-center gap-2">
            {/* Edit Controls - Solo visible cuando hay selección */}
            <EditControls />
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={isExporting}
              className="gap-2"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Export
            </Button>
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
