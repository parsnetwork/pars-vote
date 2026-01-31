import { Link, useLocation } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const navLinks = [
  { href: '/governance', label: 'Proposals' },
  { href: '/staking', label: 'Stake ASHA' },
  { href: '/delegate', label: 'Delegate' },
  { href: '/analytics', label: 'Analytics' },
]

const externalLinks = [
  { href: 'https://pars-docs.pages.dev', label: 'Docs' },
]

export function Header() {
  const location = useLocation()

  return (
    <header className="border-b border-white/10 bg-pars-deep/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pars-gold to-pars-bronze flex items-center justify-center">
            <span className="text-xl font-bold text-pars-deep">V</span>
          </div>
          <div>
            <span className="text-xl font-bold gradient-text">PARS Vote</span>
            <span className="text-xs text-white/50 block">Governance</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium transition-colors ${
                location.pathname === link.href
                  ? 'text-pars-gold'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {externalLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ConnectButton
            accountStatus="address"
            chainStatus="icon"
            showBalance={false}
          />
        </div>
      </div>
    </header>
  )
}
