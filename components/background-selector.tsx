"use client"

import { useContext } from "react"
import { EditorContext } from "@/contexts/editor-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Image, Check } from "lucide-react"

const BACKGROUND_OPTIONS = [
  { id: "bg-1", name: "Background 1", path: "/images/bg-1.png" },
  { id: "bg-2", name: "Background 2", path: "/images/bg-2.png" },
  { id: "bg-3", name: "Background 3", path: "/images/bg-3.png" },
]

export function BackgroundSelector() {
  const context = useContext(EditorContext)

  if (!context) return null

  const { backgroundImage, setBackgroundImage } = context

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200"
        >
          <Image className="w-4 h-4" />
          <span className="hidden sm:inline">Background</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {BACKGROUND_OPTIONS.map((bg) => (
          <DropdownMenuItem
            key={bg.id}
            onClick={() => setBackgroundImage(bg.path)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span>{bg.name}</span>
            {backgroundImage === bg.path && (
              <Check className="w-4 h-4 text-green-500" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
