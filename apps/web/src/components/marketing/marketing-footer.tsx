import Link from "next/link"

export function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-[#2C3E50] text-white mt-24">
      <div className="container max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-2xl font-black mb-4">RealCo</h3>
            <p className="text-sm text-white/80 leading-relaxed">
              Unified platform for real estate syndication, compliance, and investor relations.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4 uppercase tracking-wider">Platform</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/sponsors" className="text-sm text-white/80 hover:text-white transition-colors">
                  For Sponsors
                </Link>
              </li>
              <li>
                <Link href="/investors" className="text-sm text-white/80 hover:text-white transition-colors">
                  For Investors
                </Link>
              </li>
              <li>
                <Link href="/providers" className="text-sm text-white/80 hover:text-white transition-colors">
                  For Providers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/contact" className="text-sm text-white/80 hover:text-white transition-colors">
                  Book a Demo
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-sm text-white/80 hover:text-white transition-colors">
                  Start Trial
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4 uppercase tracking-wider">Legal</h4>
            <p className="text-xs text-white/70 leading-relaxed">
              RealCo provides software and workflows, not legal/tax/investment advice.
            </p>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/70">
              © {new Date().getFullYear()} RealCo Platform. All rights reserved.
            </p>
            <p className="text-xs text-white/60 max-w-2xl text-center md:text-right">
              <strong>Disclaimer:</strong> Past performance does not guarantee future results. 
              All investments carry risk, including loss of principal. Consult qualified professionals.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
