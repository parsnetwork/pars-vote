import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, arbitrum, base, polygon } from 'wagmi/chains'

// Lux Network chain configuration
const lux = {
  id: 7777,
  name: 'Lux Network',
  nativeCurrency: { name: 'LUX', symbol: 'LUX', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.lux.network'] },
  },
  blockExplorers: {
    default: { name: 'Lux Explorer', url: 'https://explore.lux.network' },
  },
} as const

export const wagmiConfig = getDefaultConfig({
  appName: 'PARS Vote',
  projectId: process.env.VITE_WALLET_CONNECT_PROJECT_ID || 'pars-vote',
  chains: [mainnet, arbitrum, base, polygon, lux],
  ssr: false,
})

// Contract addresses
export const CONTRACTS = {
  mainnet: {
    MIGA: '0x0000000000000000000000000000000000000000', // TODO: Deploy
    PARS: '0x0000000000000000000000000000000000000000',
    vePARS: '0x0000000000000000000000000000000000000000',
    Governor: '0x0000000000000000000000000000000000000000',
  },
  arbitrum: {
    MIGA: '0x0000000000000000000000000000000000000000',
    PARS: '0x0000000000000000000000000000000000000000',
    vePARS: '0x0000000000000000000000000000000000000000',
    Governor: '0x0000000000000000000000000000000000000000',
  },
  base: {
    MIGA: '0x0000000000000000000000000000000000000000',
    PARS: '0x0000000000000000000000000000000000000000',
    vePARS: '0x0000000000000000000000000000000000000000',
    Governor: '0x0000000000000000000000000000000000000000',
  },
  polygon: {
    MIGA: '0x0000000000000000000000000000000000000000',
    PARS: '0x0000000000000000000000000000000000000000',
    vePARS: '0x0000000000000000000000000000000000000000',
    Governor: '0x0000000000000000000000000000000000000000',
  },
  lux: {
    MIGA: '0x0000000000000000000000000000000000000000',
    PARS: '0x0000000000000000000000000000000000000000',
    vePARS: '0x0000000000000000000000000000000000000000',
    Governor: '0x0000000000000000000000000000000000000000',
  },
} as const
