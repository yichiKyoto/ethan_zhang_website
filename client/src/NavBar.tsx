import { Link } from 'react-router-dom'
import ethanPhoto from './assets/ethan_zhang.png'
import { Context } from './Context';
import { useContext, useState } from 'react';

export default function NavBar(props: {bgColor: string, txtColor: string}) {
  const { language, setLanguage, isAdmin } = useContext(Context);

  return (
    <div className={`flex justify-center w-full items-center text-center ${props.bgColor} ${props.txtColor} gap-10 shadow-lg`}>
      <button className="text-xl flex items-center gap-3 underline-offset-4 transition-colors hover:bg-gray-200/60 p-5 rounded-xl cursor-pointer absolute left-10" onClick={() => {
        if (language === 'English') {
          setLanguage('中文');
        } else {
          setLanguage('English');
        }
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
        </svg>

        {language === 'English' ? 'English' : '中文'}
      </button>
      <Link to="/education" className="text-center text-xl flex items-center gap-3 underline-offset-4 transition-colors hover:bg-gray-200/60 p-5 rounded-xl">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 h-6 w-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
        </svg>
        {language === 'English' ? 'Education' : '教育'}
      </Link>
      <div className="h-2 w-2 rounded-full bg-gray-400"></div>
      <Link to="/workExperience" className="text-center text-xl flex items-center gap-3 underline-offset-4 transition-colors hover:bg-gray-200/60 p-5 rounded-xl">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 h-6 w-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
        </svg>
        {language === 'English' ? 'Work Experience' : '工作经历'}
      </Link>
      <div className="h-2 w-2 rounded-full bg-gray-400"></div>
      <Link to="/" className="text-center text-xl flex items-center gap-3 underline-offset-4 transition-colors hover:bg-gray-200/60 p-5 rounded-xl">
        <img src={ethanPhoto} alt="Ethan Zhang" className="w-10 h-10 rounded-lg" />
        <p> {language === 'English' ? 'Ethan Zhang' : '张亦弛'} </p>
      </Link>
      <div className="h-2 w-2 rounded-full bg-gray-400 "></div>
      <Link to="/projects" className="text-center text-xl flex items-center gap-3 underline-offset-4 transition-colors hover:bg-gray-200/60 p-5 rounded-xl">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>

        {language === 'English' ? 'Projects' : '项目'}
      </Link>
      <div className="h-2 w-2 rounded-full bg-gray-400"></div>
      <Link to="/gym" className="text-center text-xl flex items-center gap-3 underline-offset-4 transition-colors hover:bg-gray-200/60 p-5 rounded-xl">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="#000000" width="800px" height="800px" viewBox="0 0 24 24" id="Layer_1" data-name="Layer 1"><path d="M22.942,6.837,20.76,4.654l.947-.947a1,1,0,1,0-1.414-1.414l-.947.947L17.163,1.058a3.7,3.7,0,0,0-5.105,0,3.609,3.609,0,0,0,0,5.106L14.24,8.346,8.346,14.24,6.163,12.058a3.7,3.7,0,0,0-5.105,0,3.609,3.609,0,0,0,0,5.106L3.24,19.346l-.947.947a1,1,0,1,0,1.414,1.414l.947-.947,2.183,2.182a3.609,3.609,0,0,0,5.105,0h0a3.608,3.608,0,0,0,0-5.105L9.76,15.655l5.9-5.895,2.182,2.182a3.609,3.609,0,0,0,5.105,0h0a3.608,3.608,0,0,0,0-5.105ZM11,20.39a1.6,1.6,0,0,1-.472,1.138,1.647,1.647,0,0,1-2.277,0L2.472,15.749a1.61,1.61,0,1,1,2.277-2.277l5.779,5.779A1.6,1.6,0,0,1,11,20.39Zm10.528-9.862a1.647,1.647,0,0,1-2.277,0L13.472,4.749a1.61,1.61,0,1,1,2.277-2.277l5.779,5.779a1.609,1.609,0,0,1,0,2.277Z"/></svg>

        {language === 'English' ? 'Gym' : '健身'}
      </Link>

      <Link to="/admin" className="text-xl flex items-center gap-3 underline-offset-4 transition-colors hover:bg-gray-200/60 p-5 rounded-xl cursor-pointer absolute right-10">
        {language === 'English' ? (
          <>
            Edit mode <span>{isAdmin ? "ON" : "OFF"}</span>
          </>
        ) :
        (
          <>
            编辑模式 <span>{isAdmin ? "开" : "关"}</span>
          </>
        )}
      </Link>
    </div>
  );
}
