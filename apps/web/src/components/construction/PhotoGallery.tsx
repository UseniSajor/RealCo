"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Image as ImageIcon, 
  Calendar, 
  Upload,
  Download,
  Grid3x3,
  List,
  Search,
  Filter
} from "lucide-react"

export function PhotoGallery() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedPhase, setSelectedPhase] = useState<string>('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Mock photo data
  const photos = [
    {
      id: '1',
      title: '3rd Floor Framing Progress',
      phase: 'Framing & Structure',
      date: '2026-01-22',
      uploadedBy: 'John Smith',
      description: 'Completed framing on 3rd floor, west wing',
      tags: ['framing', 'progress', '3rd-floor'],
      thumbnail: '/api/placeholder/400/300',
    },
    {
      id: '2',
      title: 'HVAC Installation - Building A',
      phase: 'MEP',
      date: '2026-01-21',
      uploadedBy: 'XYZ Mechanical',
      description: 'HVAC unit installation on 1st floor',
      tags: ['hvac', 'mep', 'building-a'],
      thumbnail: '/api/placeholder/400/300',
    },
    {
      id: '3',
      title: 'Electrical Rough-In',
      phase: 'MEP',
      date: '2026-01-21',
      uploadedBy: 'Power Systems Inc',
      description: 'Electrical panel and conduit installation',
      tags: ['electrical', 'rough-in', 'mep'],
      thumbnail: '/api/placeholder/400/300',
    },
    {
      id: '4',
      title: 'Foundation Inspection Passed',
      phase: 'Foundation',
      date: '2025-06-28',
      uploadedBy: 'John Smith',
      description: 'City inspector approved foundation work',
      tags: ['foundation', 'inspection', 'milestone'],
      thumbnail: '/api/placeholder/400/300',
    },
    {
      id: '5',
      title: 'Site Clearing Complete',
      phase: 'Site Preparation',
      date: '2025-03-15',
      uploadedBy: 'John Smith',
      description: 'Final site clearing and grading',
      tags: ['site-prep', 'clearing', 'milestone'],
      thumbnail: '/api/placeholder/400/300',
    },
    {
      id: '6',
      title: 'Concrete Pour - Elevator Shaft',
      phase: 'Framing & Structure',
      date: '2026-01-22',
      uploadedBy: 'ABC Construction',
      description: 'Elevator shaft concrete pour',
      tags: ['concrete', 'elevator', 'structure'],
      thumbnail: '/api/placeholder/400/300',
    },
    {
      id: '7',
      title: 'Plumbing Rough-In - West Wing',
      phase: 'MEP',
      date: '2026-01-20',
      uploadedBy: 'Reliable Plumbing',
      description: 'PEX piping installation in west wing',
      tags: ['plumbing', 'rough-in', 'west-wing'],
      thumbnail: '/api/placeholder/400/300',
    },
    {
      id: '8',
      title: 'Steel Beam Installation',
      phase: 'Framing & Structure',
      date: '2026-01-18',
      uploadedBy: 'ABC Construction',
      description: 'Main structural steel beams installed',
      tags: ['steel', 'structure', 'beams'],
      thumbnail: '/api/placeholder/400/300',
    },
    {
      id: '9',
      title: 'Foundation Forms Set',
      phase: 'Foundation',
      date: '2025-04-20',
      uploadedBy: 'Foundation Experts',
      description: 'Formwork complete for foundation pour',
      tags: ['foundation', 'forms', 'prep'],
      thumbnail: '/api/placeholder/400/300',
    },
    {
      id: '10',
      title: 'Site Drainage Installation',
      phase: 'Site Preparation',
      date: '2025-04-10',
      uploadedBy: 'John Smith',
      description: 'Underground drainage system installed',
      tags: ['drainage', 'site-prep', 'utilities'],
      thumbnail: '/api/placeholder/400/300',
    },
    {
      id: '11',
      title: 'Ductwork Installation Progress',
      phase: 'MEP',
      date: '2026-01-19',
      uploadedBy: 'XYZ Mechanical',
      description: 'HVAC ductwork installation 2nd floor',
      tags: ['hvac', 'ductwork', '2nd-floor'],
      thumbnail: '/api/placeholder/400/300',
    },
    {
      id: '12',
      title: 'Rebar Installation Complete',
      phase: 'Foundation',
      date: '2025-04-18',
      uploadedBy: 'Foundation Experts',
      description: 'All rebar placement complete and inspected',
      tags: ['rebar', 'foundation', 'steel'],
      thumbnail: '/api/placeholder/400/300',
    },
  ]

  // Filter photos
  const filteredPhotos = photos.filter(photo => {
    const matchesPhase = selectedPhase === 'ALL' || photo.phase === selectedPhase
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesPhase && matchesSearch
  })

  // Group photos by phase
  const photosByPhase = filteredPhotos.reduce((acc, photo) => {
    if (!acc[photo.phase]) {
      acc[photo.phase] = []
    }
    acc[photo.phase].push(photo)
    return acc
  }, {} as Record<string, typeof photos>)

  const phases = ['Site Preparation', 'Foundation', 'Framing & Structure', 'MEP', 'Interior Finishes', 'Exterior & Landscaping']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-black mb-2">Photo Gallery</h2>
          <p className="text-base text-muted-foreground">
            Document construction progress with photos
          </p>
        </div>
        <Button className="bg-[#56CCF2] hover:bg-[#56CCF2]/90">
          <Upload className="mr-2 h-4 w-4" />
          Upload Photos
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-4 border-[#56CCF2]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Photos</p>
              <ImageIcon className="h-5 w-5 text-[#56CCF2]" />
            </div>
            <p className="text-3xl font-black text-[#56CCF2]">
              {photos.length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              All phases
            </p>
          </CardContent>
        </Card>

        <Card className="border-4 border-[#E07A47]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">This Week</p>
              <Calendar className="h-5 w-5 text-[#E07A47]" />
            </div>
            <p className="text-3xl font-black text-[#E07A47]">
              {photos.filter(p => new Date(p.date) > new Date(Date.now() - 7*24*60*60*1000)).length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Recent uploads
            </p>
          </CardContent>
        </Card>

        <Card className="border-4 border-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Active Phase</p>
              <ImageIcon className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-black text-green-600">
              {photos.filter(p => p.phase === 'Framing & Structure').length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Framing photos
            </p>
          </CardContent>
        </Card>

        <Card className="border-4 border-purple-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Contributors</p>
              <ImageIcon className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-3xl font-black text-purple-600">
              {new Set(photos.map(p => p.uploadedBy)).size}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Team members
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & View Controls */}
      <Card className="border-2 border-slate-200 dark:border-[#E07A47]">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search photos by title, description, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                />
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? "bg-[#56CCF2] hover:bg-[#56CCF2]/90" : ""}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? "bg-[#56CCF2] hover:bg-[#56CCF2]/90" : ""}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Download All */}
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download All
            </Button>
          </div>

          {/* Phase Filter */}
          <div className="flex gap-2 flex-wrap mt-4">
            <Button
              variant={selectedPhase === 'ALL' ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPhase('ALL')}
              className={selectedPhase === 'ALL' ? "bg-[#56CCF2] hover:bg-[#56CCF2]/90" : ""}
            >
              All Phases ({photos.length})
            </Button>
            {phases.map((phase) => (
              <Button
                key={phase}
                variant={selectedPhase === phase ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPhase(phase)}
                className={selectedPhase === phase ? "bg-[#56CCF2] hover:bg-[#56CCF2]/90" : ""}
              >
                {phase} ({photos.filter(p => p.phase === phase).length})
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Photo Grid/List */}
      {viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPhotos.map((photo) => (
            <Card key={photo.id} className="border-2 border-slate-200 dark:border-slate-700 hover:border-[#56CCF2] transition-all cursor-pointer">
              <div className="aspect-video bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                <ImageIcon className="h-16 w-16 text-muted-foreground" />
              </div>
              <CardContent className="pt-4">
                <Badge variant="outline" className="mb-2 text-xs">
                  {photo.phase}
                </Badge>
                <h3 className="font-bold mb-1">{photo.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{photo.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatDate(photo.date)}</span>
                  <span>{photo.uploadedBy}</span>
                </div>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {photo.tags.slice(0, 3).map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filteredPhotos.map((photo) => (
            <Card key={photo.id} className="border-2 border-slate-200 dark:border-slate-700 hover:border-[#56CCF2] transition-all cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="w-32 h-24 bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{photo.title}</h3>
                        <p className="text-sm text-muted-foreground">{photo.description}</p>
                      </div>
                      <Badge variant="outline">{photo.phase}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(photo.date)}
                      </span>
                      <span>Uploaded by {photo.uploadedBy}</span>
                    </div>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {photo.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredPhotos.length === 0 && (
        <Card className="border-2 border-slate-200 dark:border-slate-700">
          <CardContent className="py-12 text-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">No photos found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or search term
            </p>
          </CardContent>
        </Card>
      )}

      {/* Upload Instructions */}
      <Card className="border-2 border-[#56CCF2] bg-[#56CCF2]/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <ImageIcon className="h-6 w-6 text-[#56CCF2] flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold mb-2">Photo Upload Tips</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Take photos at consistent times each day for best progress comparison</li>
                <li>• Include a reference object for scale when possible</li>
                <li>• Capture wide shots for overall progress and detail shots for quality</li>
                <li>• Add descriptive titles and tags to make photos easier to find</li>
                <li>• Document all major milestones and inspections</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
