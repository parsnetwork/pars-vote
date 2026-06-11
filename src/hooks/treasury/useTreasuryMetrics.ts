import { useQuery } from '@tanstack/react-query'

// Pars Treasury Contract ABI (subset for metrics) - for future use
// const TREASURY_ABI = [...] as const
// const TREASURY_ADDRESSES: Record<number, `0x${string}`> = {...}

export interface TreasuryMetrics {
  totalReserves: number
  liquidBacking: number
  marketValue: number
  stableAssets: number
  volatileAssets: number
  protocolOwnedLiquidity: number
}

export interface TreasuryHistoricalData {
  date: string
  timestamp: number
  marketStable: number
  marketVolatile: number
  marketPol: number
  marketTotal: number
  liquidStable: number
  liquidVolatile: number
  liquidPol: number
  liquidTotal: number
}

// Mock historical data for development
const generateMockHistoricalData = (days: number): TreasuryHistoricalData[] => {
  const data: TreasuryHistoricalData[] = []
  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000

  for (let i = days; i >= 0; i--) {
    const timestamp = now - i * dayMs
    const date = new Date(timestamp).toISOString().split('T')[0]

    // Simulate growth with some variation
    const baseValue = 500000 + (days - i) * 5000
    const variation = Math.random() * 0.1 - 0.05 // +/- 5%

    const marketStable = baseValue * 0.4 * (1 + variation)
    const marketVolatile = baseValue * 0.35 * (1 + variation)
    const marketPol = baseValue * 0.25 * (1 + variation)
    const marketTotal = marketStable + marketVolatile + marketPol

    // Liquid backing is typically slightly less than market value
    const liquidRatio = 0.85 + Math.random() * 0.1
    const liquidStable = marketStable * liquidRatio
    const liquidVolatile = marketVolatile * liquidRatio
    const liquidPol = marketPol * liquidRatio
    const liquidTotal = liquidStable + liquidVolatile + liquidPol

    data.push({
      date,
      timestamp,
      marketStable,
      marketVolatile,
      marketPol,
      marketTotal,
      liquidStable,
      liquidVolatile,
      liquidPol,
      liquidTotal,
    })
  }

  return data
}

export function useTreasuryMetrics() {
  return useQuery({
    queryKey: ['treasury-metrics'],
    queryFn: async (): Promise<TreasuryMetrics> => {
      // In production, this would read from the treasury contract
      // For now, return mock data based on daos.ts allocations

      // Simulated treasury totals (sum of all DAO vaults from daos.ts)
      const totalReserves = 945000 // Sum of all vaultBalance values
      const liquidBacking = totalReserves * 0.85
      const marketValue = totalReserves * 1.1

      return {
        totalReserves,
        liquidBacking,
        marketValue,
        stableAssets: totalReserves * 0.4,
        volatileAssets: totalReserves * 0.35,
        protocolOwnedLiquidity: totalReserves * 0.25,
      }
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
  })
}

export function useTreasuryHistoricalData(days: number = 30) {
  return useQuery({
    queryKey: ['treasury-historical', days],
    queryFn: async (): Promise<TreasuryHistoricalData[]> => {
      // In production, this would fetch from an indexer/subgraph
      // For now, return mock data
      return generateMockHistoricalData(days)
    },
    staleTime: 60000, // 1 minute
    enabled: days > 0,
  })
}

export function useLiquidBackingLatest() {
  const { data: metrics, isLoading, error } = useTreasuryMetrics()

  return {
    liquidBacking: metrics?.liquidBacking ?? null,
    isLoading,
    error,
  }
}

export function useMarketValueLatest() {
  const { data: metrics, isLoading, error } = useTreasuryMetrics()

  return {
    marketValue: metrics?.marketValue ?? null,
    isLoading,
    error,
  }
}
