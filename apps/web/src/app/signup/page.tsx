import { MarketingNav } from "@/components/marketing/marketing-nav"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { Building2, TrendingUp, Wrench } from "lucide-react"

export const metadata = {
  title: "Sign Up | RealCo",
  description: "Choose your role and start your free trial.",
}

export default function SignupPage() {
  return (
    <>
      <MarketingNav />
      
      <section className="py-24 min-h-screen">
        <div className="container max-w-5xl px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-black mb-4">Choose Your Role</h1>
            <p className="text-xl text-muted-foreground">
              Select the option that best describes you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="cursor-pointer hover:shadow-2xl transition-all">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Sponsor / Developer</CardTitle>
                <CardDescription>
                  Raise capital and manage projects
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full" size="lg">
                  Sign Up as Sponsor
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-2xl transition-all">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Investor</CardTitle>
                <CardDescription>
                  Invest in opportunities
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full" size="lg">
                  Sign Up as Investor
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-2xl transition-all">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center">
                  <Wrench className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Service Provider</CardTitle>
                <CardDescription>
                  Partner with sponsors
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full" size="lg">
                  Sign Up as Provider
                </Button>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-[rgb(var(--primary))] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </section>

      <MarketingFooter />
    </>
  )
}
