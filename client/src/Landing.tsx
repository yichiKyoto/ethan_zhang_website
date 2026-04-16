import ethanPhoto from './assets/ethan_zhang.png'
import {
  IconDiscord,
  IconGitHub,
  IconInstagram,
  IconLinkedIn,
  IconMail,
  IconPhone,
} from './ContactIcons'
import NavBar from './NavBar'
import { Context } from './Context';
import { useContext } from 'react';

const contactLinkClass =
  'flex min-w-0 items-center gap-3 rounded-xl px-2 py-2 text-gray-800 underline-offset-4 transition-colors hover:bg-gray-200/60 hover:underline bg-red-200'

export default function Landing() {
  const { language, menuOpen } = useContext(Context);
  return (
    <div className={`flex flex-col h-dvh ${menuOpen && "max-md:overflow-hidden"}`}>
    <NavBar txtColor="text-black" bgColor='bg-purple-100'/>
    <div className="flex flex-col items-center justify-center gap-10 p-4 bg-red-100 flex-1">

      <div className="flex flex-col items-center justify-center gap-1">
        <img src={ethanPhoto} alt="Ethan Zhang" className="w-auto h-100 rounded-lg" />
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
          href="https://www.instagram.com/ethan257zhang/"
          target="_blank"
          rel="noopener noreferrer"
          className={contactLinkClass}
        >
          <IconInstagram />
          <span className="min-w-0 truncate">instagram.com/ethan257zhang</span>
        </a>
        <a
          href="https://www.linkedin.com/in/ethan-zhang-b52572365/"
          target="_blank"
          rel="noopener noreferrer"
          className={contactLinkClass}
        >
          <IconLinkedIn />
          <span className="min-w-0 truncate">linkedin.com/in/ethan-zhang-b52572365</span>
        </a>
        <a
          href="https://github.com/ethan.zhang"
          target="_blank"
          rel="noopener noreferrer"
          className={contactLinkClass}
        >
          <IconGitHub />
          <span className="min-w-0 truncate">GitHub</span>
        </a>
        <a
          href="https://discord.com/ethan.zhang"
          target="_blank"
          rel="noopener noreferrer"
          className={contactLinkClass}
        >
          <IconDiscord />
          <span className="min-w-0 truncate">Discord</span>
        </a>
        <a href="tel:+61479057618" className={contactLinkClass}>
          <IconPhone />
          <span className="min-w-0">+61 479 057 618</span>
        </a>
      </div>
    </div>
    </div>
  )
}