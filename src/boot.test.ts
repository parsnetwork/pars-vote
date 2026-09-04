import { describe, expect, it } from 'vitest'
import { KEY as theirs, boot as their } from '@luxfi/vote/chrome/boot'
import { KEY as ours, boot as our } from './boot'

/**
 * The head script is written in two places because a vite config is loaded by
 * node, and node will not strip types from a file under `node_modules`. This
 * is what keeps the copy honest.
 */
describe('the head script', () => {
  it('is character-for-character the stack\'s', () => {
    expect(our()).toBe(their())
  })

  /** Both readers of the stored theme take the key from one definition each. */
  it('reads the same key', () => {
    expect(ours).toBe(theirs)
  })
})
