"use client"

import { useContext, useState } from "react"
import { EditorContext } from "@/contexts/editor-context"
import { ToolbarItem } from "./toolbar-item"
import { Button } from "@/components/ui/button"
import { Download, Share2, Loader2 } from "lucide-react"
import { useCanvasCapture } from "@/hooks/use-canvas-capture"
import { useToast } from "@/hooks/use-toast"

export function Toolbar() {
  const context = useContext(EditorContext)
  const { downloadAsImage, shareImage } = useCanvasCapture()
  const { toast } = useToast()
  const [isDownloading, setIsDownloading] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  if (!context) return null

  const { availableItems } = context

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      await downloadAsImage()
      toast({
        title: "Success!",
        description: "Your design has been downloaded as PNG.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleShare = async () => {
    setIsSharing(true)
    try {
      const shared = await shareImage()
      if (shared) {
        toast({
          title: "Shared!",
          description: "Your design has been shared successfully.",
        })
      } else {
        toast({
          title: "Downloaded!",
          description: "Share not available. Image downloaded instead.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div className="border-t border-border bg-muted/30 p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">Drag the elements on your base</p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading}
            className="gap-2"
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Download PNG
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            disabled={isSharing}
            className="gap-2"
          >
            {isSharing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Share2 className="h-4 w-4" />
            )}
            Share
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        {availableItems.map((item) => (
          <ToolbarItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
