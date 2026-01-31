import { Link } from 'react-router-dom'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { daos } from '../data/daos'

export function Home() {
  const totalTreasury = daos.reduce((acc, dao) => acc + dao.vaultBalance, 0)
  const activeProposals = daos.reduce(
    (acc, dao) => acc + dao.proposals.filter((p) => p.status === 'active').length,
    0
  )

  return (
    <div className="min-h-screen">
      {/* Hero - Brutalist */}
      <section className="border-b border-white/20 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <p className="font-mono text-xs tracking-widest text-white/40 mb-4 uppercase">
              Pars Protocol Governance
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-[0.9]">
              <span className="text-white">VOTE.</span>
              <br />
              <span className="text-pars-gold">GOVERN.</span>
              <br />
              <span className="text-white/60">BUILD.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mb-8 font-light">
              Ten committees. One protocol. Direct democracy for the Persian diaspora.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/staking"
                className="inline-flex items-center gap-2 px-6 py-3 bg-pars-gold text-black font-bold uppercase tracking-wider text-sm hover:bg-white transition-colors"
              >
                Stake ASHA
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/governance"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-bold uppercase tracking-wider text-sm hover:bg-white hover:text-black transition-colors"
              >
                View Proposals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar - Brutalist */}
      <section className="border-b border-white/20 py-6 bg-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between gap-8 font-mono text-sm">
            <div>
              <span className="text-white/40 uppercase tracking-wider">Committees</span>
              <span className="text-white font-bold ml-2">10</span>
            </div>
            <div>
              <span className="text-white/40 uppercase tracking-wider">Treasury</span>
              <span className="text-pars-gold font-bold ml-2">
                ${(totalTreasury / 1000).toFixed(0)}K
              </span>
            </div>
            <div>
              <span className="text-white/40 uppercase tracking-wider">Active</span>
              <span className="text-green-400 font-bold ml-2">{activeProposals}</span>
            </div>
            <div>
              <span className="text-white/40 uppercase tracking-wider">Chain</span>
              <span className="text-white font-bold ml-2">494949</span>
            </div>
          </div>
        </div>
      </section>

      {/* Committees Grid - Brutalist */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-baseline justify-between mb-8 border-b border-white/20 pb-4">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
              Committees
            </h2>
            <Link
              to="/dao-network"
              className="font-mono text-xs text-white/40 hover:text-pars-gold uppercase tracking-wider flex items-center gap-1"
            >
              View All <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0 border border-white/20">
            {daos.map((dao, index) => (
              <Link
                key={dao.id}
                to={`/dao-network/${dao.id}`}
                className={`
                  group p-6 border-white/20 hover:bg-white/5 transition-colors
                  ${index % 5 !== 4 ? 'lg:border-r' : ''}
                  ${index < 5 ? 'lg:border-b' : ''}
                  ${index % 2 === 0 ? 'md:border-r lg:border-r-0' : ''}
                  ${index < 8 ? 'md:border-b lg:border-b-0' : ''}
                  ${index < 5 ? '' : 'lg:border-b-0'}
                `}
                style={{
                  borderRightWidth: index % 5 !== 4 ? '1px' : '0',
                  borderBottomWidth: index < 5 ? '1px' : '0',
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="font-mono text-xs text-pars-gold font-bold">
                    {dao.treasuryAllocation}%
                  </span>
                </div>

                <h3 className="font-bold text-white group-hover:text-pars-gold transition-colors mb-1 text-sm uppercase tracking-wide">
                  {dao.name.replace(' Committee', '')}
                </h3>
                <p className="font-mono text-xs text-white/40 mb-4">{dao.persian}</p>

                <div className="font-mono text-[10px] text-white/30 space-y-1">
                  <div>
                    <span className="uppercase">Vault:</span>{' '}
                    <span className="text-white/60">${(dao.vaultBalance / 1000).toFixed(0)}K</span>
                  </div>
                  {dao.proposals.filter((p) => p.status === 'active').length > 0 && (
                    <div className="text-green-400">
                      {dao.proposals.filter((p) => p.status === 'active').length} ACTIVE
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* veASHA Section - Brutalist */}
      <section className="border-t border-white/20 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-4">
              Governance Power
            </p>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-6">
              veASHA
            </h2>
            <div className="bg-black border-2 border-pars-gold p-6 mb-8 font-mono">
              <code className="text-pars-gold text-lg md:text-xl">
                veASHA = ASHA × √(karma/100) × (1 + lock_months × 0.1)
              </code>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="border-l-2 border-white/20 pl-4">
                <h3 className="font-bold uppercase tracking-wide text-sm mb-2">Snapshot</h3>
                <p className="text-white/60 text-sm">
                  Votes weighted by veASHA at proposal creation.
                </p>
              </div>
              <div className="border-l-2 border-pars-gold pl-4">
                <h3 className="font-bold uppercase tracking-wide text-sm mb-2">Karma</h3>
                <p className="text-white/60 text-sm">
                  Active participation increases voting power.
                </p>
              </div>
              <div className="border-l-2 border-white/20 pl-4">
                <h3 className="font-bold uppercase tracking-wide text-sm mb-2">Time-Lock</h3>
                <p className="text-white/60 text-sm">
                  Longer locks demonstrate commitment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions - Brutalist */}
      <section className="border-t border-white/20 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-0 border border-white/20">
            <Link
              to="/staking"
              className="group p-8 border-b md:border-b-0 md:border-r border-white/20 hover:bg-pars-gold hover:text-black transition-colors"
            >
              <span className="font-mono text-[10px] text-current opacity-40 uppercase tracking-widest block mb-4">
                01
              </span>
              <h3 className="text-xl font-black uppercase tracking-tight mb-2">Stake</h3>
              <p className="text-sm opacity-60">Lock ASHA → Get veASHA</p>
            </Link>
            <Link
              to="/governance"
              className="group p-8 border-b md:border-b-0 md:border-r border-white/20 hover:bg-pars-gold hover:text-black transition-colors"
            >
              <span className="font-mono text-[10px] text-current opacity-40 uppercase tracking-widest block mb-4">
                02
              </span>
              <h3 className="text-xl font-black uppercase tracking-tight mb-2">Vote</h3>
              <p className="text-sm opacity-60">Cast votes on proposals</p>
            </Link>
            <Link
              to="/governance"
              className="group p-8 hover:bg-pars-gold hover:text-black transition-colors"
            >
              <span className="font-mono text-[10px] text-current opacity-40 uppercase tracking-widest block mb-4">
                03
              </span>
              <h3 className="text-xl font-black uppercase tracking-tight mb-2">Propose</h3>
              <p className="text-sm opacity-60">Submit new PIPs</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer CTA - Brutalist */}
      <section className="border-t border-white/20 py-16 bg-white/5">
        <div className="container mx-auto px-4 text-center">
          <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-4">
            پارس
          </p>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-6">
            Your protocol. Your vote.
          </h2>
          <div className="flex flex-wrap justify-center gap-4 font-mono text-xs">
            <a
              href="https://docs.pars.vote"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-pars-gold uppercase tracking-wider"
            >
              Docs
            </a>
            <span className="text-white/20">|</span>
            <a
              href="https://github.com/parsdao/pips"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-pars-gold uppercase tracking-wider"
            >
              PIPs
            </a>
            <span className="text-white/20">|</span>
            <a
              href="https://github.com/orgs/parsdao/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-pars-gold uppercase tracking-wider"
            >
              Discussions
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
