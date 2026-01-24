"use client"

import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MediaOverlayProps {
  isOpen: boolean
  onClose: () => void
  type: "image" | "video" | "document"
  src: string
  title?: string
  items?: Array<{ src: string; type: string }>
  currentIndex?: number
}

export function MediaOverlay({ 
  isOpen, 
  onClose, 
  type, 
  src, 
  title,
  items = [],
  currentIndex = 0
}: MediaOverlayProps) {
  const [index, setIndex] = useState(currentIndex)
  const [zoom, setZoom] = useState(1)
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const handlePrevious = () => {
    if (items.length > 0) {
      setIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1))
      setZoom(1)
    }
  }

  const handleNext = () => {
    if (items.length > 0) {
      setIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0))
      setZoom(1)
    }
  }

  const currentSrc = items.length > 0 ? items[index].src : src
  const currentType = items.length > 0 ? items[index].type : type

  return (
    <>
      {/* Backdrop with visible background */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Media Container - Elevated */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-8 pointer-events-none">
        <div className="relative max-w-7xl max-h-full w-full pointer-events-auto">
          {/* Close Button - Circular */}
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 w-12 h-12 shape-circle bg-realco-orange hover:bg-realco-orange/90 text-white shadow-2xl flex items-center justify-center z-10 transition-transform hover:scale-110"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Navigation Arrows - Circular (if gallery) */}
          {items.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 shape-circle bg-realco-blue hover:bg-realco-blue/90 text-white shadow-xl flex items-center justify-center transition-transform hover:scale-110"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 shape-circle bg-realco-blue hover:bg-realco-blue/90 text-white shadow-xl flex items-center justify-center transition-transform hover:scale-110"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Media Content - Oval Container */}
          <div className="shape-oval-lg bg-white dark:bg-realco-gray shadow-2xl overflow-hidden">
            {/* Header */}
            {title && (
              <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 bg-gradient-to-r from-realco-blue/10 to-realco-orange/10">
                <h3 className="font-bold text-lg">{title}</h3>
                {items.length > 1 && (
                  <p className="text-sm text-muted-foreground">
                    {index + 1} of {items.length}
                  </p>
                )}
              </div>
            )}

            {/* Media Display */}
            <div className="relative bg-black/5 dark:bg-black/20 flex items-center justify-center" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              {currentType === 'image' && (
                <div className="relative overflow-auto max-w-full max-h-full p-4">
                  <img
                    src={currentSrc}
                    alt={title || 'Property image'}
                    className="shape-oval max-w-full max-h-full object-contain"
                    style={{ transform: `scale(${zoom})` }}
                  />
                </div>
              )}

              {currentType === 'video' && (
                <div className="w-full p-4">
                  <video
                    src={currentSrc}
                    controls
                    className="shape-oval w-full max-h-[70vh]"
                  >
                    Your browser does not support video playback.
                  </video>
                </div>
              )}

              {currentType === 'document' && (
                <div className="w-full h-full p-4">
                  <iframe
                    src={currentSrc}
                    className="shape-oval w-full h-full min-h-[600px]"
                    title={title || 'Document'}
                  />
                </div>
              )}
            </div>

            {/* Controls - Circular Buttons */}
            {currentType === 'image' && (
              <div className="px-6 py-4 border-t border-gray-200 dark:border-white/10 flex items-center justify-between bg-gradient-to-r from-realco-blue/5 to-realco-orange/5">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                    className="shape-circle w-10 h-10 p-0"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium px-3">{Math.round(zoom * 100)}%</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setZoom(Math.min(3, zoom + 0.25))}
                    className="shape-circle w-10 h-10 p-0"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  size="sm"
                  className="shape-oval bg-realco-orange hover:bg-realco-orange/90 text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
