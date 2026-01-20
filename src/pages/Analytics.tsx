import { BarChart3, TrendingUp, Users, Vote, Activity, PieChart } from 'lucide-react'

const stats = [
  { label: 'Total Proposals', value: '4', icon: Vote, change: '+2 this month' },
  { label: 'Unique Voters', value: '0', icon: Users, change: '---' },
  { label: 'Avg Participation', value: '0%', icon: Activity, change: '---' },
  { label: 'vePARS Staked', value: '$0', icon: TrendingUp, change: '---' },
]

const daoParticipation = [
  { name: 'KHAZ (Treasury)', participation: 0, proposals: 0 },
  { name: 'WAQF (Endowment)', participation: 0, proposals: 0 },
  { name: 'SAL (Health)', participation: 0, proposals: 1 },
  { name: 'DAN (Research)', participation: 0, proposals: 0 },
  { name: 'SAZ (Infrastructure)', participation: 0, proposals: 1 },
  { name: 'FARH (Culture)', participation: 0, proposals: 1 },
  { name: 'AMN (Security)', participation: 0, proposals: 1 },
  { name: 'DAD (Governance)', participation: 0, proposals: 0 },
  { name: 'MIZ (Integrity)', participation: 0, proposals: 0 },
  { name: 'PAY (Consular)', participation: 0, proposals: 0 },
]

export function Analytics() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="gradient-text">Governance Analytics</span>
            </h1>
            <p className="text-white/60">
              Track voting patterns, participation rates, and governance health.
            </p>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className="w-5 h-5 text-pars-gold" />
                  <span className="text-white/60 text-sm">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                <p className="text-xs text-pars-gold mt-1">{stat.change}</p>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Voting Activity */}
            <div className="glass-card p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-pars-gold" />
                Voting Activity (Last 30 Days)
              </h2>
              <div className="h-48 flex items-end justify-around gap-2">
                {[0, 0, 0, 0, 0, 0, 0].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-gradient-to-t from-pars-gold to-pars-bronze rounded-t"
                      style={{ height: `${height}%`, minHeight: '4px' }}
                    />
                    <span className="text-xs text-white/40">W{i + 1}</span>
                  </div>
                ))}
              </div>
              <p className="text-center text-white/40 text-sm mt-4">No voting activity yet</p>
            </div>

            {/* Proposal Distribution */}
            <div className="glass-card p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-pars-gold" />
                Proposal Status Distribution
              </h2>
              <div className="flex items-center justify-center h-48">
                <div className="relative w-40 h-40">
                  <div className="absolute inset-0 rounded-full border-8 border-blue-400/30" />
                  <div className="absolute inset-0 rounded-full border-8 border-green-400/30 border-t-transparent border-l-transparent rotate-90" />
                  <div className="absolute inset-0 rounded-full border-8 border-yellow-400/30 border-t-transparent border-l-transparent border-b-transparent -rotate-45" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">4</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-blue-400" />
                  Active (2)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-green-400" />
                  Passed (1)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  Pending (1)
                </span>
              </div>
            </div>
          </div>

          {/* DAO Participation */}
          <div className="glass-card p-6">
            <h2 className="font-semibold mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-pars-gold" />
              DAO Participation Rates
            </h2>
            <div className="space-y-4">
              {daoParticipation.map((dao) => (
                <div key={dao.name} className="flex items-center gap-4">
                  <span className="w-40 text-sm text-white/70">{dao.name}</span>
                  <div className="flex-1 h-4 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pars-gold to-pars-bronze rounded-full"
                      style={{ width: `${dao.participation}%`, minWidth: dao.participation > 0 ? '4px' : '0' }}
                    />
                  </div>
                  <span className="w-12 text-right text-sm">{dao.participation}%</span>
                  <span className="w-20 text-right text-xs text-white/40">{dao.proposals} proposals</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
