import { YStack } from '@hanzogui/stacks'
import { Paragraph } from '@hanzogui/text'
import { Panel } from '@luxdao/app/parts/panel'
import { quiet } from '@luxdao/app/parts/paint'
import { Escrow } from '@luxdao/app/routes/Stake'
import { MAX_MONTHS, MIN_MONTHS, VEASHA, returned, surplus, weight } from '../read/ve'

const ONE = 10n ** 18n
const whole = (v: bigint) => (v / ONE).toString()

/**
 * The escrow screen, reading Pars's escrow.
 *
 * The screen is the stack's and is not copied here. What is added is the one
 * thing about this contract a holder cannot read off a balance: the rate it
 * pays on the way out is not the rate it minted at, so the arithmetic is drawn
 * rather than left to be discovered on the day somebody unlocks.
 */
export default function Stake() {
  return (
    <YStack gap="$6">
      <Escrow ve={VEASHA} />

      <Panel
        title="Leaving the escrow"
        note="Read from the contract's own arithmetic, not from a model of it."
      >
        <Paragraph size="$3" margin={0} color={quiet}>
          A lock mints the deposit plus a tenth for each month, from {MIN_MONTHS.toString()} month to{' '}
          {MAX_MONTHS.toString()}. Burning escrow returns the deposit at a fixed rate of ten in
          eleven, whatever the lock was — so the two are inverses at one month and at no other
          length.
        </Paragraph>
        <Paragraph size="$3" margin={0} color={quiet}>
          Locking {whole(100n * ONE)} for six months mints {whole(weight(100n * ONE, 6n))}, and
          burning {whole(weight(100n * ONE, 6n))} returns{' '}
          {whole(returned(weight(100n * ONE, 6n)))} — {whole(surplus(100n * ONE, 6n))} more than was
          locked. The difference is paid out of the deposits every other locker made, so the last
          holder to leave is the one who is short. A lock of one month round-trips exactly and takes
          nothing.
        </Paragraph>
      </Panel>
    </YStack>
  )
}
