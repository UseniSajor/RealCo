"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Download,
  FileText,
  CheckCircle,
  Building2,
  DollarSign,
  Shield,
  BarChart3,
  ArrowRight,
  Loader2,
  Mail
} from "lucide-react"

interface SponsorOverviewDownloadProps {
  variant?: "full" | "compact"
}

export function SponsorOverviewDownload({ variant = "full" }: SponsorOverviewDownloadProps) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)
    setError("")

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // In production, this would:
    // 1. Save lead to CRM
    // 2. Send email with download link
    // 3. Trigger email sequence

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Trigger download
    downloadOverview()
  }

  const downloadOverview = () => {
    // Generate and download the sponsor overview PDF
    const overviewContent = generateSponsorOverviewContent()
    const blob = new Blob([overviewContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "RealCo-Sponsor-Overview.html"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#E07A47]/10 to-[#56CCF2]/10 rounded-xl border-2 border-[#E07A47]">
        <FileText className="h-8 w-8 text-[#E07A47]" />
        <div className="flex-1">
          <h4 className="font-bold">Download Sponsor Overview</h4>
          <p className="text-sm text-muted-foreground">Complete platform guide for sponsors</p>
        </div>
        <Button
          onClick={downloadOverview}
          className="bg-[#E07A47] hover:bg-[#D96835]"
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </div>
    )
  }

  return (
    <section id="download" className="py-24 bg-gradient-to-b from-white to-[#56CCF2]/5 dark:from-slate-900 dark:to-[#56CCF2]/10">
      <div className="container max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content Preview */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E07A47]/10 text-[#E07A47] rounded-full text-sm font-medium mb-6">
              <FileText className="h-4 w-4" />
              Free Download
            </div>

            <h2 className="text-4xl md:text-5xl font-black mb-6">
              RealCo Sponsor Overview
            </h2>

            <p className="text-xl text-muted-foreground mb-8">
              Everything you need to know about running your syndication on RealCo.
              From capital raising to construction management to investor reporting.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#56CCF2]/20 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-5 w-5 text-[#56CCF2]" />
                </div>
                <div>
                  <h4 className="font-bold">Deal Setup & Pipeline</h4>
                  <p className="text-sm text-muted-foreground">Property sourcing, underwriting tools, and deal flow management</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#E07A47]/20 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="h-5 w-5 text-[#E07A47]" />
                </div>
                <div>
                  <h4 className="font-bold">Capital Raising</h4>
                  <p className="text-sm text-muted-foreground">Digital subscriptions, investor CRM, and automated communications</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold">Compliance & Legal</h4>
                  <p className="text-sm text-muted-foreground">Reg D workflows, accreditation, and audit trails</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold">Reporting & Analytics</h4>
                  <p className="text-sm text-muted-foreground">Automated reports, distributions, and K-1 preparation</p>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="flex flex-wrap gap-2">
              {["Platform Overview", "Feature Guide", "Pricing Info", "Case Studies", "ROI Calculator"].map((item) => (
                <span key={item} className="px-3 py-1 bg-muted rounded-full text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Download Form */}
          <div>
            <Card className="border-4 border-[#E07A47] shadow-2xl shadow-[#E07A47]/20">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#E07A47] to-[#56CCF2] flex items-center justify-center">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Get Your Free Copy</CardTitle>
                <CardDescription>
                  Instant download + email with additional resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Download Started!</h3>
                    <p className="text-muted-foreground mb-4">
                      Check your email for additional sponsor resources.
                    </p>
                    <Button onClick={downloadOverview} variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download Again
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Work Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="you@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 h-12"
                        />
                      </div>
                      {error && (
                        <p className="text-sm text-red-500 mt-1">{error}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-[#E07A47] hover:bg-[#D96835] text-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-5 w-5" />
                          Download Now
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      By downloading, you agree to receive occasional updates from RealCo.
                      Unsubscribe anytime.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>No spam</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Instant access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Free forever</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Generate downloadable sponsor overview content
function generateSponsorOverviewContent(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RealCo Sponsor Overview</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .page { max-width: 800px; margin: 0 auto; padding: 40px; }
    .header { text-align: center; margin-bottom: 40px; padding-bottom: 40px; border-bottom: 3px solid #E07A47; }
    .logo { font-size: 32px; font-weight: 900; color: #56CCF2; margin-bottom: 10px; }
    .logo span { color: #E07A47; }
    h1 { font-size: 28px; margin-bottom: 10px; }
    h2 { font-size: 22px; color: #E07A47; margin: 30px 0 15px; padding-bottom: 10px; border-bottom: 2px solid #eee; }
    h3 { font-size: 18px; color: #56CCF2; margin: 20px 0 10px; }
    p { margin-bottom: 15px; }
    ul { margin-left: 20px; margin-bottom: 15px; }
    li { margin-bottom: 8px; }
    .feature-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #E07A47; }
    .highlight { background: linear-gradient(135deg, #56CCF2 0%, #E07A47 100%); color: white; padding: 30px; border-radius: 12px; margin: 30px 0; }
    .highlight h3 { color: white; }
    .stats { display: flex; justify-content: space-around; text-align: center; margin: 30px 0; }
    .stat { padding: 20px; }
    .stat-value { font-size: 36px; font-weight: 900; color: #E07A47; }
    .stat-label { font-size: 14px; color: #666; }
    .cta { text-align: center; padding: 40px; background: #56CCF2; color: white; border-radius: 12px; margin-top: 40px; }
    .cta h3 { color: white; font-size: 24px; margin-bottom: 15px; }
    .btn { display: inline-block; padding: 15px 30px; background: #E07A47; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 15px; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="logo">Real<span>Co</span></div>
      <h1>Sponsor Platform Overview</h1>
      <p style="color: #666;">Your Complete Real Estate Syndication Platform</p>
    </div>

    <div class="highlight">
      <h3>The All-in-One Platform for Real Estate Sponsors</h3>
      <p>RealCo provides everything you need to source deals, raise capital, manage construction, stay compliant, and report to investors - all in one unified platform.</p>
    </div>

    <div class="stats">
      <div class="stat">
        <div class="stat-value">75%</div>
        <div class="stat-label">Faster Capital Raises</div>
      </div>
      <div class="stat">
        <div class="stat-value">90%</div>
        <div class="stat-label">Less Admin Work</div>
      </div>
      <div class="stat">
        <div class="stat-value">100%</div>
        <div class="stat-label">Compliance Coverage</div>
      </div>
    </div>

    <h2>1. Deal Sourcing & Property Search</h2>
    <div class="feature-box">
      <h3>AI-Powered Property Finder</h3>
      <ul>
        <li><strong>Smart Search:</strong> Filter by property type, location, price, cap rate, NOI, and more</li>
        <li><strong>Market Intelligence:</strong> Real-time market data and comp analysis</li>
        <li><strong>Owner Lookup:</strong> Find and contact property owners directly</li>
        <li><strong>Deal Scoring:</strong> AI analyzes deals and provides investment recommendations</li>
        <li><strong>Pipeline Management:</strong> Track deals from sourcing through closing</li>
      </ul>
    </div>

    <h2>2. Lead & Prospect Management</h2>
    <div class="feature-box">
      <h3>CRM for Deal Flow</h3>
      <ul>
        <li><strong>Lead Tracking:</strong> Capture and qualify leads from multiple sources</li>
        <li><strong>Contact Management:</strong> Track all communications with owners and brokers</li>
        <li><strong>Activity Logging:</strong> Call notes, emails, site visits, and follow-ups</li>
        <li><strong>Task Automation:</strong> Never miss a follow-up with automated reminders</li>
        <li><strong>AI Lead Scoring:</strong> Prioritize the hottest opportunities</li>
      </ul>
    </div>

    <h2>3. Capital Raising & Investor Relations</h2>
    <div class="feature-box">
      <h3>Raise Capital Faster</h3>
      <ul>
        <li><strong>Digital Subscriptions:</strong> Investors complete subscriptions online in minutes</li>
        <li><strong>Investor Portal:</strong> Self-service access to documents and reports</li>
        <li><strong>Accreditation:</strong> Automated verification workflows</li>
        <li><strong>CRM:</strong> Track investor interest, commitments, and communications</li>
        <li><strong>Email Automation:</strong> Drip campaigns and deal announcements</li>
      </ul>
    </div>

    <h2>4. Compliance & Legal</h2>
    <div class="feature-box">
      <h3>Stay Compliant, Reduce Risk</h3>
      <ul>
        <li><strong>Reg D Workflows:</strong> 506(b) and 506(c) compliant processes</li>
        <li><strong>Form D Preparation:</strong> Generate and track SEC filings</li>
        <li><strong>Suitability:</strong> Investor questionnaires and qualification</li>
        <li><strong>Audit Trails:</strong> Complete, immutable records of all activities</li>
        <li><strong>Document Management:</strong> Secure storage with version control</li>
      </ul>
    </div>

    <h2>5. Construction Management</h2>
    <div class="feature-box">
      <h3>Control Every Dollar</h3>
      <ul>
        <li><strong>Budget Tracking:</strong> Real-time visibility into project spend</li>
        <li><strong>Draw Requests:</strong> Streamlined approval workflows</li>
        <li><strong>Milestone Payments:</strong> Escrow-style releases tied to progress</li>
        <li><strong>Lien Waivers:</strong> Automated collection and tracking</li>
        <li><strong>Daily Logs:</strong> Photo documentation and progress notes</li>
      </ul>
    </div>

    <h2>6. Reporting & Distributions</h2>
    <div class="feature-box">
      <h3>Automate Investor Communications</h3>
      <ul>
        <li><strong>Quarterly Reports:</strong> Generate professional reports with one click</li>
        <li><strong>Waterfall Calculations:</strong> Automatic distribution modeling</li>
        <li><strong>ACH Distributions:</strong> Send payments directly to investor accounts</li>
        <li><strong>K-1 Preparation:</strong> Tax document generation and delivery</li>
        <li><strong>Custom Dashboards:</strong> Real-time portfolio analytics</li>
      </ul>
    </div>

    <h2>Pricing</h2>
    <div class="feature-box">
      <h3>Plans for Every Stage</h3>
      <ul>
        <li><strong>Starter:</strong> $299/mo - Perfect for your first syndication</li>
        <li><strong>Professional:</strong> $599/mo - For active sponsors with multiple deals</li>
        <li><strong>Enterprise:</strong> Custom - For large operators with complex needs</li>
      </ul>
      <p><em>All plans include unlimited users, 24/7 support, and free onboarding.</em></p>
    </div>

    <div class="cta">
      <h3>Ready to Transform Your Syndication Business?</h3>
      <p>Join hundreds of sponsors who have streamlined their operations with RealCo.</p>
      <a href="https://realco.com/contact" class="btn">Schedule a Demo</a>
    </div>

    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} RealCo. All rights reserved.</p>
      <p>Questions? Contact us at sponsors@realco.com</p>
    </div>
  </div>
</body>
</html>`
}
