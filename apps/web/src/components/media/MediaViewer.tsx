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
  const [isOverlay, setIsOverlay] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  // Overlay modal for fullscreen photo/video viewing
  if (isOverlay) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8">
        <div className="relative w-full max-w-6xl">
          {/* Close button */}
          <Button
            size="sm"
            variant="ghost"
            className="absolute -top-12 right-0 text-white hover:bg-white/20"
            onClick={() => setIsOverlay(false)}
          >
            <X className="h-5 w-5 mr-2" />
            Close
          </Button>

          {/* Media content */}
          <div className="bg-slate-900 rounded-xl overflow-hidden">
            {type === "video" ? (
              <div className="aspect-video bg-slate-900 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-[#E07A47] flex items-center justify-center mx-auto mb-4">
                      <Play className="h-12 w-12 text-white ml-1" />
                    </div>
                    <p className="text-white font-bold text-2xl mb-2">{title || "Demo Video"}</p>
                    <p className="text-slate-400">{description || "Click to play"}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-slate-800 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <p className="font-bold text-xl">{title || "Property Image"}</p>
                    <p>{description || "Visual content here"}</p>
                  </div>
                </div>
              </div>
            )}
            {(title || description) && (
              <div className="p-6 bg-slate-800">
                {title && <h3 className="font-bold text-white text-lg mb-2">{title}</h3>}
                {description && <p className="text-slate-300">{description}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (type === "video") {
    return (
      <Card className="border-4 border-[#56CCF2] cursor-pointer hover:shadow-xl transition-all" onClick={() => setIsOverlay(true)}>
        <CardContent className="p-0 relative group">
          <div className="aspect-video bg-slate-900 relative overflow-hidden rounded-t-lg">
            {/* Video Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-[#E07A47] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Play className="h-10 w-10 text-white ml-1" />
                </div>
                <p className="text-white font-bold text-lg">{title || "Demo Video"}</p>
                <p className="text-slate-400 text-sm">{description || "Click to play"}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); setIsOverlay(true); }}>
                <Play className="h-4 w-4 mr-2" />
                Play Demo
              </Button>
              <Button size="sm" variant="ghost" className="ml-auto" onClick={(e) => { e.stopPropagation(); setIsOverlay(true); }}>
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
    <Card className="border-4 border-[#56CCF2] cursor-pointer hover:shadow-xl transition-all" onClick={() => setIsOverlay(true)}>
      <CardContent className="p-0">
        <div className="aspect-video bg-slate-200 dark:bg-slate-800 relative overflow-hidden rounded-t-lg group">
          {/* Image Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-slate-400">
              <p className="font-bold">{title || "Property Image"}</p>
              <p className="text-sm">{description || "Visual content here"}</p>
            </div>
          </div>
          {/* Expand icon on hover */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-[#56CCF2] flex items-center justify-center">
              <Maximize2 className="h-5 w-5 text-white" />
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
