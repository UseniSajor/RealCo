"use client"

import Link from "next/link"
import { Building2, Mail, Phone } from "lucide-react"

export function MarketingFooter() {
  return (
    <footer className="border-t-4 border-realco-orange bg-gradient-to-br from-realco-navy to-realco-blue text-white">
      <div className="container max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 shape-circle bg-gradient-realco flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-black">RealCo</h3>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              Unified platform for real estate syndication, compliance, and investor relations.
            </p>
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <div className="w-6 h-6 shape-circle bg-realco-orange/20 flex items-center justify-center">
                  <Mail className="h-3 w-3" />
                </div>
                <span>hello@realco.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <div className="w-6 h-6 shape-circle bg-realco-orange/20 flex items-center justify-center">
                  <Phone className="h-3 w-3" />
                </div>
                <span>1-800-REALCO</span>
              </div>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-bold mb-4 uppercase tracking-wider">Platform</h4>
            <ul className="space-y-3">
              {[
                { label: "For Sponsors", href: "/sponsors" },
                { label: "For Fund Managers", href: "/fund-managers" },
                { label: "For Investors", href: "/investors" },
                { label: "For Providers", href: "/providers" },
                { label: "Pricing", href: "/pricing" }
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-white/80 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <div className="w-1.5 h-1.5 shape-circle bg-realco-orange opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-bold mb-4 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-3">
              {[
                { label: "Book a Demo", href: "/contact" },
                { label: "Start Free Trial", href: "/signup" },
                { label: "View Demo Dashboard", href: "/dashboard" },
                { label: "Login", href: "/login" }
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-white/80 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <div className="w-1.5 h-1.5 shape-circle bg-realco-orange opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Trust */}
          <div>
            <h4 className="text-sm font-bold mb-4 uppercase tracking-wider">Trust & Security</h4>
            <div className="space-y-4">
              <div className="p-4 shape-oval bg-white/10 backdrop-blur">
                <p className="text-xs text-white/90 font-semibold mb-1">SOC 2 Type II</p>
                <p className="text-xs text-white/70">Compliant</p>
              </div>
              <div className="p-4 shape-oval bg-white/10 backdrop-blur">
                <p className="text-xs text-white/90 font-semibold mb-1">Bank-Grade</p>
                <p className="text-xs text-white/70">Security</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/70">
              © {new Date().getFullYear()} RealCo Platform. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-xs text-white/60 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-xs text-white/60 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-xs text-white/60 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
          <p className="text-xs text-white/50 mt-4 text-center max-w-3xl mx-auto">
            <strong>Disclaimer:</strong> RealCo provides software and workflows, not legal, tax, or investment advice. 
            Past performance does not guarantee future results. All investments carry risk, including loss of principal. 
            Consult qualified professionals before making investment decisions.
          </p>
        </div>
      </div>
    </footer>
  )
}
