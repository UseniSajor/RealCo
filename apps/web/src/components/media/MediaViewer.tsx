"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, Maximize2, X } from "lucide-react"

interface MediaViewerProps {
  type: "image" | "video"
  src: string
  alt?: string
  title?: string
  description?: string
}

export function MediaViewer({ type, src, alt, title, description }: MediaViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  if (type === "video") {
    return (
      <Card className="border-4 border-[#56CCF2]">
        <CardContent className="p-0 relative group">
          <div className="aspect-video bg-slate-900 relative overflow-hidden rounded-t-lg">
            {/* Video Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-[#E07A47] flex items-center justify-center mx-auto mb-4">
                  <Play className="h-10 w-10 text-white ml-1" />
                </div>
                <p className="text-white font-bold text-lg">{title || "Demo Video"}</p>
                <p className="text-slate-400 text-sm">{description || "Click to play"}</p>
              </div>
            </div>
            
            {/* Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="sm" variant="secondary">
                <Play className="h-4 w-4 mr-2" />
                Play Demo
              </Button>
              <Button size="sm" variant="ghost" className="ml-auto">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {(title || description) && (
            <div className="p-4">
              {title && <h4 className="font-bold mb-1">{title}</h4>}
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-4 border-[#56CCF2]">
      <CardContent className="p-0">
        <div className="aspect-video bg-slate-200 dark:bg-slate-800 relative overflow-hidden rounded-t-lg">
          {/* Image Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-slate-400">
              <p className="font-bold">{title || "Property Image"}</p>
              <p className="text-sm">{description || "Visual content here"}</p>
            </div>
          </div>
        </div>
        {(title || description) && (
          <div className="p-4">
            {title && <h4 className="font-bold mb-1">{title}</h4>}
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function MediaGallery({ items }: { items: MediaViewerProps[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, i) => (
        <MediaViewer key={i} {...item} />
      ))}
    </div>
  )
}
