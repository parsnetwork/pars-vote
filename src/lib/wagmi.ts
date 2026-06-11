import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, arbitrum, base, polygon } from 'wagmi/chains'

// Local Anvil (for E2E testing)
const localhost = {
  id: 96370,
  name: 'Localhost (Anvil)',
  nativeCurrency: { name: 'LUX', symbol: 'LUX', decimals: 18 },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
  },
  testnet: true,
} as const

// Lux Network chain configurations
const luxMainnet = {
  id: 96369,
  name: 'Lux Network',
  nativeCurrency: { name: 'LUX', symbol: 'LUX', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.lux.network/ext/bc/C/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Lux Explorer', url: 'https://explore.lux.network' },
  },
} as const

const luxDevnet = {
  id: 96370,
  name: 'Lux Devnet',
  nativeCurrency: { name: 'LUX', symbol: 'LUX', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.lux-dev.network/ext/bc/C/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Lux Explorer', url: 'https://explore.lux-dev.network' },
  },
  testnet: true,
} as const

// Use localhost for development, devnet for staging
const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost'

export const wagmiConfig = getDefaultConfig({
  appName: 'PARS Vote',
  projectId: process.env.VITE_WALLET_CONNECT_PROJECT_ID || 'pars-vote',
  chains: isDev ? [localhost, luxDevnet, luxMainnet, mainnet, arbitrum, base, polygon] : [luxDevnet, luxMainnet, mainnet, arbitrum, base, polygon],
  ssr: false,
})

// Contract addresses - Local Anvil (for E2E testing)
export const CONTRACTS_LOCAL = {
  ASHA: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  veASHA: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  Governor: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  VotesToken: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', // Same as veASHA
  vLUX: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', // Same as veASHA for testing
} as const

// Contract addresses - Lux Devnet (Chain ID: 96370)
export const CONTRACTS = {
  luxDevnet: {
    // Core Governance
    Governor: isDev ? CONTRACTS_LOCAL.Governor : '0x6fc44509a32E513bE1aa00d27bb298e63830C6A8',
    Timelock: '0x80f3bd0Bdf7861487dDDA61bc651243ecB8B5072',
    VotingLUX: '0x43222597839515180E7aD564C94a3b5c16EB987C',
    vLUX: isDev ? CONTRACTS_LOCAL.vLUX : '0x91954cf6866d557C5CA1D2f384D204bcE9DFfd5a',
    DLUX: '0x316520ca05eaC5d2418F562a116091F1b22Bf6e0',
    Karma: '0x97c265001EB088E1dE2F77A13a62B708014c9e68',
    GaugeController: '0x26328AC03d07BD9A7Caaafbde39F9b56B5449240',
    Strategy: '0x4EC24Da7d598CAC1540F2E8078D05869e36a4ef1',
    VotesToken: isDev ? CONTRACTS_LOCAL.VotesToken : '0xE77E1cB5E303ed0EcB10d0d13914AaA2ED9B3b8C',
    // Sub-DAOs for Pars
    MIGASubDAO: '0x0000000000000000000000000000000000000000', // TODO: Deploy
    CYRUSSubDAO: '0x0000000000000000000000000000000000000000', // TODO: Deploy
    // Core Tokens
    WLUX: '0xc65ea8882020Af7CDa7854d590C6Fcd34BF364ec',
    StakedLUX: '0x191067f88d61f9506555E88CEab9CF71deeD61A9',
    ASHA: isDev ? CONTRACTS_LOCAL.ASHA : '0x0000000000000000000000000000000000000000',
    veASHA: isDev ? CONTRACTS_LOCAL.veASHA : '0x0000000000000000000000000000000000000000',
    USDC: '0x0000000000000000000000000000000000000000', // TODO: Deploy/bridge USDC
    // DeFi
    Markets: '0x6fc44509a32E513bE1aa00d27bb298e63830C6A8',
    Perp: '0xb2ee1CE7b84853b83AA08702aD0aD4D79711882D',
    StableSwapFactory: '0xb2ee1CE7b84853b83AA08702aD0aD4D79711882D',
    Options: '0xac604Fd2F423Ea738de9C0d6Eb03eBA6F90b63FB',
    Streams: '0xd9e69a0A38BF48898456170CB3B4451cBaF5F597',
    IntentRouter: '0x5ED08c64FbF027966C04E6fc87E6b58a91De4dB2',
    Cover: '0x92d057F8B4132Ca8Aa237fbd4C41F9c57079582E',
    // Treasury
    TreasuryRouter: '0xF9aEC94ED6F098509EbCD5690AE2Cb126cd8a3Ee',
    // Bonds (OlympusDAO-style)
    Bond: '0x0000000000000000000000000000000000000000', // TODO: Deploy Bond.sol
    BondDepository: '0x0000000000000000000000000000000000000000', // TODO: Deploy
    BondTeller: '0x0000000000000000000000000000000000000000', // TODO: Deploy
  },
  luxMainnet: {
    Governor: '0x0000000000000000000000000000000000000000', // TODO: Deploy to mainnet
    Timelock: '0x0000000000000000000000000000000000000000',
    VotingLUX: '0x0000000000000000000000000000000000000000',
    vLUX: '0x0000000000000000000000000000000000000000',
    DLUX: '0x0000000000000000000000000000000000000000',
    ASHA: '0x0000000000000000000000000000000000000000',
    veASHA: '0x0000000000000000000000000000000000000000',
    USDC: '0x0000000000000000000000000000000000000000',
    Bond: '0x0000000000000000000000000000000000000000',
    BondDepository: '0x0000000000000000000000000000000000000000',
    BondTeller: '0x0000000000000000000000000000000000000000',
  },
  mainnet: {
    MIGASubDAO: '0x0000000000000000000000000000000000000000', // TODO: Deploy
    CYRUSSubDAO: '0x0000000000000000000000000000000000000000', // TODO: Deploy
    PARS: '0x0000000000000000000000000000000000000000',
    vePARS: '0x0000000000000000000000000000000000000000',
    Governor: '0x0000000000000000000000000000000000000000',
  },
  arbitrum: {
    MIGASubDAO: '0x0000000000000000000000000000000000000000',
    CYRUSSubDAO: '0x0000000000000000000000000000000000000000',
    PARS: '0x0000000000000000000000000000000000000000',
    vePARS: '0x0000000000000000000000000000000000000000',
    Governor: '0x0000000000000000000000000000000000000000',
  },
  base: {
    MIGASubDAO: '0x0000000000000000000000000000000000000000',
    CYRUSSubDAO: '0x0000000000000000000000000000000000000000',
    PARS: '0x0000000000000000000000000000000000000000',
    vePARS: '0x0000000000000000000000000000000000000000',
    Governor: '0x0000000000000000000000000000000000000000',
  },
  polygon: {
    MIGASubDAO: '0x0000000000000000000000000000000000000000',
    CYRUSSubDAO: '0x0000000000000000000000000000000000000000',
    PARS: '0x0000000000000000000000000000000000000000',
    vePARS: '0x0000000000000000000000000000000000000000',
    Governor: '0x0000000000000000000000000000000000000000',
  },
} as const

