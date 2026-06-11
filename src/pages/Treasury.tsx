import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, ArrowRight, Info, Building2 } from 'lucide-react'
import { daos } from '../data/daos'
import { MetricCard, MetricRow } from '../components/charts/MetricCard'
import {
  ChartCard,
  TreasuryComposedChart,
  SupplyBreakdownChart,
  PARS_CHART_COLORS,
  formatCurrency,
  formatNumber,
} from '../components/charts/TreasuryChart'
import {
  useTreasuryMetrics,
  useTreasuryHistoricalData,
} from '../hooks/treasury/useTreasuryMetrics'
import {
  useTokenSupplyMetrics,
  useSupplyHistoricalData,
} from '../hooks/treasury/useTokenSupplyMetrics'
import {
  useLiquidBackingPerAsha,
  useLiquidBackingComparison,
} from '../hooks/treasury/useLiquidBacking'
import { useCurrentIndex, useProtocolMetrics } from '../hooks/treasury/useProtocolMetrics'

type TimeRange = 7 | 30 | 90 | 180
type TokenView = 'ASHA' | 'veASHA'

const TIME_RANGES: { label: string; days: TimeRange }[] = [
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
  { label: '90d', days: 90 },
  { label: 'Max', days: 180 },
]

export function Treasury() {
  const [timeRange, setTimeRange] = useState<TimeRange>(30)
  const [tokenView, setTokenView] = useState<TokenView>('ASHA')
  const [isLiquidBacking, setIsLiquidBacking] = useState(false)

  // Metrics
  const { data: treasuryMetrics } = useTreasuryMetrics()
  const { data: supplyMetrics, isLoading: supplyLoading } = useTokenSupplyMetrics()
  const { liquidBackingPerAsha, isLoading: lbLoading } = useLiquidBackingPerAsha()
  const { currentIndex, isLoading: indexLoading } = useCurrentIndex()
  const { data: protocolMetrics } = useProtocolMetrics()

  // Historical data
  const { data: treasuryHistory, isLoading: historyLoading } = useTreasuryHistoricalData(timeRange)
  const { data: supplyHistory, isLoading: supplyHistoryLoading } = useSupplyHistoricalData(timeRange)
  const { data: lbComparison, isLoading: lbComparisonLoading } = useLiquidBackingComparison(timeRange)

  // Calculate totals from DAO allocations
  const totalTreasuryValue = daos.reduce((sum, dao) => sum + dao.vaultBalance, 0)
  const totalWeeklyFees = daos.reduce((sum, dao) => sum + dao.feeStream7d, 0)

  return (
    <div>
      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pars-gold/10 border border-pars-gold/20 mb-8">
            <BarChart3 className="w-4 h-4 text-pars-gold" />
            <span className="text-pars-gold text-sm font-medium">Protocol Metrics</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Treasury Dashboard</span>
          </h1>

          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Verify protocol health by auditing supply and reserves. All data is sourced
            on-chain from Lux treasury contracts.
          </p>
        </div>
      </section>

      {/* Main Metrics */}
      <section className="py-8 border-t border-white/10">
        <div className="container mx-auto px-4">
          <MetricRow>
            <MetricCard
              label={`${tokenView === 'ASHA' ? 'ASHA' : 'veASHA'} Circulating Supply / Total`}
              value={
                supplyMetrics
                  ? `${formatNumber(supplyMetrics.circulatingSupply)} / ${formatNumber(supplyMetrics.totalSupply)}`
                  : null
              }
              tooltip={`Circulating supply is the quantity of outstanding ${tokenView} not held by the protocol in the treasury. ${tokenView} deployed in Protocol-Owned Liquidity is included in circulating supply.`}
              isLoading={supplyLoading}
            />
            <MetricCard
              label={`Liquid Backing per ${tokenView}`}
              value={liquidBackingPerAsha ? `$${liquidBackingPerAsha.toFixed(2)}` : null}
              tooltip={`Liquid backing is the dollar amount of stablecoins, volatile assets and protocol-owned liquidity in the treasury, divided by backed supply. This represents the intrinsic value per token.`}
              isLoading={lbLoading}
            />
            <MetricCard
              label="Current Index"
              value={currentIndex ? `${currentIndex.toFixed(4)} ASHA` : null}
              tooltip="The current index tracks the amount of ASHA accumulated since the beginning of staking. This represents how much ASHA one would have if they staked and held 1 ASHA from launch."
              isLoading={indexLoading}
            />
          </MetricRow>
        </div>
      </section>

      {/* Time Range & Token Toggle */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Time Range Selector */}
            <div className="flex gap-2">
              {TIME_RANGES.map(({ label, days }) => (
                <button
                  key={days}
                  onClick={() => setTimeRange(days)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    timeRange === days
                      ? 'bg-pars-gold text-black'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Token View Selector */}
            <div className="flex gap-2">
              {(['ASHA', 'veASHA'] as TokenView[]).map((token) => (
                <button
                  key={token}
                  onClick={() => setTokenView(token)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    tokenView === token
                      ? 'bg-pars-gold text-black'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {token}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Liquid Backing Comparison */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <ChartCard
            title={`Liquid Backing per ${tokenView}`}
            subTitle={liquidBackingPerAsha ? `$${liquidBackingPerAsha.toFixed(2)}` : undefined}
            tooltip={`Compares the liquid backing per ${tokenView} against the market price. When price exceeds backing, the protocol is trading at a premium.`}
            isLoading={lbComparisonLoading}
          >
            {lbComparison && (
              <TreasuryComposedChart
                data={lbComparison}
                areaKeys={[
                  {
                    key: tokenView === 'ASHA' ? 'liquidBackingPerAsha' : 'liquidBackingPerVeAsha',
                    name: `Liquid Backing/${tokenView}`,
                    color: PARS_CHART_COLORS.gold,
                  },
                ]}
                lineKeys={[
                  {
                    key: 'ashaPrice',
                    name: `${tokenView} Price`,
                    color: PARS_CHART_COLORS.line,
                  },
                ]}
              />
            )}
          </ChartCard>
        </div>
      </section>

      {/* Treasury Assets */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg text-white/70">Treasury Assets</h2>
            <button
              onClick={() => setIsLiquidBacking(!isLiquidBacking)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                isLiquidBacking
                  ? 'bg-pars-gold text-black'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              {isLiquidBacking ? 'Liquid Backing' : 'Market Value'}
            </button>
          </div>
          <ChartCard
            title={isLiquidBacking ? 'Treasury Liquid Backing' : 'Market Value of Treasury Assets'}
            subTitle={
              treasuryMetrics
                ? formatCurrency(isLiquidBacking ? treasuryMetrics.liquidBacking : treasuryMetrics.marketValue)
                : undefined
            }
            tooltip={
              isLiquidBacking
                ? 'Liquid backing is the dollar amount of stablecoins, volatile assets and protocol-owned liquidity in the treasury, excluding ASHA. This excludes illiquid/vesting assets.'
                : 'Market Value of Treasury Assets is the sum of the value (in dollars) of all assets held by the treasury.'
            }
            isLoading={historyLoading}
          >
            {treasuryHistory && (
              <TreasuryComposedChart
                data={treasuryHistory}
                areaKeys={[
                  {
                    key: isLiquidBacking ? 'liquidStable' : 'marketStable',
                    name: 'Stablecoins',
                    color: PARS_CHART_COLORS.stable,
                  },
                  {
                    key: isLiquidBacking ? 'liquidVolatile' : 'marketVolatile',
                    name: 'Volatile Assets',
                    color: PARS_CHART_COLORS.volatile,
                  },
                  {
                    key: isLiquidBacking ? 'liquidPol' : 'marketPol',
                    name: 'Protocol-Owned Liquidity',
                    color: PARS_CHART_COLORS.pol,
                  },
                ]}
                lineKeys={[
                  {
                    key: isLiquidBacking ? 'marketTotal' : 'liquidTotal',
                    name: isLiquidBacking ? 'Market Value' : 'Liquid Backing',
                    color: PARS_CHART_COLORS.line,
                  },
                ]}
              />
            )}
          </ChartCard>
        </div>
      </section>

      {/* Supply Breakdown */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <ChartCard
            title="ASHA Supply Breakdown"
            subTitle={
              supplyMetrics
                ? `${formatNumber(supplyMetrics.totalSupply)} Total`
                : undefined
            }
            tooltip="This chart visualizes the ASHA supply over time, broken down by category: circulating (external holders), treasury-held, protocol-owned liquidity, and bond deposits."
            isLoading={supplyHistoryLoading}
          >
            {supplyHistory && (
              <SupplyBreakdownChart
                data={supplyHistory}
                dataKeys={[
                  { key: 'circulatingSupply', name: 'Circulating', color: PARS_CHART_COLORS.gold },
                  { key: 'treasury', name: 'Treasury', color: PARS_CHART_COLORS.tan },
                  { key: 'protocolOwnedLiquidity', name: 'Protocol-Owned Liquidity', color: PARS_CHART_COLORS.bronze },
                  { key: 'bondDeposits', name: 'Bond Deposits', color: PARS_CHART_COLORS.copper },
                ]}
              />
            )}
          </ChartCard>
        </div>
      </section>

      {/* Committee Allocations */}
      <section className="py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">
              <span className="gradient-text">Committee Treasury Allocations</span>
            </h2>
            <Link
              to="/dao-network"
              className="inline-flex items-center gap-2 text-pars-gold hover:text-pars-bronze transition-colors text-sm"
            >
              View All DAOs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="glass-card p-4">
              <p className="text-sm text-white/60 mb-1">Total Treasury</p>
              <p className="text-2xl font-bold text-pars-gold">${(totalTreasuryValue / 1000).toFixed(0)}K</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-sm text-white/60 mb-1">Weekly Fee Stream</p>
              <p className="text-2xl font-bold text-pars-gold">${(totalWeeklyFees / 1000).toFixed(1)}K</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-sm text-white/60 mb-1">Active Committees</p>
              <p className="text-2xl font-bold text-pars-gold">{daos.length}</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-sm text-white/60 mb-1">Runway</p>
              <p className="text-2xl font-bold text-pars-gold">
                {protocolMetrics?.runway ?? '---'} days
              </p>
            </div>
          </div>

          {/* Committee Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {daos.map((dao) => (
              <Link
                key={dao.id}
                to={`/dao-network/${dao.id}`}
                className="glass-card p-4 hover:border-pars-gold transition-colors group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-4 h-4 text-pars-gold" />
                  <span className="text-sm font-medium truncate">{dao.name}</span>
                </div>
                <p className="text-xs text-white/50 mb-1">{dao.persian}</p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-lg font-bold text-pars-gold">
                      ${(dao.vaultBalance / 1000).toFixed(0)}K
                    </p>
                    <p className="text-xs text-white/50">{dao.treasuryAllocation}% allocation</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/70">
                      ${(dao.feeStream7d / 1000).toFixed(1)}K
                    </p>
                    <p className="text-xs text-white/50">7d fees</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Protocol Health */}
      <section className="py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">
            <span className="gradient-text">Protocol Health</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-pars-gold" />
                <h3 className="font-semibold">APY</h3>
              </div>
              <p className="text-3xl font-bold text-pars-gold mb-2">
                {protocolMetrics?.apy ? `${protocolMetrics.apy.toFixed(0)}%` : '---'}
              </p>
              <p className="text-sm text-white/50">
                Annualized staking rewards based on current rebase rate
              </p>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-pars-gold" />
                <h3 className="font-semibold">Total Value Locked</h3>
              </div>
              <p className="text-3xl font-bold text-pars-gold mb-2">
                {protocolMetrics?.tvl ? formatCurrency(protocolMetrics.tvl) : '---'}
              </p>
              <p className="text-sm text-white/50">
                Total ASHA staked in veASHA contracts
              </p>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-pars-gold" />
                <h3 className="font-semibold">Rebase Rate</h3>
              </div>
              <p className="text-3xl font-bold text-pars-gold mb-2">
                {protocolMetrics?.rebaseRate
                  ? `${(protocolMetrics.rebaseRate * 100).toFixed(3)}%`
                  : '---'}
              </p>
              <p className="text-sm text-white/50">
                Rate per rebase (every 8 hours)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section className="py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">Data Sources</h3>
            <p className="text-white/60 text-sm mb-4">
              All metrics are sourced directly from on-chain data. Treasury contracts are deployed on Lux Network
              with bridged assets tracked across Ethereum, Pars Network, and Solana.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <a
                href="https://explorer.lux.network"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pars-gold hover:text-pars-bronze transition-colors"
              >
                Lux Explorer
              </a>
              <a
                href="#"
                className="text-pars-gold hover:text-pars-bronze transition-colors"
              >
                Treasury Contracts
              </a>
              <a
                href="#"
                className="text-pars-gold hover:text-pars-bronze transition-colors"
              >
                Subgraph API
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
