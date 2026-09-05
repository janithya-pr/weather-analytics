import { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Dashboard from './components/Dashboard/Dashboard'
import { withProtection } from './auth/withProtection'

function App() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <>
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <Dashboard searchQuery={searchQuery} />
    </>
  )
}

export default withProtection(App)
