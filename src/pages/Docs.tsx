import { ExternalLink, Book, Code, Shield, Coins } from 'lucide-react'

const docs = [
  {
    icon: Book,
    title: 'Whitepaper',
    description: 'Complete technical and vision document for the MIGA Protocol.',
    href: 'https://migaprotocol.xyz/whitepaper',
  },
  {
    icon: Coins,
    title: 'Tokenomics',
    description: 'MIGA and PARS token economics, vePARS mechanics, and emission schedules.',
    href: 'https://migaprotocol.xyz/docs/tokenomics',
  },
  {
    icon: Shield,
    title: 'Security',
    description: 'Audit reports, bug bounty program, and security best practices.',
    href: 'https://migaprotocol.xyz/docs/security',
  },
  {
    icon: Code,
    title: 'Developer Docs',
    description: 'Smart contract interfaces, SDK documentation, and integration guides.',
    href: 'https://migaprotocol.xyz/docs/developers',
  },
]

export function Docs() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="gradient-text">Documentation</span>
          </h1>
          <p className="text-white/60 mb-8">
            Learn about PARS governance, MIGA Protocol, and how to participate.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {docs.map((doc) => (
              <a
                key={doc.title}
                href={doc.href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-6 hover:border-pars-gold/30 transition-all group"
              >
                <doc.icon className="w-10 h-10 text-pars-gold mb-4 group-hover:scale-110 transition-transform" />
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold">{doc.title}</h3>
                  <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-pars-gold transition-colors" />
                </div>
                <p className="text-white/60">{doc.description}</p>
              </a>
            ))}
          </div>

          {/* Quick Reference */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-6">Quick Reference</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-pars-gold mb-2">vePARS Formula</h3>
                <code className="block bg-pars-deep p-4 rounded-lg text-sm">
                  vePARS = min(PARS, MIGA) × √(lock_duration / max_duration)
                </code>
              </div>

              <div>
                <h3 className="font-semibold text-pars-gold mb-2">Supported Chains</h3>
                <div className="flex flex-wrap gap-2">
                  {['Ethereum', 'Arbitrum', 'Base', 'Polygon', 'Lux'].map((chain) => (
                    <span key={chain} className="px-3 py-1 bg-pars-deep rounded-full text-sm">
                      {chain}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-pars-gold mb-2">Contract Addresses</h3>
                <p className="text-white/60 text-sm">
                  Contracts are currently in development. Addresses will be published
                  after security audits are complete.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
