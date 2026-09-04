import { YStack } from '@hanzogui/stacks'
import { Paragraph } from '@hanzogui/text'
import { useParams } from 'react-router'
import type { Address as Hex } from 'viem'
import * as chain from '@luxfi/vote/chrome/here'
import { reader } from '@luxfi/vote/gov/client'
import { attempt } from '@luxfi/vote/gov/read'
import { useRead } from '@luxfi/vote/gov/use'
import { Address } from '@luxfi/vote/parts/address'
import { Answer, Reading } from '@luxfi/vote/parts/answer'
import { Facts, fact } from '@luxfi/vote/parts/facts'
import { Link } from '@luxfi/vote/parts/link'
import { Mark } from '@luxfi/vote/parts/mark'
import { Panel, Title } from '@luxfi/vote/parts/panel'
import { quiet } from '@luxfi/vote/parts/paint'
import { Table } from '@luxfi/vote/parts/table'
import { units } from '@luxfi/vote/read/governance'
import * as abi from '../abi'
import { committee, main, recorded, under } from '../read/network'

/**
 * The states a committee's own register uses.
 *
 * These are NOT the OpenZeppelin ordinals. This contract answers 0 Pending,
 * 1 Active, 2 Canceled, 3 Defeated, 4 Succeeded and 7 Executed, with 5 and 6
 * unused — reading it with the OZ table would report an executed proposal as
 * expired. Never share one list between the two.
 */
export const STATES: Readonly<Record<number, string>> = {
  0: 'Pending',
  1: 'Active',
  2: 'Canceled',
  3: 'Defeated',
  4: 'Succeeded',
  7: 'Executed',
}

interface Item {
  id: bigint
  proposer: string
  description: string
  for: bigint
  against: bigint
  abstain: bigint
  state: string
}

/** One committee, and the register it keeps. */
export default function Committee() {
  const here = chain.use()
  const { address } = useParams<{ address: string }>()
  const known = recorded(here).some((a) => a.toLowerCase() === (address ?? '').toLowerCase())
  const it = useRead(
    () => committee(here, (address ?? '0x') as Hex),
    [here.key, address],
  )
  const register = useRead(
    () =>
      attempt(async () => {
        const ask = reader(here, (address ?? '0x') as Hex, abi.dao)
        const count = await ask<bigint>('proposalCount')
        const ids = Array.from({ length: Number(count) }, (_, i) => BigInt(i + 1))
        return Promise.all(
          ids.map(async (id) => {
            const [p, state] = await Promise.all([
              ask<readonly [string, string, bigint, bigint, bigint, bigint, bigint, boolean, boolean]>(
                'getProposal',
                [id],
              ),
              ask<number>('state', [id]),
            ])
            return {
              id,
              proposer: p[0],
              description: p[1],
              for: p[2],
              against: p[3],
              abstain: p[4],
              state: STATES[state] ?? `state ${state}`,
            } satisfies Item
          }),
        )
      }),
    [here.key, address],
  )

  if (!known) {
    return (
      <YStack gap="$6">
        <Title lede="This address is not on the committee register for this chain.">
          Not a committee
        </Title>
        <Answer
          title="Nothing is recorded for this address"
          detail={
            <>
              The register is a list of addresses this interface will read; an address that is not on
              it has not been checked and nothing is known about it.{' '}
              <Link href="/network">The network</Link>.
            </>
          }
        />
      </YStack>
    )
  }

  return (
    <YStack gap="$6">
      <Reading of={it} what="this committee">
        {(c) => (
          <YStack gap="$6">
            <Title lede={`A committee on the ${here.name} network.`}>{c.name}</Title>
            <Panel
              title="What it is"
              note={
                <>
                  At <Address at={c.address} explorer={here.explorer} />.
                </>
              }
            >
              <YStack gap="$3">
                <Mark tone={under(c, main(here)) ? 'good' : 'warn'}>
                  {under(c, main(here)) ? 'answers to the main DAO' : 'answers to another address'}
                </Mark>
                <Facts
                  rows={[
                    fact('Parent', <Address at={c.parent} explorer={here.explorer} />),
                    fact('Proposals', c.proposals.toLocaleString()),
                    fact('Quorum', `${c.quorum.toString()}%`),
                    fact('Voting period', `${c.period.toLocaleString()} blocks`),
                  ]}
                />
              </YStack>
            </Panel>
          </YStack>
        )}
      </Reading>

      <Reading
        of={register}
        what="this committee's register"
        nothing={
          <Answer
            title="This committee has never had a proposal"
            detail="The register was read in full and is empty. Nothing has been proposed, which is not the same as nothing having loaded."
          />
        }
      >
        {(rows) => (
          <Panel title="Its register" note="Counted in the escrow weight the committee tallies.">
            <Table
              caption="Proposals on this committee"
              columns={[
                { head: 'Id', cell: (r) => r.id.toString() },
                { head: 'Proposal', cell: (r) => r.description.split('\n')[0] ?? `Proposal ${r.id}` },
                { head: 'State', cell: (r) => <Mark tone={r.state === 'Active' ? 'good' : 'plain'}>{r.state}</Mark> },
                { head: 'For', cell: (r) => units(r.for, 18), align: 'right' },
                { head: 'Against', cell: (r) => units(r.against, 18), align: 'right' },
                { head: 'Abstain', cell: (r) => units(r.abstain, 18), align: 'right' },
              ]}
              rows={rows}
              keyOf={(r) => r.id.toString()}
            />
            <Paragraph size="$3" margin={0} color={quiet}>
              This register's state numbers are the committee contract's own, and are not the
              OpenZeppelin ones the main Governor uses.
            </Paragraph>
          </Panel>
        )}
      </Reading>
    </YStack>
  )
}
