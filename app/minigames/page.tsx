"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useEffect, useRef } from "react"
import { Howl } from "howler"

export default function MinigamesPage() {
  const router = useRouter()
  const backgroundMusicRef = useRef<Howl | null>(null)
  const hoverSoundRef = useRef<Howl | null>(null)

  const playHoverSound = () => {
    if (hoverSoundRef.current) {
      hoverSoundRef.current.stop()
      hoverSoundRef.current.play()
    }
  }

  useEffect(() => {
    // Initialize hover sound effect
    hoverSoundRef.current = new Howl({
      src: ['/sounds/button.mp3'],
      volume: 1.0,
    })

    // Initialize Howler background music
    backgroundMusicRef.current = new Howl({
      src: ['/music/the-signal.wav'],
      loop: true,
      volume: 0,
      autoplay: true,
      onload: () => {
        console.log('Minigames music loaded')
        // Seek to 168 seconds when loaded
        if (backgroundMusicRef.current) {
          backgroundMusicRef.current.seek(168)
        }
      },
      onplay: () => {
        // Fade in from 0 to 0.2 over 0 seconds
        if (backgroundMusicRef.current) {
          backgroundMusicRef.current.fade(0, 0.2, 0)
        }
      },
      onend: () => {
        // When the song ends, seek back to 168 seconds before looping
        if (backgroundMusicRef.current) {
          backgroundMusicRef.current.seek(168)
        }
      }
    })

    return () => {
      // Cleanup Howler instances
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.unload()
      }
      if (hoverSoundRef.current) {
        hoverSoundRef.current.unload()
      }
    }
  }, [])

  const minigames = [
    {
      id: "meteor-dodger",
      title: "Esquiva Meteoros",
      description: "Controla tu nave y esquiva los meteoros que caen del espacio",
      image_path: "/images/cohete_asteroides.png",
      path: "/minigames/meteor-dodger"
    },
    {
      id: "cosmic-leaper",
      title: "Salto Cósmico",
      description: "Salta de plataforma en plataforma para alcanzar el infinito.",
      image_path: "/images/cohete_espacial.png",
      path: "/minigames/cosmic-leaper"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
      {/* Starfield Background */}
      <div className="absolute inset-0 z-0">
        {Array.from({ length: 150 }).map((_, i) => {
          const style = {
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${Math.random() * 3 + 2}s`,
          }
          return (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-pulse"
              style={style}
            />
          )
        })}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">Minijuegos</h1>
            <p className="text-xl text-gray-300">Diviértete mientras exploras el espacio</p>
          </div>

          {/* Back Button */}
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="mb-8 border-white/30 text-black hover:bg-white/10"
          >
            ← Volver al inicio
          </Button>

          {/* Minigames Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {minigames.map((game) => (
              <div
                key={game.id}
                className="bg-slate-900/80 backdrop-blur-sm border-2 border-white/20 rounded-lg p-6 hover:border-blue-400 transition-all hover:scale-105 cursor-pointer"
                onClick={() => router.push(game.path)}
                onMouseEnter={playHoverSound}
              >
                <div className="flex justify-center">
                  <img src={game.image_path} alt={game.title} width={80} className="text-center" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 text-center">{game.title}</h2>
                <p className="text-gray-300 text-center mb-4">{game.description}</p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Jugar Ahora
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
