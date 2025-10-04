"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function StartScreen() {
  const router = useRouter()
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

  const handleStart = () => {
    router.push("/game")
  }

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900">
      {/* Animated stars background */}
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

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4">
        {/* Logo */}
        <div className="animate-zoom-in">
          <Image
            src="/beyond-earth.png"
            alt="Beyond Earth Logo"
            width={600}
            height={600}
            className="drop-shadow-2xl"
            priority
          />
        </div>

        {/* Title */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-white tracking-wider animate-fade-in">
            BEYOND EARTH
          </h1>
          <p className="text-xl text-blue-200/80 animate-fade-in-delay">
            Embark on your cosmic journey
          </p>
        </div>

        {/* Start Button */}
        <Button
          onClick={handleStart}
          size="lg"
          className="animate-pulse-glow bg-gradient-to-r bg-black hover:bg-white text-white hover:text-black font-semibold text-lg px-12 py-6 mt-4 rounded-full shadow-2xl shadow-blue-500/50 transition-all duration-300 hover:scale-110 hover:shadow-blue-400/70"
        >
          START MISSION
        </Button>

      </div>

      <style jsx>{`
        @keyframes zoom-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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

        @keyframes bounce-fast {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          50% {
            transform: translateX(-50%) translateY(-10px);
          }
        }

        .animate-zoom-in {
          animation: zoom-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out 0.5s forwards;
          opacity: 0;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.6s ease-out 0.7s forwards;
          opacity: 0;
        }

        .animate-pulse-glow {
          animation: pulse-glow 1.5s ease-in-out infinite;
        }

        .animate-bounce-fast {
          animation: bounce-fast 1s ease-in-out infinite;
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
