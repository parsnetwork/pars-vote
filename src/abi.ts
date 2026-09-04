/**
 * The calls Pars's own screens make, and no others.
 *
 * The stack's `gov/abi.ts` carries the shapes every tenant has — an OZ
 * Governor, an ERC20Votes token, a timelock. These are the ones only Pars has,
 * written from the contracts Pars deploys rather than from a barrel:
 * `script/Deploy.s.sol` for the escrow, and the bond market's own artifact.
 *
 * An ABI is a list of things we promise to be able to decode, so a fuller one
 * is a larger promise. Only the members actually called are here.
 */

/**
 * The escrow: ASHA locked for a whole number of months.
 *
 * Not a Curve-style escrow. There is no `getLocked`, no `MIN_LOCK_TIME`, no
 * point history and no decay — `stake` mints `amount * (100 + months * 10) /
 * 100` at once and the balance sits there until `lockEnd` passes. So the
 * adapter reports the bounds and the step from the contract's own `require`
 * rather than from getters that do not exist.
 */
export const escrow = [
  { type: 'function', name: 'name', inputs: [], outputs: [{ type: 'string' }], stateMutability: 'view' },
  { type: 'function', name: 'symbol', inputs: [], outputs: [{ type: 'string' }], stateMutability: 'view' },
  { type: 'function', name: 'decimals', inputs: [], outputs: [{ type: 'uint8' }], stateMutability: 'view' },
  { type: 'function', name: 'totalSupply', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'balanceOf', inputs: [{ type: 'address' }], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  /** The token under lock. Named for the asset on this contract. */
  { type: 'function', name: 'asha', inputs: [], outputs: [{ type: 'address' }], stateMutability: 'view' },
  { type: 'function', name: 'lockEnd', inputs: [{ type: 'address' }], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'delegates', inputs: [{ type: 'address' }], outputs: [{ type: 'address' }], stateMutability: 'view' },
  { type: 'function', name: 'getVotes', inputs: [{ type: 'address' }], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'delegate', inputs: [{ type: 'address' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'stake', inputs: [{ type: 'uint256' }, { type: 'uint256' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'unstake', inputs: [{ type: 'uint256' }], outputs: [], stateMutability: 'nonpayable' },
] as const

/**
 * The bond market: a fixed-term sale of the token at a discount, vested.
 *
 * `bonds(id)` is the public mapping getter and returns the struct flat; ids are
 * 0-based and `nextBondId` is one past the last, so a market that has sold
 * nothing answers 0 and there is no bond to read.
 */
export const bond = [
  { type: 'function', name: 'identityToken', inputs: [], outputs: [{ type: 'address' }], stateMutability: 'view' },
  { type: 'function', name: 'treasury', inputs: [], outputs: [{ type: 'address' }], stateMutability: 'view' },
  { type: 'function', name: 'nextBondId', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'getActiveBonds', inputs: [], outputs: [{ type: 'uint256[]' }], stateMutability: 'view' },
  { type: 'function', name: 'totalRaised', inputs: [{ type: 'uint256' }], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  {
    type: 'function', name: 'bonds', inputs: [{ name: 'bondId', type: 'uint256' }],
    outputs: [
      { name: 'paymentToken', type: 'address' },
      { name: 'targetRaise', type: 'uint256' },
      { name: 'tokensToMint', type: 'uint256' },
      { name: 'discount', type: 'uint256' },
      { name: 'vestingPeriod', type: 'uint256' },
      { name: 'startTime', type: 'uint256' },
      { name: 'endTime', type: 'uint256' },
      { name: 'minPurchase', type: 'uint256' },
      { name: 'maxPurchase', type: 'uint256' },
      { name: 'active', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function', name: 'purchases',
    inputs: [{ name: 'bondId', type: 'uint256' }, { name: 'user', type: 'address' }],
    outputs: [
      { name: 'bondId', type: 'uint256' },
      { name: 'paymentAmount', type: 'uint256' },
      { name: 'tokensOwed', type: 'uint256' },
      { name: 'tokensClaimed', type: 'uint256' },
      { name: 'vestingStart', type: 'uint256' },
      { name: 'vestingEnd', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  { type: 'function', name: 'claimable', inputs: [{ type: 'uint256' }, { type: 'address' }], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'purchase', inputs: [{ type: 'uint256' }, { type: 'uint256' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'claim', inputs: [{ type: 'uint256' }], outputs: [], stateMutability: 'nonpayable' },
] as const

/**
 * A committee: a sub-DAO with its own register, under the main one.
 *
 * `mainDAO()` is what makes the network a network rather than a list — it is
 * the edge, and it is read rather than assumed, because a contract that names
 * a different parent is not part of this network however it was recorded.
 */
export const dao = [
  { type: 'function', name: 'name', inputs: [], outputs: [{ type: 'string' }], stateMutability: 'view' },
  { type: 'function', name: 'mainDAO', inputs: [], outputs: [{ type: 'address' }], stateMutability: 'view' },
  { type: 'function', name: 'proposalCount', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'quorumPercentage', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'votingPeriod', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'state', inputs: [{ type: 'uint256' }], outputs: [{ type: 'uint8' }], stateMutability: 'view' },
  {
    type: 'function', name: 'getProposal', inputs: [{ type: 'uint256' }],
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
] as const
