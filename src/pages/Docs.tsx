import { ExternalLink, Book, Code, Shield, Coins, Vote, Users, Lock, FileText } from 'lucide-react'

const docs = [
  {
    icon: Book,
    title: 'User Guide',
    description: 'Getting started with PARS governance, staking ASHA, and voting on proposals.',
    href: 'https://docs.lux.network/dao/guide',
  },
  {
    icon: Lock,
    title: 'ASHA & Staking',
    description: 'Learn about ASHA bonding mechanics, veASHA governance power, and staking rewards.',
    href: 'https://docs.lux.network/dao/guide/staking',
  },
  {
    icon: Vote,
    title: 'Governance',
    description: 'Voting mechanics, delegation, proposal creation, and Sub-DAO governance.',
    href: 'https://docs.lux.network/dao/guide/voting',
  },
  {
    icon: FileText,
    title: 'Proposals',
    description: 'How to create and submit proposals: action-based, templates, and custom.',
    href: 'https://docs.lux.network/dao/guide/resolutions',
  },
  {
    icon: Coins,
    title: 'Treasury',
    description: 'Working Treasury, Endowment, committee budgets, and fund management.',
    href: 'https://docs.lux.network/dao/guide/hierarchy',
  },
  {
    icon: Shield,
    title: 'Security',
    description: 'Audit reports, emergency procedures, and security best practices.',
    href: 'https://docs.lux.network/dao/learn-more/audit',
  },
  {
    icon: Users,
    title: 'Committees',
    description: 'PARS-10 committee structure, roles, and how to participate.',
    href: 'https://docs.lux.network/pars/committees',
  },
  {
    icon: Code,
    title: 'Developer Docs',
    description: 'Smart contract interfaces, SDK documentation, and integration guides.',
    href: 'https://docs.lux.network/standard',
  },
]

export function Docs() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="gradient-text">Documentation</span>
          </h1>
          <p className="text-white/60 mb-8">
            Learn about ASHA staking, veASHA governance, and how to participate in PARS governance.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {docs.map((doc) => (
              <a
                key={doc.title}
                href={doc.href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-5 hover:border-pars-gold/30 transition-all group"
              >
                <doc.icon className="w-8 h-8 text-pars-gold mb-3 group-hover:scale-110 transition-transform" />
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">{doc.title}</h3>
                  <ExternalLink className="w-3 h-3 text-white/40 group-hover:text-pars-gold transition-colors" />
                </div>
                <p className="text-white/60 text-sm">{doc.description}</p>
              </a>
            ))}
          </div>

          {/* Quick Reference */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-6">Quick Reference</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-pars-gold mb-2">veASHA Formula</h3>
                <code className="block bg-pars-deep p-4 rounded-lg text-sm">
                  veASHA = ASHA × √(karma/100) × (1 + lock_months × 0.1)
                </code>
                <p className="text-white/50 text-xs mt-2">
                  Lock duration ranges from 1-24 months. Karma is earned through active participation.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-pars-gold mb-2">ASHA Bonding (OHM Model)</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-pars-deep p-4 rounded-lg">
                    <p className="font-semibold text-sm mb-1">Bond CYRUS</p>
                    <p className="text-white/60 text-xs">
                      Bond CYRUS tokens to mint ASHA at a discount. 5-day vesting. cyrus.money
                    </p>
                  </div>
                  <div className="bg-pars-deep p-4 rounded-lg">
                    <p className="font-semibold text-sm mb-1">Bond PARS</p>
                    <p className="text-white/60 text-xs">
                      Bond PARS tokens to mint ASHA at a discount. 5-day vesting. pars.network
                    </p>
                  </div>
                  <div className="bg-pars-deep p-4 rounded-lg">
                    <p className="font-semibold text-sm mb-1">Bond MIGA</p>
                    <p className="text-white/60 text-xs">
                      Bond MIGA tokens to mint ASHA at a discount. 5-day vesting. migaprotocol.xyz
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-pars-gold mb-2">Supported Chains</h3>
                <div className="flex flex-wrap gap-2">
                  {['Lux Network', 'Ethereum', 'Arbitrum', 'Base', 'Polygon'].map((chain) => (
                    <span key={chain} className="px-3 py-1 bg-pars-deep rounded-full text-sm">
                      {chain}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-pars-gold mb-2">Key Contracts</h3>
                <div className="bg-pars-deep p-4 rounded-lg space-y-2 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/60">ASHA Token:</span>
                    <span className="text-white/80">Deploying...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">veASHA Staking:</span>
                    <span className="text-white/80">Deploying...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Bond Depository:</span>
                    <span className="text-white/80">Deploying...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Governor:</span>
                    <span className="text-white/80">Deploying...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
