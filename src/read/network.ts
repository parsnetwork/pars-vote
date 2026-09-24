import type { Address } from 'viem'
import type { Venue } from '@luxdao/app/gov/chain'
import { client, reader } from '@luxdao/app/gov/client'
import { absent, attempt, failed, read, type Read } from '@luxdao/app/gov/read'
import * as abi from '../abi'
import { at, daos } from '../at'

/**
 * The committees, and the edge that makes them a network.
 *
 * Pars governs through sub-DAOs with their own registers under one main DAO.
 * The interesting fact about each is not its name — a name is a string anyone
 * can write — but `mainDAO()`: a contract that names a different parent is not
 * part of this network however it was recorded, and one that names none is not
 * a sub-DAO at all.
 *
 * SO NOTHING HERE IS A ROSTER. The app this replaces shipped ten committees
 * with Persian names, treasury allocations, vault balances and seven-day fee
 * streams, all of it typed into a file — and the register it drew them over was
 * two zero addresses marked "TODO: Deploy". Every figure on that screen was
 * invented. What is left when the invented part is removed is this: the
 * addresses on record, whether anything is deployed at each, and what each one
 * says about itself.
 */

export interface Committee {
  address: Address
  name: string
  /** The DAO this one answers to, read from the contract rather than assumed. */
  parent: Address
  proposals: bigint
  quorum: bigint
  period: bigint
  /** Bytes of code at the address, so a reader can see it is a contract. */
  size: number
}

/** A committee address on record, and what the chain says about it. */
export interface Row {
  address: Address
  /** Read when it answered, absent when nothing is deployed, failed when the chain would not say. */
  it: Read<Committee>
}

export const NOBODY = '0x0000000000000000000000000000000000000000'

/** Whether a committee names the main DAO as its parent. */
export const under = (c: Committee, main: Address | undefined): boolean =>
  main !== undefined && c.parent.toLowerCase() === main.toLowerCase()

/**
 * Every committee address recorded for this venue.
 *
 * A separate register from the stack's, and one entry per address rather than
 * per name, because an address is what can be checked.
 */
export const recorded = (v: Venue): readonly Address[] => daos(v)

export async function committee(v: Venue, address: Address): Promise<Read<Committee>> {
  try {
    const code = await client(v).getCode({ address })
    const size = code ? (code.length - 2) / 2 : 0
    if (size === 0) return absent(address)
    const ask = reader(v, address, abi.dao)
    const [name, parent, proposals, quorum, period] = await Promise.all([
      ask<string>('name'),
      ask<Address>('mainDAO'),
      ask<bigint>('proposalCount'),
      ask<bigint>('quorumPercentage'),
      ask<bigint>('votingPeriod'),
    ])
    return read({ address, name, parent, proposals, quorum, period, size })
  } catch (e) {
    return failed(e)
  }
}

export async function network(v: Venue): Promise<Read<Row[]>> {
  return attempt(async () =>
    Promise.all(recorded(v).map(async (address) => ({ address, it: await committee(v, address) }))),
  )
}

/** The main DAO every committee is checked against, when one is recorded. */
export const main = (v: Venue): Address | undefined => at(v, 'governor')
