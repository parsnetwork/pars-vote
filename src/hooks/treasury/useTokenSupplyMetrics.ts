import { useQuery } from '@tanstack/react-query'

// ASHA Token Contract ABI (subset for supply metrics) - for future use
// const ASHA_TOKEN_ABI = [...] as const

export interface TokenSupplyMetrics {
  totalSupply: number
  circulatingSupply: number
  backedSupply: number
  floatingSupply: number
  treasuryHeld: number
  bondDeposits: number
  protocolOwnedLiquidity: number
}

export interface SupplyBreakdown {
  category: string
  amount: number
  percentage: number
  color: string
}

export interface SupplyHistoricalData {
  date: string
  timestamp: number
  totalSupply: number
  circulatingSupply: number
  backedSupply: number
  floatingSupply: number
  treasury: number
  protocolOwnedLiquidity: number
  bondDeposits: number
}

// Mock historical supply data
const generateMockSupplyHistory = (days: number): SupplyHistoricalData[] => {
  const data: SupplyHistoricalData[] = []
  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000

  for (let i = days; i >= 0; i--) {
    const timestamp = now - i * dayMs
    const date = new Date(timestamp).toISOString().split('T')[0]

    // Base supply grows slowly over time
    const baseSupply = 1000000 + (days - i) * 1000
    const variation = Math.random() * 0.02 - 0.01

    const totalSupply = baseSupply * (1 + variation)
    const treasury = totalSupply * 0.15
    const protocolOwnedLiquidity = totalSupply * 0.08
    const bondDeposits = totalSupply * 0.05
    const circulatingSupply = totalSupply - treasury - protocolOwnedLiquidity - bondDeposits
    const backedSupply = circulatingSupply * 0.95
    const floatingSupply = circulatingSupply * 0.9

    data.push({
      date,
      timestamp,
      totalSupply,
      circulatingSupply,
      backedSupply,
      floatingSupply,
      treasury,
      protocolOwnedLiquidity,
      bondDeposits,
    })
  }

  return data
}

export function useTokenSupplyMetrics() {
  return useQuery({
    queryKey: ['token-supply-metrics'],
    queryFn: async (): Promise<TokenSupplyMetrics> => {
      // In production, read from ASHA token contract
      // For now, return mock data
      const totalSupply = 1000000
      const treasuryHeld = totalSupply * 0.15
      const protocolOwnedLiquidity = totalSupply * 0.08
      const bondDeposits = totalSupply * 0.05
      const circulatingSupply = totalSupply - treasuryHeld - protocolOwnedLiquidity - bondDeposits
      const backedSupply = circulatingSupply * 0.95
      const floatingSupply = circulatingSupply * 0.9

      return {
        totalSupply,
        circulatingSupply,
        backedSupply,
        floatingSupply,
        treasuryHeld,
        bondDeposits,
        protocolOwnedLiquidity,
      }
    },
    staleTime: 30000,
    refetchInterval: 60000,
  })
}

export function useSupplyBreakdown() {
  const { data: metrics, isLoading, error } = useTokenSupplyMetrics()

  const breakdown: SupplyBreakdown[] = metrics ? [
    { category: 'Circulating', amount: metrics.circulatingSupply, percentage: (metrics.circulatingSupply / metrics.totalSupply) * 100, color: '#D4AF37' },
    { category: 'Treasury', amount: metrics.treasuryHeld, percentage: (metrics.treasuryHeld / metrics.totalSupply) * 100, color: '#8B7355' },
    { category: 'Protocol-Owned Liquidity', amount: metrics.protocolOwnedLiquidity, percentage: (metrics.protocolOwnedLiquidity / metrics.totalSupply) * 100, color: '#CD7F32' },
    { category: 'Bond Deposits', amount: metrics.bondDeposits, percentage: (metrics.bondDeposits / metrics.totalSupply) * 100, color: '#B8860B' },
  ] : []

  return {
    breakdown,
    isLoading,
    error,
  }
}

export function useSupplyHistoricalData(days: number = 30) {
  return useQuery({
    queryKey: ['supply-historical', days],
    queryFn: async (): Promise<SupplyHistoricalData[]> => {
      return generateMockSupplyHistory(days)
    },
    staleTime: 60000,
    enabled: days > 0,
  })
}

export function useCirculatingSupply() {
  const { data: metrics, isLoading, error } = useTokenSupplyMetrics()

  return {
    circulatingSupply: metrics?.circulatingSupply ?? null,
    totalSupply: metrics?.totalSupply ?? null,
    isLoading,
    error,
  }
}

export function useBackedSupply() {
  const { data: metrics, isLoading, error } = useTokenSupplyMetrics()

  return {
    backedSupply: metrics?.backedSupply ?? null,
    isLoading,
    error,
  }
}
