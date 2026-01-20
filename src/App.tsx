import { Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { Governance } from './pages/Governance'
import { Delegate } from './pages/Delegate'
import { Analytics } from './pages/Analytics'
import { Docs } from './pages/Docs'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/governance" element={<Governance />} />
          <Route path="/delegate" element={<Delegate />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/docs" element={<Docs />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
