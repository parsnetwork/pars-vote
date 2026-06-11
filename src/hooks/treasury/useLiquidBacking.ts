import { useQuery } from '@tanstack/react-query'
import { useTreasuryMetrics } from './useTreasuryMetrics'
import { useTokenSupplyMetrics } from './useTokenSupplyMetrics'

export interface LiquidBackingMetrics {
  liquidBackingPerAsha: number
  liquidBackingPerVeAsha: number
  liquidBacking: number
  backedSupply: number
  currentIndex: number
}

export interface LiquidBackingComparison {
  date: string
  timestamp: number
  liquidBackingPerAsha: number
  liquidBackingPerVeAsha: number
  ashaPrice: number
}

// Mock comparison data
const generateMockComparisonData = (days: number): LiquidBackingComparison[] => {
  const data: LiquidBackingComparison[] = []
  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000

  for (let i = days; i >= 0; i--) {
    const timestamp = now - i * dayMs
    const date = new Date(timestamp).toISOString().split('T')[0]

    // Liquid backing per token starts around $0.80 and grows
    const baseLb = 0.8 + (days - i) * 0.002
    const variation = Math.random() * 0.05 - 0.025

    const liquidBackingPerAsha = baseLb * (1 + variation)
    const currentIndex = 1.2 + (days - i) * 0.001
    const liquidBackingPerVeAsha = liquidBackingPerAsha * currentIndex

    // Price trades at premium to liquid backing
    const premium = 1.1 + Math.random() * 0.1
    const ashaPrice = liquidBackingPerAsha * premium

    data.push({
      date,
      timestamp,
      liquidBackingPerAsha,
      liquidBackingPerVeAsha,
      ashaPrice,
    })
  }

  return data
}

export function useLiquidBackingMetrics() {
  const { data: treasuryMetrics, isLoading: treasuryLoading } = useTreasuryMetrics()
  const { data: supplyMetrics, isLoading: supplyLoading } = useTokenSupplyMetrics()

  return useQuery({
    queryKey: ['liquid-backing-metrics', treasuryMetrics, supplyMetrics],
    queryFn: async (): Promise<LiquidBackingMetrics> => {
      if (!treasuryMetrics || !supplyMetrics) {
        throw new Error('Missing metrics data')
      }

      const liquidBacking = treasuryMetrics.liquidBacking
      const backedSupply = supplyMetrics.backedSupply
      const currentIndex = 1.25 // Mock index value

      const liquidBackingPerAsha = liquidBacking / backedSupply
      const liquidBackingPerVeAsha = liquidBackingPerAsha * currentIndex

      return {
        liquidBackingPerAsha,
        liquidBackingPerVeAsha,
        liquidBacking,
        backedSupply,
        currentIndex,
      }
    },
    enabled: !treasuryLoading && !supplyLoading && !!treasuryMetrics && !!supplyMetrics,
    staleTime: 30000,
  })
}

export function useLiquidBackingPerAsha() {
  const { data: metrics, isLoading, error } = useLiquidBackingMetrics()

  return {
    liquidBackingPerAsha: metrics?.liquidBackingPerAsha ?? null,
    liquidBacking: metrics?.liquidBacking ?? null,
    backedSupply: metrics?.backedSupply ?? null,
    isLoading,
    error,
  }
}

export function useLiquidBackingPerVeAsha() {
  const { data: metrics, isLoading, error } = useLiquidBackingMetrics()

  return {
    liquidBackingPerVeAsha: metrics?.liquidBackingPerVeAsha ?? null,
    liquidBacking: metrics?.liquidBacking ?? null,
    currentIndex: metrics?.currentIndex ?? null,
    backedSupply: metrics?.backedSupply ?? null,
    isLoading,
    error,
  }
}

export function useLiquidBackingComparison(days: number = 30) {
  return useQuery({
    queryKey: ['liquid-backing-comparison', days],
    queryFn: async (): Promise<LiquidBackingComparison[]> => {
      return generateMockComparisonData(days)
    },
    staleTime: 60000,
    enabled: days > 0,
  })
}
