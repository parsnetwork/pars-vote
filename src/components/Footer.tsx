import { ExternalLink } from 'lucide-react'

const ecosystemLinks = [
  { href: 'https://pars.ngo', label: 'NGO' },
  { href: 'https://pars.network', label: 'Network' },
  { href: 'https://pars.fund', label: 'Fund' },
  { href: 'https://pars.markets', label: 'Markets' },
  { href: 'https://pars.id', label: 'Identity' },
]

const migaLinks = [
  { href: 'https://miga.us.org', label: 'Foundation' },
  { href: 'https://migaprotocol.xyz', label: 'Protocol' },
  { href: 'https://github.com/migaprotocol', label: 'GitHub' },
]

const socialLinks = [
  { href: 'https://twitter.com/parsprotocol', label: 'Twitter' },
  { href: 'https://discord.gg/pars', label: 'Discord' },
  { href: 'https://t.me/parsprotocol', label: 'Telegram' },
]

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-pars-deep py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-semibold mb-4 text-pars-gold">PARS Ecosystem</h4>
            <ul className="space-y-2">
              {ecosystemLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm flex items-center gap-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-pars-gold">MIGA Protocol</h4>
            <ul className="space-y-2">
              {migaLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm flex items-center gap-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-pars-gold">Community</h4>
            <ul className="space-y-2">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm flex items-center gap-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-pars-gold">Chains</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>Ethereum Mainnet</li>
              <li>Arbitrum</li>
              <li>Base</li>
              <li>Polygon</li>
              <li>Lux Network</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl gradient-text font-bold">PARS Vote</span>
            <span className="text-white/40">|</span>
            <span className="text-white/60 text-sm">Governance</span>
          </div>
          <p className="text-white/40 text-sm">
            2026 PARS Protocol. Part of the MIGA ecosystem.
          </p>
        </div>
      </div>
    </footer>
  )
}
