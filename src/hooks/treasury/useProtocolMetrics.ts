import { useQuery } from '@tanstack/react-query'

export interface ProtocolMetrics {
  currentIndex: number
  nextRebaseTimestamp: number
  rebaseRate: number
  apy: number
  tvl: number
  runway: number // Days until depletion at current emission
}

export interface ProtocolHistoricalData {
  date: string
  timestamp: number
  index: number
  apy: number
  tvl: number
  runway: number
}

// Mock historical protocol data
const generateMockProtocolHistory = (days: number): ProtocolHistoricalData[] => {
  const data: ProtocolHistoricalData[] = []
  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000

  for (let i = days; i >= 0; i--) {
    const timestamp = now - i * dayMs
    const date = new Date(timestamp).toISOString().split('T')[0]

    // Index grows slowly (rebasing)
    const index = 1.0 + (days - i) * 0.005

    // APY decreases over time as protocol matures
    const baseApy = 500 - (days - i) * 2
    const apy = Math.max(baseApy + Math.random() * 20 - 10, 50)

    // TVL grows
    const baseTvl = 500000 + (days - i) * 10000
    const tvl = baseTvl * (1 + Math.random() * 0.05 - 0.025)

    // Runway in days
    const runway = 300 + (days - i) * 1

    data.push({
      date,
      timestamp,
      index,
      apy,
      tvl,
      runway,
    })
  }

  return data
}

export function useProtocolMetrics() {
  return useQuery({
    queryKey: ['protocol-metrics'],
    queryFn: async (): Promise<ProtocolMetrics> => {
      // In production, read from staking contract
      // For now, return mock data
      return {
        currentIndex: 1.25,
        nextRebaseTimestamp: Date.now() + 8 * 60 * 60 * 1000, // 8 hours from now
        rebaseRate: 0.003, // 0.3% per rebase
        apy: 180, // 180% APY
        tvl: 850000,
        runway: 350, // 350 days
      }
    },
    staleTime: 30000,
    refetchInterval: 60000,
  })
}

export function useCurrentIndex() {
  const { data: metrics, isLoading, error } = useProtocolMetrics()

  return {
    currentIndex: metrics?.currentIndex ?? null,
    isLoading,
    error,
  }
}

export function useNextRebase() {
  const { data: metrics, isLoading, error } = useProtocolMetrics()

  const timeUntilRebase = metrics
    ? Math.max(0, metrics.nextRebaseTimestamp - Date.now())
    : null

  return {
    nextRebaseTimestamp: metrics?.nextRebaseTimestamp ?? null,
    timeUntilRebase,
    rebaseRate: metrics?.rebaseRate ?? null,
    isLoading,
    error,
  }
}

export function useRunway() {
  const { data: metrics, isLoading, error } = useProtocolMetrics()

  return {
    runway: metrics?.runway ?? null,
    isLoading,
    error,
  }
}

export function useProtocolHistoricalData(days: number = 30) {
  return useQuery({
    queryKey: ['protocol-historical', days],
    queryFn: async (): Promise<ProtocolHistoricalData[]> => {
      return generateMockProtocolHistory(days)
    },
    staleTime: 60000,
    enabled: days > 0,
  })
}

export function useTotalValueLocked() {
  const { data: metrics, isLoading, error } = useProtocolMetrics()

  return {
    tvl: metrics?.tvl ?? null,
    isLoading,
    error,
  }
}
