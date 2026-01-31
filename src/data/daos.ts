export interface DAO {
  id: string
  name: string
  persian: string
  symbol: string
  focus: string
  description: string
  mandate: string
  treasuryAllocation: number
  vaultBalance: number
  feeStream7d: number
  baseSplit: number
  spendTimelock: string
  owns: { name: string; description: string }[]
  outputs: { name: string; frequency: string; description: string }[]
  proposals: Proposal[]
}

export interface Proposal {
  id: string
  pip: string
  title: string
  status: 'active' | 'passed' | 'rejected' | 'pending'
  votesFor: number
  votesAgainst: number
  endTime: string
  discussionUrl?: string
}

export const daos: DAO[] = [
  {
    id: 'security',
    name: 'Security Committee',
    persian: 'کمیته امن',
    symbol: 'AMN',
    focus: 'Security & Infrastructure',
    description: 'Protects protocol security, manages audits, and oversees infrastructure.',
    mandate: 'Secure infrastructure and cryptographic operations for the protocol.',
    treasuryAllocation: 15,
    vaultBalance: 135000,
    feeStream7d: 2700,
    baseSplit: 1.5,
    spendTimelock: '24-72h',
    owns: [
      { name: 'Audit Fund', description: 'Funds for security audits and bug bounties' },
      { name: 'Infrastructure Reserve', description: 'Node and validator operations' },
      { name: 'Emergency Response', description: 'Rapid response to security incidents' },
    ],
    outputs: [
      { name: 'Security Audits', frequency: 'Quarterly', description: 'Third-party contract audits' },
      { name: 'Incident Reports', frequency: 'As Needed', description: 'Security incident documentation' },
      { name: 'Infrastructure Status', frequency: 'Weekly', description: 'Network health metrics' },
    ],
    proposals: [
      { id: 'PIP-7001', pip: 'PIP-7001', title: 'Q1 Security Audit Budget', status: 'passed', votesFor: 234000, votesAgainst: 18000, endTime: 'Ended' },
    ],
  },
  {
    id: 'treasury',
    name: 'Treasury Committee',
    persian: 'کمیته خزانه',
    symbol: 'KHAZ',
    focus: 'Treasury & Finance',
    description: 'Manages protocol treasury, investments, and financial operations.',
    mandate: 'Prudent treasury management and sustainable protocol finances.',
    treasuryAllocation: 25,
    vaultBalance: 225000,
    feeStream7d: 4500,
    baseSplit: 2.5,
    spendTimelock: '48-96h',
    owns: [
      { name: 'Working Treasury', description: 'Operational funds for committees' },
      { name: 'Strategic Reserve', description: 'Long-term protocol reserves' },
      { name: 'Bond Treasury', description: 'OHM-style bonding reserves' },
    ],
    outputs: [
      { name: 'Treasury Reports', frequency: 'Monthly', description: 'Complete treasury breakdown' },
      { name: 'Investment Updates', frequency: 'Quarterly', description: 'Portfolio performance' },
      { name: 'Budget Allocation', frequency: 'Monthly', description: 'Committee fund distribution' },
    ],
    proposals: [
      { id: 'PIP-7002', pip: 'PIP-7002', title: 'Q1 Budget Allocation', status: 'active', votesFor: 156000, votesAgainst: 12000, endTime: '2d 4h' },
    ],
  },
  {
    id: 'legal',
    name: 'Legal Committee',
    persian: 'کمیته داد',
    symbol: 'DAD',
    focus: 'Legal & Justice',
    description: 'Handles legal compliance, dispute resolution, and governance rules.',
    mandate: 'Legal compliance and fair dispute resolution for the protocol.',
    treasuryAllocation: 8,
    vaultBalance: 72000,
    feeStream7d: 1440,
    baseSplit: 0.8,
    spendTimelock: '24-48h',
    owns: [
      { name: 'Legal Reserve', description: 'Funds for legal counsel and compliance' },
      { name: 'Dispute Resolution', description: 'Arbitration and mediation services' },
    ],
    outputs: [
      { name: 'Compliance Reports', frequency: 'Quarterly', description: 'Regulatory compliance status' },
      { name: 'Resolution Records', frequency: 'As Needed', description: 'Dispute resolution outcomes' },
    ],
    proposals: [],
  },
  {
    id: 'health',
    name: 'Health Committee',
    persian: 'کمیته سلامت',
    symbol: 'SAL',
    focus: 'Health & Welfare',
    description: 'Coordinates humanitarian aid and health programs with privacy.',
    mandate: 'Humanitarian aid and health programs with privacy for beneficiaries.',
    treasuryAllocation: 20,
    vaultBalance: 90000,
    feeStream7d: 1800,
    baseSplit: 1,
    spendTimelock: '24-72h',
    owns: [
      { name: 'Emergency Pool', description: 'Rapid-response funding triggers for crises' },
      { name: 'Operator Registry', description: 'Vetted partners with private details, public totals' },
      { name: 'Beneficiary Privacy', description: 'Protected identity systems for aid recipients' },
    ],
    outputs: [
      { name: 'Verified Delivery', frequency: 'Weekly', description: 'Proof of aid distribution' },
      { name: 'Impact Scorecards', frequency: 'Monthly', description: 'Measurable humanitarian outcomes' },
      { name: 'Partner Reports', frequency: 'Quarterly', description: 'NGO partner performance reviews' },
    ],
    proposals: [
      { id: 'PIP-7003', pip: 'PIP-7003', title: 'Emergency Medical Aid Fund', status: 'active', votesFor: 156000, votesAgainst: 12000, endTime: '2d 4h' },
    ],
  },
  {
    id: 'culture',
    name: 'Culture Committee',
    persian: 'کمیته فرهنگ',
    symbol: 'FARH',
    focus: 'Culture & Heritage',
    description: 'Preserves and promotes Persian cultural heritage and arts.',
    mandate: 'Cultural preservation and artistic expression for the diaspora.',
    treasuryAllocation: 10,
    vaultBalance: 90000,
    feeStream7d: 1800,
    baseSplit: 1,
    spendTimelock: '24-48h',
    owns: [
      { name: 'Cultural Archive', description: 'Digital preservation of Persian heritage' },
      { name: 'Artist Grants', description: 'Funding for cultural creators' },
      { name: 'Event Fund', description: 'Community cultural events' },
    ],
    outputs: [
      { name: 'Archive Updates', frequency: 'Monthly', description: 'New cultural assets added' },
      { name: 'Grant Reports', frequency: 'Quarterly', description: 'Artist grant outcomes' },
      { name: 'Event Calendar', frequency: 'Monthly', description: 'Upcoming cultural events' },
    ],
    proposals: [
      { id: 'PIP-7004', pip: 'PIP-7004', title: 'Cultural Archive Initiative', status: 'active', votesFor: 89000, votesAgainst: 45000, endTime: '4d 12h' },
    ],
  },
  {
    id: 'education',
    name: 'Education Committee',
    persian: 'کمیته دانش',
    symbol: 'DAN',
    focus: 'Education & Research',
    description: 'Supports educational initiatives and research programs.',
    mandate: 'Educational excellence and research advancement for Persians worldwide.',
    treasuryAllocation: 8,
    vaultBalance: 72000,
    feeStream7d: 1440,
    baseSplit: 0.8,
    spendTimelock: '24-48h',
    owns: [
      { name: 'Scholarship Fund', description: 'Educational scholarships' },
      { name: 'Research Grants', description: 'Academic research funding' },
    ],
    outputs: [
      { name: 'Scholarship Awards', frequency: 'Quarterly', description: 'Scholarship recipients' },
      { name: 'Research Publications', frequency: 'Bi-Annual', description: 'Funded research outcomes' },
    ],
    proposals: [],
  },
  {
    id: 'development',
    name: 'Development Committee',
    persian: 'کمیته سازندگی',
    symbol: 'SAZ',
    focus: 'Development & Construction',
    description: 'Oversees protocol development and technical infrastructure.',
    mandate: 'Technical development and continuous protocol improvement.',
    treasuryAllocation: 12,
    vaultBalance: 108000,
    feeStream7d: 2160,
    baseSplit: 1.2,
    spendTimelock: '24-48h',
    owns: [
      { name: 'Dev Fund', description: 'Core protocol development' },
      { name: 'Bounty Pool', description: 'Bug bounties and feature bounties' },
      { name: 'Infrastructure', description: 'Technical infrastructure costs' },
    ],
    outputs: [
      { name: 'Release Notes', frequency: 'Bi-Weekly', description: 'Protocol updates' },
      { name: 'Dev Reports', frequency: 'Monthly', description: 'Development progress' },
    ],
    proposals: [
      { id: 'PIP-7005', pip: 'PIP-7005', title: 'Cross-Chain Bridge Upgrade', status: 'pending', votesFor: 0, votesAgainst: 0, endTime: 'Starts in 1d' },
    ],
  },
  {
    id: 'sustainability',
    name: 'Sustainability Committee',
    persian: 'کمیته پایداری',
    symbol: 'PAY',
    focus: 'Sustainability & Environment',
    description: 'Focuses on environmental sustainability and long-term viability.',
    mandate: 'Environmental responsibility and sustainable protocol operations.',
    treasuryAllocation: 5,
    vaultBalance: 45000,
    feeStream7d: 900,
    baseSplit: 0.5,
    spendTimelock: '24-48h',
    owns: [
      { name: 'Green Initiative', description: 'Environmental projects funding' },
      { name: 'Carbon Offset', description: 'Protocol carbon footprint offset' },
    ],
    outputs: [
      { name: 'Impact Reports', frequency: 'Quarterly', description: 'Environmental impact metrics' },
    ],
    proposals: [],
  },
  {
    id: 'endowment',
    name: 'Endowment Committee',
    persian: 'کمیته وقف',
    symbol: 'WAQF',
    focus: 'Endowment & Charity',
    description: 'Manages charitable endowments and philanthropic activities.',
    mandate: 'Charitable giving and perpetual endowment for the community.',
    treasuryAllocation: 7,
    vaultBalance: 63000,
    feeStream7d: 1260,
    baseSplit: 0.7,
    spendTimelock: '48-72h',
    owns: [
      { name: 'Perpetual Endowment', description: 'Never-touch principal fund' },
      { name: 'Charity Pool', description: 'Direct charitable distributions' },
    ],
    outputs: [
      { name: 'Charity Reports', frequency: 'Quarterly', description: 'Charitable distributions' },
      { name: 'Endowment Growth', frequency: 'Annual', description: 'Principal growth metrics' },
    ],
    proposals: [],
  },
  {
    id: 'compliance',
    name: 'Compliance Committee',
    persian: 'کمیته میزان',
    symbol: 'MIZ',
    focus: 'Compliance & Standards',
    description: 'Ensures protocol compliance and maintains quality standards.',
    mandate: 'Regulatory compliance and quality standards across all operations.',
    treasuryAllocation: 5,
    vaultBalance: 45000,
    feeStream7d: 900,
    baseSplit: 0.5,
    spendTimelock: '24-48h',
    owns: [
      { name: 'Compliance Fund', description: 'Regulatory compliance costs' },
      { name: 'Standards Body', description: 'Protocol standards maintenance' },
    ],
    outputs: [
      { name: 'Compliance Status', frequency: 'Monthly', description: 'Compliance checklist' },
      { name: 'Standards Updates', frequency: 'Quarterly', description: 'Protocol standards changes' },
    ],
    proposals: [],
  },
]

export const getDAO = (id: string): DAO | undefined => {
  return daos.find(d => d.id === id)
}
