"use client"

import { useContext, useEffect, useState } from "react"
import { EditableCanvas } from "@/components/editable-canvas/editable-canvas"
import { Toolbar } from "@/components/toolbar/toolbar"
import { EditorContext } from "@/contexts/editor-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit3, Eye, Download, Loader2, Settings, Users, Calendar, Globe } from "lucide-react"
import { useCanvasCapture } from "@/hooks/use-canvas-capture"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function DesignerPage() {
  const context = useContext(EditorContext)
  const { downloadAsImage } = useCanvasCapture()
  const { toast } = useToast()
  const router = useRouter()
  const [isExporting, setIsExporting] = useState(false)
  const [stars, setStars] = useState<Array<{ id: number; left: number; top: number; size: number; delay: number }>>([])
  const [missionConfig, setMissionConfig] = useState<any>(null)

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

    // Load mission config from localStorage
    const savedConfig = localStorage.getItem('missionConfig')
    if (savedConfig) {
      setMissionConfig(JSON.parse(savedConfig))
    }
  }, [])

  if (!context) return null

  const { isEditMode, setIsEditMode } = context

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await downloadAsImage()
      toast({
        title: "¡Éxito!",
        description: "Tu diseño ha sido exportado como PNG.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo exportar la imagen. Intenta de nuevo.",
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
      <header className="relative z-10 flex-shrink-0 border-b border-white/10 bg-slate-900/50 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white">Habitat Designer</h1>

            {missionConfig && (
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="border-blue-400 text-blue-300">
                  <Users className="w-3 h-3 mr-1" />
                  {missionConfig.crewSize} crew
                </Badge>
                <Badge variant="outline" className="border-purple-400 text-purple-300">
                  <Calendar className="w-3 h-3 mr-1" />
                  {missionConfig.durationDays} días
                </Badge>
                <Badge variant="outline" className="border-green-400 text-green-300">
                  <Globe className="w-3 h-3 mr-1" />
                  {missionConfig.destination.replace('-', ' ')}
                </Badge>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/start')}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              Reconfigurar
            </Button>
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
