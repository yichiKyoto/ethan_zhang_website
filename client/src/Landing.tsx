import {
  IconGitHub,
  IconLinkedIn,
  IconMail
} from './ContactIcons'
import NavBar from './NavBar'
import { Context } from './Context';
import { useContext, useRef, useState } from 'react';
import { uploadProfilePhoto } from './backendHelpers';
import LoadingSpinner from './LoadingSpinner';

const contactLinkClass =
  'flex min-w-0 items-center gap-3 rounded-xl px-2 py-2 text-gray-800 underline-offset-4 transition-colors hover:bg-gray-200/60 hover:underline bg-red-200'

export default function Landing() {
  const { language, menuOpen, isAdmin, profilePhoto, setProfilePhoto } = useContext(Context);
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadProfilePhoto(file)
      setProfilePhoto(url)
    } catch (err) {
      console.error(err)
      window.alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className={`flex flex-col h-dvh ${menuOpen && "max-md:overflow-hidden"}`}>
    <NavBar txtColor="text-black" bgColor='bg-purple-100'/>
    <div className="flex flex-col items-center justify-center gap-10 p-4 bg-red-100 flex-1">

      <div className="flex flex-col items-center justify-center gap-1">
        <div className="relative inline-flex">
          {profilePhoto
            ? <img src={profilePhoto} alt="Ethan Zhang" className="w-auto h-100 rounded-lg" />
            : <div className="w-75 h-100 rounded-lg bg-gray-200 flex items-center justify-center"><LoadingSpinner /></div>
          }
          {isAdmin && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                disabled={uploading}
                className="absolute top-2 right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-white/80 text-gray-700 shadow hover:bg-white disabled:opacity-50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                title="Change photo"
              >
                {uploading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-gray-700" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                )}
              </button>
            </>
          )}
        </div>
        <h1 className="text-3xl font-medium">{language === 'English' ? 'Ethan Zhang' : '张亦弛'}</h1>
        <div className="flex items-center justify-center gap-3">
          <p className="text-lg font-medium text-gray-400">
            {language === 'English' ? 'UNSW, Sydney' : 'UNSW, 悉尼'}
          </p>
          <div className="h-2 w-2 rounded-full bg-gray-400"></div>
          <p className="text-lg font-medium text-gray-400">
            {language === 'English' ? 'Full Stack Web Developer' : '全栈 Web 开发工程师'}
          </p>
        </div>
      </div>
      <div className="grid w-full max-w-4xl grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <a href="https://www.gmail.com" className={contactLinkClass}>
          <IconMail />
          <span className="min-w-0 truncate">yichi257kyoto@gmail.com</span>
        </a>
        <a
          href="https://www.linkedin.com/in/ethan-zhang-b52572365/"
          target="_blank"
          rel="noopener noreferrer"
          className={contactLinkClass}
        >
          <IconLinkedIn />
          <span className="min-w-0 truncate">LinkedIn</span>
        </a>
        <a
          href="https://github.com/yichiKyoto"
          target="_blank"
          rel="noopener noreferrer"
          className={contactLinkClass}
        >
          <IconGitHub />
          <span className="min-w-0 truncate">GitHub</span>
        </a>
      </div>
    </div>
    </div>
  )
}