// SubDAO ABI for MIGA and CYRUS
export const SubDAOABI = [
  {
    type: 'function',
    name: 'name',
    inputs: [],
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'mainDAO',
    inputs: [],
    outputs: [{ type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'proposalCount',
    inputs: [],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'quorumPercentage',
    inputs: [],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'votingPeriod',
    inputs: [],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'propose',
    inputs: [{ name: 'description', type: 'string' }],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'castVote',
    inputs: [
      { name: 'proposalId', type: 'uint256' },
      { name: 'support', type: 'uint8' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'execute',
    inputs: [{ name: 'proposalId', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'cancel',
    inputs: [{ name: 'proposalId', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'state',
    inputs: [{ name: 'proposalId', type: 'uint256' }],
    outputs: [{ type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getProposal',
    inputs: [{ name: 'proposalId', type: 'uint256' }],
    outputs: [
      { name: 'proposer', type: 'address' },
      { name: 'description', type: 'string' },
      { name: 'forVotes', type: 'uint256' },
      { name: 'againstVotes', type: 'uint256' },
      { name: 'abstainVotes', type: 'uint256' },
      { name: 'startBlock', type: 'uint256' },
      { name: 'endBlock', type: 'uint256' },
      { name: 'canceled', type: 'bool' },
      { name: 'executed', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'ProposalCreated',
    inputs: [
      { name: 'proposalId', type: 'uint256', indexed: true },
      { name: 'proposer', type: 'address', indexed: true },
      { name: 'description', type: 'string', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'VoteCast',
    inputs: [
      { name: 'proposalId', type: 'uint256', indexed: true },
      { name: 'voter', type: 'address', indexed: true },
      { name: 'support', type: 'uint8', indexed: false },
      { name: 'weight', type: 'uint256', indexed: false },
    ],
  },
] as const
