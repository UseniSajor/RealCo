"use client"

import { useState } from 'react'
import { MapPin, Building2 } from 'lucide-react'
import { config } from '@/lib/config'

export interface PropertyLocation {
  id: number
  name: string
  address: string
  latitude: number
  longitude: number
  price: number
  type: string
  matchScore?: number
}

interface PropertyMapProps {
  properties: PropertyLocation[]
  onPropertyClick?: (property: PropertyLocation) => void
  center?: { lat: number; lng: number }
  zoom?: number
}

/**
 * Property Map Component
 * 
 * PRODUCTION NOTE: This component uses a demo fallback by default.
 * To enable real Mapbox integration:
 * 1. Set NEXT_PUBLIC_MAPBOX_TOKEN in environment variables
 * 2. Install dependencies: pnpm add react-map-gl mapbox-gl
 * 3. Uncomment the dynamic import code below
 * 
 * For now, shows circular property pins in demo mode.
 */
export function PropertyMap({ 
  properties, 
  onPropertyClick,
  center = { lat: 37.0902, lng: -95.7129 },
  zoom = 4 
}: PropertyMapProps) {
  const [selectedProperty, setSelectedProperty] = useState<PropertyLocation | null>(null)

  const isMapEnabled = config.mapbox.enabled && config.mapbox.token

  // Demo mode / Fallback view
  return (
    <div className="w-full h-full bg-gradient-to-br from-realco-blue/10 to-realco-orange/10 flex items-center justify-center shape-oval-lg">
      <div className="text-center p-8">
        <div className="w-20 h-20 shape-circle bg-realco-blue/20 flex items-center justify-center mx-auto mb-4">
          <MapPin className="h-10 w-10 text-realco-blue" />
        </div>
        <h3 className="font-black text-2xl mb-2">
          {isMapEnabled ? 'Loading Interactive Map...' : 'Interactive Map View'}
        </h3>
        <p className="text-muted-foreground mb-4">
          {isMapEnabled 
            ? 'Map integration loading. Enable NEXT_PUBLIC_MAPBOX_TOKEN to view.'
            : 'Add Mapbox token to enable real map integration'}
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {properties.slice(0, 10).map((prop, idx) => (
            <button
              key={prop.id}
              onClick={() => {
                setSelectedProperty(prop)
                onPropertyClick?.(prop)
              }}
              className="relative group"
            >
              <div className="w-12 h-12 shape-circle bg-realco-orange text-white flex items-center justify-center font-bold shadow-lg hover:scale-110 transition-transform">
                {idx + 1}
              </div>
              {prop.matchScore && (
                <div className="absolute -top-1 -right-1 w-6 h-6 shape-circle bg-gradient-realco text-white text-xs font-bold flex items-center justify-center">
                  {prop.matchScore}
                </div>
              )}
              {/* Tooltip on hover */}
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-white dark:bg-realco-gray-dark shadow-2xl shape-oval px-4 py-2 min-w-[200px]">
                  <p className="font-bold text-sm mb-1">{prop.name}</p>
                  <p className="text-xs text-muted-foreground">{prop.address}</p>
                  <p className="text-xs font-bold text-realco-orange mt-1">
                    ${(prop.price / 1000000).toFixed(1)}M
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {selectedProperty && (
          <div className="mt-6 p-4 bg-white dark:bg-realco-gray-dark shape-oval-lg shadow-xl max-w-md mx-auto">
            <h4 className="font-black text-lg mb-2">{selectedProperty.name}</h4>
            <p className="text-sm text-muted-foreground mb-3">{selectedProperty.address}</p>
            <div className="flex items-center justify-between">
              <span className="font-bold text-realco-orange text-lg">
                ${(selectedProperty.price / 1000000).toFixed(1)}M
              </span>
              <span className="px-3 py-1 shape-circle bg-realco-blue text-white text-sm font-semibold">
                {selectedProperty.type}
              </span>
              {selectedProperty.matchScore && (
                <span className="px-3 py-1 shape-circle bg-gradient-realco text-white text-sm font-bold">
                  {selectedProperty.matchScore}% Match
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* 
 * PRODUCTION MAP IMPLEMENTATION (Uncomment when ready):
 * 
 * import dynamic from 'next/dynamic'
 * import 'mapbox-gl/dist/mapbox-gl.css'
 * 
 * const DynamicMap = dynamic(
 *   () => import('./PropertyMapReal'),
 *   { ssr: false, loading: () => <div>Loading map...</div> }
 * )
 * 
 * Then replace the return statement above with:
 * return <DynamicMap {...props} />
 */
