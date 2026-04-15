import NavBar from './NavBar'
import EducationCard from './EducationCard'
import { Context } from './Context'
import { useContext, useEffect, useState } from 'react'
import { fetchAllEducation } from './backendHelpers'
import type { Education } from './backendHelpers'
import AddEducationModal from './AddEducationModal'
const copy = {
  en: {
    pageTitle: 'Education',
    university: 'University of New South Wales',
    degree: 'Bachelor of Computer Science',
    period: '2024 – 2026',
    skillsHeading: 'Skills acquired',
    skills: [
      'Languages & frameworks: Python, Java, C, SQL, shell scripting, React.js, HTML, CSS, JavaScript',
      'Tools & platforms: Git, Jest, Pytest, American Fuzzy Lop, PostgreSQL',
      'Concepts: data structures & algorithms, object-oriented programming, networking (HTTP/TCP), database systems',
    ],
    transcriptHeading: 'Academic transcript',
    transcriptLink: 'View academic transcript',
  },
  zh: {
    pageTitle: '教育经历',
    university: '新南威尔士大学',
    degree: '计算机科学学士学位',
    period: '2024 – 2026',
    skillsHeading: '掌握的技能',
    skills: [
      '语言与框架：Python、Java、C、SQL、Shell 脚本、React.js、HTML、CSS、JavaScript',
      '工具与平台：Git、Jest、Pytest、American Fuzzy Lop、PostgreSQL',
      '核心知识：数据结构与算法、面向对象编程、计算机网络（HTTP/TCP）、数据库系统（PostgreSQL）',
    ],
    transcriptHeading: '成绩单',
    transcriptLink: '查看成绩单（新标签页打开 PDF）',
  },
} as const

export default function Education() {
  const { isAdmin, language } = useContext(Context)
  const t = language === '中文' ? copy.zh : copy.en
  const [education, setEducation] = useState<Education[]>([])
  const [modal, setModal] = useState<boolean>(false);
  useEffect(() => {
    fetchAllEducation()
    .then((data) => {
      setEducation(data)

    }).catch(console.error)
  }, [])

  return (
    <div className="flex h-dvh flex-col">
      <NavBar />
      <div className="flex flex-1 flex-col gap-3 bg-red-100 p-4">
        <div className="flex items-center gap-5">
          <h1 className="text-3xl font-medium my-4 mx-2">
            {t.pageTitle}
          </h1>
          {isAdmin && (
            <button
              className="rounded-xl bg-red-200 px-8 py-3 hover:bg-red-300 cursor-pointer"
              onClick={() => setModal(true)}
            >
              {language === '中文' ? '添加教育经历' : 'Add Education'}
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {education.map((item) => (
            <EducationCard
              key={item.id}
              id={item.id}
              university={item.university}
              university_zh={item.university_zh}
              period={item.period}
              period_zh={item.period_zh}
              degree={item.degree}
              degree_zh={item.degree_zh}
              skills={item.skills}
              transcript={item.transcript}
              onUpdated={() => {
                fetchAllEducation()
                .then((data) => setEducation(data))
                .catch(console.error)
              }}
            />
          ))}
        </div>
      </div>
      {modal && (
        <AddEducationModal
          onClose={() => setModal(false)}
          onAdded={() => {
            fetchAllEducation().then((data) => {
              console.log(data);
              setEducation(data);
            });
          }}
        />
      )}
    </div>
  )
}
