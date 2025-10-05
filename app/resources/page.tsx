"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"
import { Howl } from "howler"
import { ExternalLink, FileText, Video, Image, Link as LinkIcon } from "lucide-react"

interface Resource {
  id: string
  title: string
  description: string
  type: "document" | "video" | "image" | "link"
  url: string
  category: string
}

export default function ResourcesPage() {
  const router = useRouter()
  const backgroundMusicRef = useRef<Howl | null>(null)
  const buttonSoundRef = useRef<Howl | null>(null)
  const hoverSoundRef = useRef<Howl | null>(null)
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

    // Initialize button sound
    buttonSoundRef.current = new Howl({
      src: ['/sounds/button.mp3'],
      volume: 0.3,
    })

    // Initialize hover sound
    hoverSoundRef.current = new Howl({
      src: ['/sounds/button.mp3'],
      volume: 1.0,
    })

    // Initialize background music
    backgroundMusicRef.current = new Howl({
      src: ['/music/the-signal.wav'],
      loop: true,
      volume: 0,
      autoplay: true,
      onload: () => {
        if (backgroundMusicRef.current) {
          backgroundMusicRef.current.seek(168)
        }
      },
      onplay: () => {
        if (backgroundMusicRef.current) {
          backgroundMusicRef.current.fade(0, 0.3, 0)
        }
      },
      onend: () => {
        if (backgroundMusicRef.current) {
          backgroundMusicRef.current.seek(168)
        }
      }
    })

    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.unload()
      }
    }
  }, [])

  // Aquí puedes agregar tus recursos
  const resources: Resource[] = [
    {
      id: "1",
      title: "NASA Space Habitat Design Guidelines",
      description: "Guía oficial de NASA sobre diseño de hábitats espaciales",
      type: "document",
      url: "#",
      category: "Documentación"
    },
    {
      id: "2",
      title: "Artemis Program Overview",
      description: "Información sobre el programa Artemis de NASA",
      type: "link",
      url: "#",
      category: "Música"
    },
        {
      id: "3",
      title: "Artemis Program Overview",
      description: "Información sobre el programa Artemis de NASA",
      type: "link",
      url: "#",
      category: "Música"
    },
    // Agrega más recursos aquí
  ]

  const getIcon = (type: Resource["type"]) => {
    switch (type) {
      case "document":
        return <FileText className="h-5 w-5" />
      case "video":
        return <Video className="h-5 w-5" />
      case "image":
        return <Image className="h-5 w-5" />
      case "link":
        return <LinkIcon className="h-5 w-5" />
    }
  }

  const categories = Array.from(new Set(resources.map(r => r.category)))

  const handleBackClick = () => {
    if (buttonSoundRef.current) {
      buttonSoundRef.current.play()
    }
    router.push("/")
  }

  const handleResourceHover = () => {
    if (hoverSoundRef.current) {
      hoverSoundRef.current.play()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star absolute bg-white rounded-full"
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
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/10 via-transparent to-transparent opacity-50 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">Recursos</h1>
            <p className="text-xl text-gray-300">
              Material educativo y referencias sobre hábitats espaciales
            </p>
          </div>

          {/* Back Button */}
          <Button
            onClick={handleBackClick}
            onMouseEnter={handleResourceHover}
            variant="outline"
            className="mb-8 border-white/30 text-black hover:bg-white/10"
          >
            ← Volver al inicio
          </Button>

          {/* Resources by Category */}
          <div className="space-y-8">
            {categories.map((category) => (
              <div key={category}>
                <h2 className="text-2xl font-bold text-white mb-4">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resources
                    .filter((r) => r.category === category)
                    .map((resource) => (
                      <a
                        key={resource.id}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseEnter={handleResourceHover}
                        className="group bg-slate-900/80 backdrop-blur-sm border-2 border-white/20 rounded-lg p-6 hover:border-blue-400 transition-all hover:scale-105 cursor-pointer"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="text-blue-400 mt-1">
                            {getIcon(resource.type)}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                              {resource.title}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {resource.description}
                            </p>
                          </div>
                          <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                        </div>
                      </a>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {resources.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold text-white mb-2">
                Recursos próximamente
              </h3>
              <p className="text-gray-400">
                Estamos preparando material educativo increíble sobre hábitats espaciales
              </p>
            </div>
          )}
        </div>
      </div>

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
          animation: twinkle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}