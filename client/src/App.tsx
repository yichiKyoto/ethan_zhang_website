import Landing from './Landing'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Projects from './Projects'
import WorkExperience from './WorkExperience'
import Education from './Education'
import MyStory from './MyStory'
import { useEffect, useState } from 'react'
import { Context } from './Context'
import AdminPage from './AdminPage'
import { fetchProfilePhoto } from './backendHelpers'

function App() {
  const [language, setLanguage] = useState('English');
  const [isAdmin, setAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState('');

  useEffect(() => {
    fetchProfilePhoto().then(url => {
      if (url) setProfilePhoto(url)
    })
  }, [])

  return (
    <Context.Provider value={{ language, setLanguage, isAdmin, setAdmin, menuOpen, setMenuOpen, profilePhoto, setProfilePhoto }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/projects" element={<Projects/>} />
          <Route path="/workExperience" element={<WorkExperience />} />
          <Route path="/education" element={<Education />} />
          <Route path="/mystory" element={<MyStory />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </Context.Provider>
  )
}

export default App
