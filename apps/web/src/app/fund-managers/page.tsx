import { MarketingNav } from "@/components/marketing/marketing-nav"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Building2, TrendingUp, Users, BarChart3, FileText, Calendar, DollarSign, CheckCircle2 } from "lucide-react"

export const metadata = {
  title: "For Fund Managers | RealCo",
  description: "Institutional-grade asset and fund management platform for real estate operators.",
}

export default function FundManagersPage() {
  return (
    <>
      <MarketingNav />
      
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2C3E50] via-[#34495E] to-[#2C3E50] opacity-5 dark:opacity-10"></div>
        
        <div className="container max-w-6xl px-6 mx-auto relative z-10">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-[#E07A47] hover:bg-[#E07A47]/90 text-white">
              Asset & Fund Management
            </Badge>
            <h1 className="text-6xl font-black mb-6 leading-tight">
              Operate Properties.<br />
              Delight Investors.<br />
              <span className="text-[#56CCF2]">Maximize Returns.</span>
            </h1>
            <p className="text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              The institutional-grade platform for asset managers to operate properties,
              engage investors, and execute successful exits.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button asChild size="lg" className="text-lg px-8 py-6 bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                <Link href="/signup?role=fund-manager">
                  Start Free Trial
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6">
                <Link href="/contact">
                  Request Demo
                </Link>
              </Button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {[
              { value: "$2.1B+", label: "Assets Under Management" },
              { value: "450+", label: "Properties Managed" },
              { value: "15,000+", label: "Units Tracked" },
              { value: "99.2%", label: "Investor Satisfaction" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black text-[#E07A47] mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-6xl px-6 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">Built for Asset Managers</h2>
            <p className="text-xl text-muted-foreground">
              Whether you manage 5 properties or 500, RealCo scales with you
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Asset Managers", desc: "Manage properties post-acquisition" },
              { title: "Fund Administrators", desc: "Handle LP investments & reporting" },
              { title: "Sponsors", desc: "Manage post-acquisition operations" },
              { title: "REOCs", desc: "Real estate operating companies" },
            ].map((audience) => (
              <Card key={audience.title} className="border-4 border-[#E07A47] dark:bg-[#6b7280]">
                <CardHeader>
                  <CardTitle className="dark:text-white">{audience.title}</CardTitle>
                  <CardDescription className="dark:text-white/80">{audience.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20">
        <div className="container max-w-6xl px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4">Everything You Need</h2>
            <p className="text-xl text-muted-foreground">
              Complete asset and fund management in one platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Asset Operations */}
            <Card className="border-4 border-[#E07A47] dark:bg-[#6b7280]">
              <CardHeader>
                <Building2 className="h-12 w-12 text-[#E07A47] mb-4" />
                <CardTitle className="text-2xl dark:text-white">Asset Operations</CardTitle>
                <CardDescription className="text-base dark:text-white/80">
                  Comprehensive property management and performance tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Real-time occupancy and rent roll",
                    "Lease management and renewals",
                    "Maintenance and capital projects",
                    "Operating statement tracking",
                    "PM software integration (Yardi, AppFolio)",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[#56CCF2] shrink-0 mt-0.5" />
                      <span className="dark:text-white">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Fund Accounting */}
            <Card className="border-4 border-[#E07A47] dark:bg-[#6b7280]">
              <CardHeader>
                <DollarSign className="h-12 w-12 text-[#E07A47] mb-4" />
                <CardTitle className="text-2xl dark:text-white">Fund Accounting</CardTitle>
                <CardDescription className="text-base dark:text-white/80">
                  Investor capital tracking and distribution management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Investor capital accounts",
                    "Distribution waterfall calculations",
                    "Preferred return tracking",
                    "Management fee processing",
                    "Tax document preparation (K-1s)",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[#56CCF2] shrink-0 mt-0.5" />
                      <span className="dark:text-white">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Investor Relations */}
            <Card className="border-4 border-[#E07A47] dark:bg-[#6b7280]">
              <CardHeader>
                <Users className="h-12 w-12 text-[#E07A47] mb-4" />
                <CardTitle className="text-2xl dark:text-white">Investor Relations</CardTitle>
                <CardDescription className="text-base dark:text-white/80">
                  Professional investor communication and reporting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Quarterly report generation",
                    "Mass communications (email, SMS)",
                    "Investor portal access",
                    "Event management (annual meetings)",
                    "Performance dashboards",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[#56CCF2] shrink-0 mt-0.5" />
                      <span className="dark:text-white">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Portfolio Analytics */}
            <Card className="border-4 border-[#E07A47] dark:bg-[#6b7280]">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-[#E07A47] mb-4" />
                <CardTitle className="text-2xl dark:text-white">Portfolio Analytics</CardTitle>
                <CardDescription className="text-base dark:text-white/80">
                  Cross-property performance and risk analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Fund-level IRR and multiples",
                    "Cross-property comparisons",
                    "Variance analysis",
                    "Risk metrics and concentration",
                    "Geographic & sector allocation",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[#56CCF2] shrink-0 mt-0.5" />
                      <span className="dark:text-white">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Disposition Management */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-6xl px-6 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">Exit Strategy & Disposition</h2>
            <p className="text-xl text-muted-foreground">
              Maximize returns with strategic exit planning and execution
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: TrendingUp,
                title: "Market Timing",
                desc: "Valuation modeling and market analysis for optimal exit timing",
              },
              {
                icon: FileText,
                title: "Sale Process",
                desc: "Broker coordination, offer management, and due diligence tracking",
              },
              {
                icon: BarChart3,
                title: "Exit Analysis",
                desc: "Realized vs projected returns, value creation attribution, post-mortem",
              },
            ].map((item) => (
              <Card key={item.title} className="border-4 border-[#E07A47] dark:bg-[#6b7280]">
                <CardHeader>
                  <item.icon className="h-10 w-10 text-[#E07A47] mb-4" />
                  <CardTitle className="dark:text-white">{item.title}</CardTitle>
                  <CardDescription className="dark:text-white/80">{item.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20">
        <div className="container max-w-6xl px-6 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">Seamless Integrations</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Connect with your existing property management and accounting systems
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["Yardi Voyager", "AppFolio", "Buildium", "Rent Manager", "QuickBooks", "Xero", "Cozy", "TaxBit"].map((integration) => (
              <Card key={integration} className="border-2 border-[#E07A47] dark:bg-[#6b7280]">
                <CardContent className="pt-6 text-center">
                  <p className="font-bold dark:text-white">{integration}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-6xl px-6 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that fits your portfolio size
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Professional",
                price: "$999",
                period: "/month",
                description: "Perfect for growing portfolios",
                features: [
                  "Up to 10 properties",
                  "100 units tracked",
                  "500 investors",
                  "Quarterly reporting",
                  "Email support",
                ],
                cta: "Start Free Trial",
              },
              {
                name: "Enterprise",
                price: "$2,499",
                period: "/month",
                description: "For large portfolios",
                features: [
                  "Up to 50 properties",
                  "Unlimited units",
                  "Unlimited investors",
                  "Monthly reporting",
                  "Priority support",
                  "API access",
                ],
                cta: "Start Free Trial",
                popular: true,
              },
              {
                name: "Custom",
                price: "Contact Us",
                period: "",
                description: "For 50+ properties",
                features: [
                  "Unlimited everything",
                  "Dedicated account manager",
                  "Custom integrations",
                  "White-label options",
                  "24/7 support",
                ],
                cta: "Contact Sales",
              },
            ].map((plan) => (
              <Card
                key={plan.name}
                className={`border-4 ${
                  plan.popular ? "border-[#56CCF2] relative" : "border-[#E07A47]"
                } dark:bg-[#6b7280]`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-[#56CCF2] text-white">MOST POPULAR</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl dark:text-white">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-black dark:text-white">{plan.price}</span>
                    <span className="text-muted-foreground dark:text-white/70">{plan.period}</span>
                  </div>
                  <CardDescription className="dark:text-white/80">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-[#56CCF2] shrink-0 mt-0.5" />
                        <span className="dark:text-white">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className={`w-full ${
                      plan.popular
                        ? "bg-[#56CCF2] hover:bg-[#56CCF2]/90"
                        : "bg-[#E07A47] hover:bg-[#E07A47]/90"
                    }`}
                  >
                    <Link href={plan.name === "Custom" ? "/contact" : "/signup?role=fund-manager"}>
                      {plan.cta}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#2C3E50] to-[#34495E] text-white">
        <div className="container max-w-4xl px-6 mx-auto text-center">
          <h2 className="text-5xl font-black mb-6">
            Ready to Transform Your Asset Management?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join 450+ fund managers using RealCo to operate $2.1B+ in real estate assets
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg" className="bg-[#56CCF2] hover:bg-[#56CCF2]/90 text-lg px-8 py-6">
              <Link href="/signup?role=fund-manager">
                Start Free Trial
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 bg-white text-[#2C3E50] hover:bg-white/90">
              <Link href="/contact">
                Schedule Demo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </>
  )
}
