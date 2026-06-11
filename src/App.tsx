import { Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { Governance } from './pages/Governance'
import { ProposalDetail } from './pages/ProposalDetail'
import { Delegate } from './pages/Delegate'
import { Staking } from './pages/Staking'
import { Analytics } from './pages/Analytics'
import { Docs } from './pages/Docs'
import { DAONetwork } from './pages/DAONetwork'
import { DAODetail } from './pages/DAODetail'
import { Treasury } from './pages/Treasury'
import { Lending } from './pages/Lending'
import { Liquidity } from './pages/Liquidity'
import { Bond, BondModal } from './views/Bond'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/governance" element={<Governance />} />
          <Route path="/governance/:id" element={<ProposalDetail />} />
          <Route path="/dao-network" element={<DAONetwork />} />
          <Route path="/dao-network/:id" element={<DAODetail />} />
          <Route path="/delegate" element={<Delegate />} />
          <Route path="/staking" element={<Staking />} />
          <Route path="/bond" element={<Bond />} />
          <Route path="/bond/:id" element={<BondModal />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/treasury" element={<Treasury />} />
          <Route path="/lending" element={<Lending />} />
          <Route path="/liquidity" element={<Liquidity />} />
          <Route path="/docs" element={<Docs />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
