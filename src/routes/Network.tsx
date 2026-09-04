import { YStack } from '@hanzogui/stacks'
import { Paragraph } from '@hanzogui/text'
import * as chain from '@luxfi/vote/chrome/here'
import { useRead } from '@luxfi/vote/gov/use'
import { Address } from '@luxfi/vote/parts/address'
import { Answer, Reading } from '@luxfi/vote/parts/answer'
import { Facts, fact } from '@luxfi/vote/parts/facts'
import { Link } from '@luxfi/vote/parts/link'
import { Mark } from '@luxfi/vote/parts/mark'
import { Panel, Title } from '@luxfi/vote/parts/panel'
import { quiet } from '@luxfi/vote/parts/paint'
import { main, network, under } from '../read/network'

/**
 * The network of committees.
 *
 * Every committee on the register is asked three things: is there code at the
 * address, what does it call itself, and which DAO does it answer to. The third
 * is what makes the list a network — a contract that names a different parent
 * is not part of this one however it came to be recorded.
 */
export default function Network() {
  const here = chain.use()
  const rows = useRead(() => network(here), [here.key])
  const parent = main(here)

  return (
    <YStack gap="$6">
      <Title lede="Committees govern their own registers under one main DAO. Each is read from the chain, and each is asked who it answers to.">
        Network
      </Title>

      <Reading
        of={rows}
        what="the committee register"
        nothing={
          <Answer
            title="No committee address is recorded on this chain"
            detail={
              <>
                This is a statement about our own records rather than about the chain. The interface
                this replaces drew ten committees with names, allocations and balances over a
                register of two zero addresses; what is left when the invented part is removed is an
                empty register, which is what this is. A committee appears here when an address for
                it does.
              </>
            }
          />
        }
      >
        {(list) => (
          <YStack gap="$4">
            {list.map((row) => (
              <Reading key={row.address} of={row.it} what={`the committee at ${row.address}`}>
                {(c) => (
                  <Panel
                    title={c.name}
                    note={
                      <>
                        At <Address at={c.address} explorer={here.explorer} />, {c.size.toLocaleString()}{' '}
                        bytes.
                      </>
                    }
                  >
                    <YStack gap="$3">
                      <Mark tone={under(c, parent) ? 'good' : 'warn'}>
                        {under(c, parent) ? 'answers to the main DAO' : 'answers to another address'}
                      </Mark>
                      <Facts
                        rows={[
                          fact('Parent', <Address at={c.parent} explorer={here.explorer} />),
                          fact('Proposals', c.proposals.toLocaleString()),
                          fact('Quorum', `${c.quorum.toString()}%`),
                          fact('Voting period', `${c.period.toLocaleString()} blocks`),
                        ]}
                      />
                      <Paragraph size="$3" margin={0} color={quiet}>
                        <Link href={`/network/${c.address}`}>Its register</Link>
                      </Paragraph>
                    </YStack>
                  </Panel>
                )}
              </Reading>
            ))}
          </YStack>
        )}
      </Reading>
    </YStack>
  )
}
