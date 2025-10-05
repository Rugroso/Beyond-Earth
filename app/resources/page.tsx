"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"
import { Howl } from "howler"
import { ExternalLink, FileText, Video, Image, Link as LinkIcon, Music, Play } from "lucide-react"

interface Resource {
  id: string
  title: string
  description: string
  type: "document" | "video" | "image" | "link" | "info" | "music"
  url?: string
  musicPath?: string
  category: string
}

export default function ResourcesPage() {
  const router = useRouter()
  const backgroundMusicRef = useRef<Howl | null>(null)
  const buttonSoundRef = useRef<Howl | null>(null)
  const hoverSoundRef = useRef<Howl | null>(null)
  const [stars, setStars] = useState<Array<{ id: number; left: number; top: number; size: number; delay: number }>>([])
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null)

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
      volume: 0.1,
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
          backgroundMusicRef.current.fade(0, 0.3, 2000)
        }
      },
      onend: () => {
        if (backgroundMusicRef.current) {
          backgroundMusicRef.current.seek(168)
        }
      }
    })

    setCurrentPlaying("6")

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
      title: "Defining the Net Habitable Volume for Long Duration Exploration Missions",
      description: "C. Stromgren, C. Burke, J. Cho, R. Calderon, M. Rucker: Information on understanding volumetric requirements for crews in space habitats",
      type: "document",
      url: "https://ntrs.nasa.gov/api/citations/20200002973/downloads/20200002973.pdf",
      category: "Documentation"
    },
    {
      id: "8",
      title: "Habitats and Surface Construction Technology and Development Roadmap",
      description: "M. Cohen and K. Kennedy: Information on different options for space habitat design and a taxonomy for space habitat classification.",
      type: "document",
      url: "https://spacearchitect.org/pubs/NASA-CP-97-206241-Cohen.pdf",
      category: "Documentation"
    },
    {
      id: "9",
      title: "A Tool for Automated Design and Evaluation of Habitat Interior Layouts",
      description: "M. Simon and A. Wilhite. Proceedings of AIAA SPACE 2013: Example of an interior design evaluation method for space habitats.",
      type: "document",
      url: "https://ntrs.nasa.gov/api/citations/20140002738/downloads/20140002738.pdf",
      category: "Documentation"
    },
    {
      id: "7",
      title: "Assets",
      description: "By Tilin Coding 2",
      type: "link",
      url: "https://drive.google.com/drive/folders/1280Zgb425-x12PHiyvnskU92G-zbnqfg?usp=sharing",
      category: "Our Work"
    },
    {
      id: "2",
      title: "Arrival",
      description: "By Enzo Gianola",
      type: "music",
      musicPath: "/music/arrival.wav",
      category: "Music"
    },
    {
      id: "3",
      title: "Azzézì Nebula View",
      description: "By Thomas Van Den Bos",
      type: "music",
      musicPath: "/music/azzezi-nebula-view.wav",
      category: "Music"
    },
    {
      id: "4",
      title: "Deep Sea",
      description: "By Enzo Gianola",
      type: "music",
      musicPath: "/music/deep-sea.wav",
      category: "Music"
    },
    {
      id: "5",
      title: "Orbit",
      description: "By Enzo Gianola",
      type: "music",
      musicPath: "/music/orbit.wav",
      category: "Music"
    },
    {
      id: "6",
      title: "The Signal",
      description: "By Enzo Gianola",
      type: "music",
      musicPath: "/music/the-signal.wav",
      category: "Music"
    },

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
      case "info":
        return <FileText className="h-5 w-5" />
      case "music":
        return <Music className="h-5 w-5" />
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

  const handleMusicClick = (resource: Resource) => {
    if (resource.type !== "music" || !resource.musicPath) return

    if (buttonSoundRef.current) {
      buttonSoundRef.current.play()
    }

    // Si ya está sonando esta canción, no hacer nada
    if (currentPlaying === resource.id) return

    // Detener la música actual y cargar la nueva
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.fade(0.3, 0, 500)
      setTimeout(() => {
        if (backgroundMusicRef.current) {
          backgroundMusicRef.current.unload()
        }

        // Cargar nueva música
        backgroundMusicRef.current = new Howl({
          src: [resource.musicPath!],
          loop: true,
          volume: 0,
          autoplay: true,
          onplay: () => {
            if (backgroundMusicRef.current) {
              backgroundMusicRef.current.fade(0, 0.3, 2000)
            }
          }
        })

        setCurrentPlaying(resource.id)
      }, 500)
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
            <h1 className="text-5xl font-bold text-white mb-4">Resources</h1>
            <p className="text-xl text-gray-300">
              Educational material and references
            </p>
          </div>

          {/* Back Button */}
          <Button
            onClick={handleBackClick}
            onMouseEnter={handleResourceHover}
            variant="outline"
            className="mb-8 border-white/30 text-black hover:bg-white/10"
          >
            ← Back to Home
          </Button>

          {/* Resources by Category */}
          <div className="space-y-8">
            {categories.map((category) => (
              <div key={category}>
                <h2 className="text-2xl font-bold text-white mb-4">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resources
                    .filter((r) => r.category === category)
                    .map((resource) => {
                      const isClickable = resource.type !== "info" && resource.type !== "music" && resource.url
                      const isMusic = resource.type === "music"
                      const Component = isClickable ? "a" : "div"
                      const isCurrentlyPlaying = currentPlaying === resource.id
                      
                      return (
                        <Component
                          key={resource.id}
                          {...(isClickable ? {
                            href: resource.url,
                            target: "_blank",
                            rel: "noopener noreferrer"
                          } : {})}
                          {...(isMusic ? {
                            onClick: () => handleMusicClick(resource)
                          } : {})}
                          onMouseEnter={handleResourceHover}
                          className={`group bg-slate-900/80 backdrop-blur-sm border-2 ${isCurrentlyPlaying ? 'border-green-400' : 'border-white/20'} rounded-lg p-6 hover:border-blue-400 transition-all hover:scale-105 cursor-pointer`}
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className={`${isCurrentlyPlaying ? 'text-green-400' : 'text-blue-400'} mt-1`}>
                              {getIcon(resource.type)}
                            </div>
                            <div className="flex-1">
                              <h3 className={`text-lg font-semibold ${isCurrentlyPlaying ? 'text-green-400' : 'text-white'} mb-2 group-hover:text-blue-400 transition-colors`}>
                                {resource.title}
                              </h3>
                              <p className="text-sm text-gray-400">
                                {resource.description}
                              </p>
                            </div>
                            {isClickable && (
                              <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                            )}
                            {isMusic && isCurrentlyPlaying && (
                              <div className="text-green-400">
                                <Play className="h-4 w-4 animate-pulse" fill="currentColor" />
                              </div>
                            )}
                          </div>
                        </Component>
                      )
                    })}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {resources.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold text-white mb-2">
                Resources coming soon
              </h3>
              <p className="text-gray-400">
                We are preparing incredible educational material about space habitats
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
