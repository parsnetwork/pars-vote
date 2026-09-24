import { XStack, YStack } from '@hanzogui/stacks'
import { Paragraph } from '@hanzogui/text'
import * as chain from '@luxdao/app/chrome/here'
import * as wallet from '@luxdao/app/chrome/wallet'
import { useRead } from '@luxdao/app/gov/use'
import { Address } from '@luxdao/app/parts/address'
import { Answer, Reading } from '@luxdao/app/parts/answer'
import { Facts, fact } from '@luxdao/app/parts/facts'
import { Mark } from '@luxdao/app/parts/mark'
import { Panel, Title } from '@luxdao/app/parts/panel'
import { quiet } from '@luxdao/app/parts/paint'
import { Table } from '@luxdao/app/parts/table'
import { units } from '@luxdao/app/read/governance'
import { bonds, filled, notes, open, vested, type Bond } from '../read/bonds'

const now = () => BigInt(Math.floor(Date.now() / 1000))

const when = (t: bigint) =>
  t === 0n ? 'no end' : new Date(Number(t) * 1000).toISOString().replace('T', ' ').slice(0, 16) + ' UTC'

const pct = (bp: bigint) => `${(Number(bp) / 100).toFixed(2)}%`

const days = (s: bigint) => `${Math.round(Number(s) / 86_400)} days`

/**
 * The bond market.
 *
 * A bond is a window in which the treasury sells the token at a discount and
 * delivers it over a vesting period. Three clocks are in play — the sale
 * window, one buyer's vesting, and now — and they are named separately on this
 * screen because a bond screen that mixes them tells a buyer their tokens are
 * available when they are still vesting.
 */
export default function Bonds() {
  const here = chain.use()
  const session = wallet.use()
  const who = session?.address ?? null
  const list = useRead(() => bonds(here), [here.key])
  const ids = list.at === 'read' ? list.value.map((b) => b.id) : []
  const mine = useRead(
    async () => (who ? notes(here, who, ids) : { at: 'read' as const, value: [] }),
    [here.key, who, ids.join(',')],
  )

  const t = now()

  return (
    <YStack gap="$6">
      <Title lede="The treasury sells the token at a discount, for a fixed window, and delivers it over a vesting period.">
        Bonds
      </Title>

      <Reading
        of={list}
        what="the bond market"
        nothing={
          <Answer
            title="The market has never opened a bond"
            detail="The contract answered and its register is empty: no bond has been created, which is not the same as none being open now."
          />
        }
      >
        {(rows) => (
          <YStack gap="$6">
            {rows.map((b) => (
              <One key={b.id.toString()} b={b} now={t} explorer={here.explorer} />
            ))}
          </YStack>
        )}
      </Reading>

      {session ? (
        <Reading
          of={mine}
          what="your bonds"
          nothing={
            <Answer
              title="You hold no position in any bond"
              detail="Read for the connected address against every bond on the register."
            />
          }
        >
          {(rows) => (
            <Panel title="Your bonds" note="Vesting runs from the moment of purchase, not from the close of the sale.">
              <Table
                caption="Positions held by the connected address"
                columns={[
                  { head: 'Bond', cell: (n) => n.bond.toString() },
                  { head: 'Paid', cell: (n) => units(n.paid, 18), align: 'right' },
                  { head: 'Owed', cell: (n) => units(n.owed, 18), align: 'right' },
                  { head: 'Taken', cell: (n) => units(n.claimed, 18), align: 'right' },
                  { head: 'Vested', cell: (n) => pct(vested(n, t)), align: 'right' },
                  { head: 'Claimable now', cell: (n) => units(n.claimable, 18), align: 'right' },
                ]}
                rows={rows}
                keyOf={(n) => n.bond.toString()}
              />
            </Panel>
          )}
        </Reading>
      ) : (
        <Paragraph size="$3" margin={0} color={quiet}>
          Connect a wallet to read your own position in these bonds.
        </Paragraph>
      )}
    </YStack>
  )
}

function One({ b, now: t, explorer }: { b: Bond; now: bigint; explorer: string | null }) {
  const live = open(b, t)
  return (
    <Panel
      title={`Bond ${b.id}`}
      level="h2"
      note={
        <>
          Paid in <Address at={b.payment} explorer={explorer} />.
        </>
      }
    >
      <XStack gap="$2" flexWrap="wrap" alignItems="center">
        <Mark tone={live ? 'good' : 'plain'}>{live ? 'open' : 'closed'}</Mark>
        {b.active && !live ? (
          <Paragraph size="$2" margin={0} color={quiet}>
            The contract's flag is still set; the window has passed.
          </Paragraph>
        ) : null}
      </XStack>
      <Facts
        rows={[
          fact('Raised', `${units(b.raised, 18)} of ${units(b.target, 18)}`),
          fact('Filled', pct(filled(b))),
          fact('Discount', pct(b.discount)),
          fact('Tokens on offer', units(b.minting, 18)),
          fact('Vesting', days(b.vesting)),
          fact('Opens', when(b.opens)),
          fact('Closes', when(b.closes)),
          fact('Smallest purchase', b.floor > 0n ? units(b.floor, 18) : null, 'no minimum'),
          fact('Largest purchase', b.ceiling > 0n ? units(b.ceiling, 18) : null, 'no maximum'),
        ]}
      />
    </Panel>
  )
}
