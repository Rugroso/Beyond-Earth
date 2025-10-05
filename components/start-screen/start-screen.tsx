"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Earth3D } from "@/components/earth-3d"
import { Howl } from "howler"

export function StartScreen() {
  const router = useRouter()
  const [stars, setStars] = useState<Array<{ id: number; left: number; top: number; size: number; delay: number }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [earthLoaded, setEarthLoaded] = useState(false)
  const backgroundMusicRef = useRef<Howl | null>(null)
  const hoverSoundRef = useRef<Howl | null>(null)

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

    // Initialize Howler sounds
    backgroundMusicRef.current = new Howl({
      src: ['/music/deep-sea.wav'],
      loop: true,
      volume: 0.4,
      onload: () => {
        console.log('Background music loaded')
      }
    })

    hoverSoundRef.current = new Howl({
      src: ['/sounds/button.mp3'],
      volume: 1.0,
      preload: true
    })

    // Fixed loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    
    return () => {
      clearTimeout(timer)
      // Cleanup Howler instances
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.unload()
      }
      if (hoverSoundRef.current) {
        hoverSoundRef.current.unload()
      }
    }
  }, [])

  useEffect(() => {
    // Play music when loading finishes
    if (!isLoading && backgroundMusicRef.current) {
      // Seek to 10 seconds
      backgroundMusicRef.current.seek(10)
      backgroundMusicRef.current.play()
    }
  }, [isLoading])

  const handleEarthLoaded = () => {
    setEarthLoaded(true)
  }

  const playHoverSound = () => {
    if (hoverSoundRef.current) {
      hoverSoundRef.current.play()
    }
  }

  const handleStart = (route: string) => {
    router.push(route)
  }

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900">
      <div className="absolute inset-0">
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
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-transparent to-transparent opacity-50"></div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="relative z-20 flex items-center justify-center">
          <div className="spinner"></div>
        </div>
      )}

      {/* Content */}
      {!isLoading && (
        <div className="flex flex-row animate-fade-in-content">
        <div className="animate-earth-from-left flex items-center justify-center -ml-300">
            <Earth3D onLoaded={handleEarthLoaded} />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center px-4 gap-2 ml-32">
          <div className="text-center space-y-2">
            <h1 className="text-6xl font-bold text-white tracking-wider">
              BEYOND EARTH
            </h1>
            <p className="text-xl text-blue-200/80">
              Embark on your cosmic journey
            </p>
          </div>
          <Button
            onClick={() => handleStart("/start")}
            onMouseEnter={playHoverSound}
            size="lg"
            className="animate-pulse-glow bg-gradient-to-r bg-black hover:bg-white text-white hover:text-black font-semibold text-lg px-12 py-6 mt-4 rounded-full shadow-2xl shadow-blue-500/50 transition-all duration-300 hover:scale-110 hover:shadow-blue-400/70 w-66"
          >
            START MISSION
          </Button>

        <Button
            onClick={() => handleStart("/asset-creator")}
            onMouseEnter={playHoverSound}
            size="lg"
            className="animate-pulse-glow bg-gradient-to-r bg-black hover:bg-white text-white hover:text-black font-semibold text-lg px-12 py-6 mt-1 rounded-full shadow-2xl shadow-blue-500/50 transition-all duration-300 hover:scale-110 hover:shadow-blue-400/70 w-66"
        >
            CREATE YOUR OWN ASSET
        </Button>

        <Button
            onClick={() => handleStart("/resources")}
            onMouseEnter={playHoverSound}
            size="lg"
            className="animate-pulse-glow bg-gradient-to-r bg-black hover:bg-white text-white hover:text-black font-semibold text-lg px-12 py-6 mt-1 rounded-full shadow-2xl shadow-blue-500/50 transition-all duration-300 hover:scale-110 hover:shadow-blue-400/70 w-66"
        >
            SEE RESOURCES
        </Button>

        <Button
            onClick={() => handleStart("/minigames")}
            onMouseEnter={playHoverSound}
            size="lg"
            className="animate-pulse-glow bg-gradient-to-r bg-black hover:bg-white text-white hover:text-black font-semibold text-lg px-12 py-6 mt-1 rounded-full shadow-2xl shadow-blue-500/50 transition-all duration-300 hover:scale-110 hover:shadow-blue-400/70 w-66"
        >
            MINIGAMES
        </Button>
        </div>
        </div>

      )}

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes fade-in-content {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .spinner {
          width: 60px;
          height: 60px;
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-top: 4px solid #ffffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
        }

        .animate-fade-in-content {
          animation: fade-in-content 0.8s ease-out forwards;
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
          }
          50% {
            box-shadow: 0 0 50px rgba(147, 51, 234, 0.8);
          }
        }

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

        .animate-pulse-glow {
          animation: pulse-glow 1.5s ease-in-out infinite;
        }

        .animate-earth-from-left {
          animation: earth-from-left 2s ease-out forwards;
        }

        @keyframes earth-from-left {
          from {
            opacity: 0;
            transform: translateX(-1000px);
          }
          to {
            opacity: 1;
            transform: translateX(0px);
          }
        }  

        /* Individual stars */
        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          pointer-events: none;
          animation: twinkle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
