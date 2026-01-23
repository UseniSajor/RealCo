"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar, 
  Filter,
  Search,
  Folder,
  Shield,
  CheckCircle2,
  AlertCircle
} from "lucide-react"

type DocumentType = 'SUBSCRIPTION' | 'K1' | 'DISTRIBUTION' | 'QUARTERLY' | 'ANNUAL' | 'AGREEMENT' | 'OTHER'

interface Document {
  id: string
  name: string
  type: DocumentType
  projectName: string
  date: string
  size: string
  status: 'AVAILABLE' | 'PENDING' | 'SIGNED'
  requiresSignature: boolean
}

export function DocumentCenter() {
  const [selectedType, setSelectedType] = useState<DocumentType | 'ALL'>('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock documents
  const documents: Document[] = [
    {
      id: '1',
      name: 'Subscription Agreement',
      type: 'SUBSCRIPTION',
      projectName: 'Sunset Apartments',
      date: '2025-06-15',
      size: '2.4 MB',
      status: 'SIGNED',
      requiresSignature: true,
    },
    {
      id: '2',
      name: 'K-1 Tax Form 2025',
      type: 'K1',
      projectName: 'Sunset Apartments',
      date: '2026-01-15',
      size: '856 KB',
      status: 'AVAILABLE',
      requiresSignature: false,
    },
    {
      id: '3',
      name: 'Q4 2025 Distribution Notice',
      type: 'DISTRIBUTION',
      projectName: 'Sunset Apartments',
      date: '2025-12-20',
      size: '340 KB',
      status: 'AVAILABLE',
      requiresSignature: false,
    },
    {
      id: '4',
      name: 'Q4 2025 Investor Report',
      type: 'QUARTERLY',
      projectName: 'Sunset Apartments',
      date: '2025-12-31',
      size: '5.2 MB',
      status: 'AVAILABLE',
      requiresSignature: false,
    },
    {
      id: '5',
      name: 'Operating Agreement',
      type: 'AGREEMENT',
      projectName: 'Marina Bay Development',
      date: '2025-08-01',
      size: '1.8 MB',
      status: 'SIGNED',
      requiresSignature: true,
    },
    {
      id: '6',
      name: 'Q3 2025 Investor Report',
      type: 'QUARTERLY',
      projectName: 'Marina Bay Development',
      date: '2025-09-30',
      size: '4.1 MB',
      status: 'AVAILABLE',
      requiresSignature: false,
    },
    {
      id: '7',
      name: 'Annual Report 2024',
      type: 'ANNUAL',
      projectName: 'Sunset Apartments',
      date: '2025-03-15',
      size: '8.7 MB',
      status: 'AVAILABLE',
      requiresSignature: false,
    },
    {
      id: '8',
      name: 'PPM Amendment Notice',
      type: 'OTHER',
      projectName: 'Marina Bay Development',
      date: '2025-11-10',
      size: '620 KB',
      status: 'PENDING',
      requiresSignature: false,
    },
  ]

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getTypeColor = (type: DocumentType) => {
    const colors: Record<DocumentType, string> = {
      SUBSCRIPTION: 'bg-purple-500',
      K1: 'bg-red-500',
      DISTRIBUTION: 'bg-green-500',
      QUARTERLY: 'bg-[#56CCF2]',
      ANNUAL: 'bg-[#E07A47]',
      AGREEMENT: 'bg-blue-600',
      OTHER: 'bg-slate-500',
    }
    return colors[type] || 'bg-slate-500'
  }

  const getStatusBadge = (doc: Document) => {
    if (doc.status === 'SIGNED') {
      return <Badge className="bg-green-500 text-white"><CheckCircle2 className="h-3 w-3 mr-1" />Signed</Badge>
    }
    if (doc.status === 'PENDING') {
      return <Badge className="bg-yellow-500 text-white"><AlertCircle className="h-3 w-3 mr-1" />Pending</Badge>
    }
    if (doc.requiresSignature) {
      return <Badge className="bg-[#E07A47] text-white">Action Required</Badge>
    }
    return <Badge className="bg-slate-400 text-white">Available</Badge>
  }

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesType = selectedType === 'ALL' || doc.type === selectedType
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.projectName.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesSearch
  })

  // Group by project
  const documentsByProject = filteredDocuments.reduce((acc, doc) => {
    if (!acc[doc.projectName]) {
      acc[doc.projectName] = []
    }
    acc[doc.projectName].push(doc)
    return acc
  }, {} as Record<string, Document[]>)

  const documentTypes: Array<{value: DocumentType | 'ALL', label: string, count: number}> = [
    { value: 'ALL', label: 'All Documents', count: documents.length },
    { value: 'SUBSCRIPTION', label: 'Subscriptions', count: documents.filter(d => d.type === 'SUBSCRIPTION').length },
    { value: 'K1', label: 'Tax Forms', count: documents.filter(d => d.type === 'K1').length },
    { value: 'DISTRIBUTION', label: 'Distributions', count: documents.filter(d => d.type === 'DISTRIBUTION').length },
    { value: 'QUARTERLY', label: 'Quarterly Reports', count: documents.filter(d => d.type === 'QUARTERLY').length },
    { value: 'ANNUAL', label: 'Annual Reports', count: documents.filter(d => d.type === 'ANNUAL').length },
    { value: 'AGREEMENT', label: 'Agreements', count: documents.filter(d => d.type === 'AGREEMENT').length },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black mb-2">Document Center</h2>
        <p className="text-base text-muted-foreground">
          Access all your investment documents in one secure location
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-4 border-[#56CCF2]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Documents</p>
              <FileText className="h-5 w-5 text-[#56CCF2]" />
            </div>
            <p className="text-3xl font-black text-[#56CCF2]">
              {documents.length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              All investments
            </p>
          </CardContent>
        </Card>

        <Card className="border-4 border-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Signed</p>
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl font-black text-green-600">
              {documents.filter(d => d.status === 'SIGNED').length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Completed actions
            </p>
          </CardContent>
        </Card>

        <Card className="border-4 border-[#E07A47]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Action Required</p>
              <AlertCircle className="h-5 w-5 text-[#E07A47]" />
            </div>
            <p className="text-3xl font-black text-[#E07A47]">
              {documents.filter(d => d.requiresSignature && d.status !== 'SIGNED').length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Need signature
            </p>
          </CardContent>
        </Card>

        <Card className="border-4 border-purple-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Tax Documents</p>
              <Folder className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-3xl font-black text-purple-600">
              {documents.filter(d => d.type === 'K1').length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              K-1 forms available
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-2 border-slate-200 dark:border-[#E07A47]">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="flex gap-2 flex-wrap">
              {documentTypes.map((type) => (
                <Button
                  key={type.value}
                  variant={selectedType === type.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type.value)}
                  className={selectedType === type.value ? "bg-[#56CCF2] hover:bg-[#56CCF2]/90" : ""}
                >
                  {type.label} ({type.count})
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents by Project */}
      {Object.entries(documentsByProject).map(([projectName, projectDocs]) => (
        <Card key={projectName} className="border-2 border-slate-200 dark:border-[#E07A47]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Folder className="h-5 w-5 text-[#E07A47]" />
                  {projectName}
                </CardTitle>
                <CardDescription className="mt-1">
                  {projectDocs.length} document{projectDocs.length !== 1 ? 's' : ''}
                </CardDescription>
              </div>
              <Shield className="h-6 w-6 text-green-600" title="Secure & Encrypted" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {projectDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-[#56CCF2] transition-all bg-white dark:bg-slate-800"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-lg ${getTypeColor(doc.type)} flex items-center justify-center text-white`}>
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold">{doc.name}</h4>
                          {getStatusBadge(doc)}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(doc.date)}
                          </span>
                          <span>{doc.size}</span>
                          <Badge variant="outline" className="text-xs">
                            {doc.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {filteredDocuments.length === 0 && (
        <Card className="border-2 border-slate-200 dark:border-slate-700">
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">No documents found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or search term
            </p>
          </CardContent>
        </Card>
      )}

      {/* Security Notice */}
      <Card className="border-2 border-green-500 bg-green-50 dark:bg-green-950">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-green-900 dark:text-green-100 mb-1">
                Bank-Grade Security
              </h4>
              <p className="text-sm text-green-800 dark:text-green-200">
                All documents are encrypted end-to-end and stored on secure servers. 
                Access is logged and monitored for compliance. Your data is protected with the same 
                security standards used by financial institutions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
