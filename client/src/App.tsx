import Landing from './Landing'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Projects from './Projects'
import WorkExperience from './WorkExperience'
import Education from './Education'
import Gym from './Gym'
import { useState } from 'react'
import { Context } from './Context'
import AdminPage from './AdminPage'

function App() {
  const [language, setLanguage] = useState('English');
  const [isAdmin, setAdmin] = useState(true);

  return (
    <Context.Provider value={{ language, setLanguage, isAdmin, setAdmin }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/projects" element={<Projects/>} />
          <Route path="/workExperience" element={<WorkExperience />} />
          <Route path="/education" element={<Education />} />
          <Route path="/gym" element={<Gym />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </Context.Provider>
  )
}

export default App
