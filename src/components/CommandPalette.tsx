import { useEffect, useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Dialog from '@radix-ui/react-dialog'
import {
  Search,
  Home,
  Vote,
  Users,
  UserCheck,
  Coins,
  BarChart3,
  FileText,
  ExternalLink,
  Command,
  ArrowRight,
} from 'lucide-react'
import { daos } from '../data/daos'

interface CommandItem {
  id: string
  title: string
  description?: string
  icon: React.ReactNode
  action: () => void
  category: 'navigation' | 'committee' | 'action' | 'external'
  keywords?: string[]
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()

  const commands: CommandItem[] = useMemo(() => {
    const navCommands: CommandItem[] = [
      {
        id: 'home',
        title: 'Home',
        description: 'Go to homepage',
        icon: <Home className="w-4 h-4" />,
        action: () => navigate('/'),
        category: 'navigation',
        keywords: ['dashboard', 'main'],
      },
      {
        id: 'governance',
        title: 'Proposals',
        description: 'View and vote on proposals',
        icon: <Vote className="w-4 h-4" />,
        action: () => navigate('/governance'),
        category: 'navigation',
        keywords: ['vote', 'proposal', 'resolution'],
      },
      {
        id: 'committees',
        title: 'Committees',
        description: 'View all 10 DAO committees',
        icon: <Users className="w-4 h-4" />,
        action: () => navigate('/dao-network'),
        category: 'navigation',
        keywords: ['dao', 'network', 'council'],
      },
      {
        id: 'delegate',
        title: 'Delegate',
        description: 'Delegate your voting power',
        icon: <UserCheck className="w-4 h-4" />,
        action: () => navigate('/delegate'),
        category: 'navigation',
        keywords: ['delegation', 'representative'],
      },
      {
        id: 'staking',
        title: 'Stake PARS',
        description: 'Stake PARS to earn xPARS',
        icon: <Coins className="w-4 h-4" />,
        action: () => navigate('/staking'),
        category: 'navigation',
        keywords: ['stake', 'xpars', 'yield'],
      },
      {
        id: 'analytics',
        title: 'Analytics',
        description: 'Protocol statistics and metrics',
        icon: <BarChart3 className="w-4 h-4" />,
        action: () => navigate('/analytics'),
        category: 'navigation',
        keywords: ['stats', 'metrics', 'data'],
      },
    ]

    const committeeCommands: CommandItem[] = daos.map((dao) => ({
      id: `committee-${dao.id}`,
      title: `${dao.name} (${dao.persian})`,
      description: dao.description,
      icon: <Users className="w-4 h-4" />,
      action: () => navigate(`/dao-network/${dao.id}`),
      category: 'committee',
      keywords: [dao.id, dao.symbol.toLowerCase(), dao.focus.toLowerCase()],
    }))

    const externalCommands: CommandItem[] = [
      {
        id: 'docs',
        title: 'Documentation',
        description: 'Read the Pars Protocol docs',
        icon: <FileText className="w-4 h-4" />,
        action: () => window.open('https://docs.pars.vote', '_blank'),
        category: 'external',
        keywords: ['docs', 'help', 'guide'],
      },
      {
        id: 'pips',
        title: 'PIPs (Improvement Proposals)',
        description: 'View Pars Improvement Proposals',
        icon: <ExternalLink className="w-4 h-4" />,
        action: () => window.open('https://github.com/parsdao/pips', '_blank'),
        category: 'external',
        keywords: ['pip', 'proposal', 'github'],
      },
      {
        id: 'discussions',
        title: 'GitHub Discussions',
        description: 'Join community discussions',
        icon: <ExternalLink className="w-4 h-4" />,
        action: () => window.open('https://github.com/orgs/parsdao/discussions', '_blank'),
        category: 'external',
        keywords: ['discuss', 'community', 'forum'],
      },
    ]

    return [...navCommands, ...committeeCommands, ...externalCommands]
  }, [navigate])

  const filteredCommands = useMemo(() => {
    if (!search) return commands

    const searchLower = search.toLowerCase()
    return commands.filter((cmd) => {
      return (
        cmd.title.toLowerCase().includes(searchLower) ||
        cmd.description?.toLowerCase().includes(searchLower) ||
        cmd.keywords?.some((k) => k.includes(searchLower))
      )
    })
  }, [commands, search])

  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {
      navigation: [],
      committee: [],
      action: [],
      external: [],
    }

    filteredCommands.forEach((cmd) => {
      groups[cmd.category].push(cmd)
    })

    return groups
  }, [filteredCommands])

  const executeCommand = useCallback(
    (cmd: CommandItem) => {
      cmd.action()
      setOpen(false)
      setSearch('')
      setSelectedIndex(0)
    },
    []
  )

  // Keyboard shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  // Handle arrow keys and enter
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filteredCommands[selectedIndex]) {
          executeCommand(filteredCommands[selectedIndex])
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, selectedIndex, filteredCommands, executeCommand])

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  const categoryLabels: Record<string, string> = {
    navigation: 'Navigation',
    committee: 'Committees',
    action: 'Actions',
    external: 'External',
  }

  let flatIndex = -1

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-white/50 hover:text-white/80 border border-white/10 hover:border-white/20 rounded-lg transition-colors"
      >
        <Search className="w-4 h-4" />
        <span>Search...</span>
        <kbd className="ml-2 px-1.5 py-0.5 text-xs bg-white/5 border border-white/10 rounded">
          <Command className="w-3 h-3 inline" />K
        </kbd>
      </button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl bg-pars-deep border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
              <Search className="w-5 h-5 text-white/40" />
              <input
                autoFocus
                type="text"
                placeholder="Search commands, committees, pages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-sm"
              />
              <kbd className="px-2 py-1 text-xs text-white/40 bg-white/5 border border-white/10 rounded">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto py-2">
              {filteredCommands.length === 0 ? (
                <div className="px-4 py-8 text-center text-white/40 text-sm">
                  No results found for "{search}"
                </div>
              ) : (
                Object.entries(groupedCommands).map(([category, items]) => {
                  if (items.length === 0) return null

                  return (
                    <div key={category}>
                      <div className="px-4 py-2 text-xs font-medium text-white/40 uppercase tracking-wider">
                        {categoryLabels[category]}
                      </div>
                      {items.map((cmd) => {
                        flatIndex++
                        const currentIndex = flatIndex
                        const isSelected = currentIndex === selectedIndex

                        return (
                          <button
                            key={cmd.id}
                            onClick={() => executeCommand(cmd)}
                            onMouseEnter={() => setSelectedIndex(currentIndex)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                              isSelected
                                ? 'bg-pars-gold/10 text-pars-gold'
                                : 'text-white/80 hover:bg-white/5'
                            }`}
                          >
                            <div
                              className={`flex-shrink-0 ${
                                isSelected ? 'text-pars-gold' : 'text-white/40'
                              }`}
                            >
                              {cmd.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{cmd.title}</div>
                              {cmd.description && (
                                <div className="text-xs text-white/40 truncate">
                                  {cmd.description}
                                </div>
                              )}
                            </div>
                            {isSelected && (
                              <ArrowRight className="w-4 h-4 flex-shrink-0 text-pars-gold/60" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-white/10 text-xs text-white/40">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded">↓</kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded">↵</kbd>
                  select
                </span>
              </div>
              <div>
                <span className="text-pars-gold/60">⌘K</span> to toggle
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
