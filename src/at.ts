import type { Address } from 'viem'
import type { Venue } from '@luxdao/app/gov/chain'
import { client } from '@luxdao/app/gov/client'
import { absent, failed, read, unrecorded, type Read } from '@luxdao/app/gov/read'

/**
 * Where Pars's own contracts are, and the honest answer today: nowhere.
 *
 * The stack's `gov/chain.ts` register carries the contracts every tenant has —
 * a Governor, a timelock, a votes token, a treasury Safe. These are the ones
 * only Pars has, so they are recorded here, in the fork, and a slot in the
 * upstream register is not asked for.
 *
 * NOTHING IS RECORDED ON PARS. `script/Deploy.s.sol` has never been broadcast
 * to 494949: every address in the app this replaces was either the zero address
 * or an address on Lux devnet 96370 carried under a `luxMainnet` key. An
 * address from another chain recorded here would answer `eth_getCode` with
 * nothing and read on the screens as a contract that is not deployed, which is
 * true but for the wrong reason, and would be believed the day something IS
 * deployed at it there.
 *
 * The loopback entry is the nonce order of `Deploy.s.sol` on a fresh anvil —
 * deterministic for that order and nothing more. It is removed from a
 * production bundle rather than hidden in one: `import.meta.env.DEV` is
 * replaced with a literal at build time.
 */
export type Slot = 'asha' | 'escrow' | 'governor' | 'bond'

export const AT: Readonly<Record<string, Readonly<Partial<Record<Slot, Address>>>>> = {
  pars: {},
  ...(import.meta.env.DEV
    ? {
        local: {
          asha: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
          escrow: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
          governor: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
        } as Readonly<Partial<Record<Slot, Address>>>,
      }
    : {}),
}

export const at = (v: Venue, slot: Slot): Address | undefined => AT[v.key]?.[slot]

/**
 * The committees, which are a list rather than a slot.
 *
 * A network has as many members as it has, and each is checked against the
 * main DAO by asking the contract who its parent is — so this is addresses and
 * nothing else. No names: a name typed here would render beside figures read
 * from the chain and be read as one of them.
 */
export const DAOS: Readonly<Record<string, readonly Address[]>> = {
  pars: [],
}

export const daos = (v: Venue): readonly Address[] => DAOS[v.key] ?? []

/**
 * Does a contract exist at the address recorded for this slot?
 *
 * The same question `gov/client`'s `presence` asks of the stack's register,
 * asked of this one. An address with no code answers a call with empty data
 * rather than an error, so "Pars has no bond market" and "the bond market has
 * no bonds" arrive at the call site as the same silence.
 */
export async function sited(v: Venue, slot: Slot): Promise<Read<{ address: Address; size: number }>> {
  const address = at(v, slot)
  if (!address) return unrecorded()
  try {
    const code = await client(v).getCode({ address })
    const size = code ? (code.length - 2) / 2 : 0
    return size === 0 ? absent(address) : read({ address, size })
  } catch (e) {
    return failed(e)
  }
}
