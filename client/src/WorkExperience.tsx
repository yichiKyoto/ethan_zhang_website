import { useContext, useEffect, useState } from 'react'
import NavBar from './NavBar'
import WorkExperienceCard from './WorkExperienceCard'
import AddWorkExperienceModal from './AddWorkExperienceModal'
import { fetchAllWorkExperience } from './backendHelpers'
import type { WorkExperience } from './backendHelpers'
import { Context } from './Context'
import LoadingSpinner from './LoadingSpinner'

export default function WorkExperience() {
  const { isAdmin, language, menuOpen } = useContext(Context)
  const isChinese = language === '中文'

  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)

  useEffect(() => {
    fetchAllWorkExperience()
      .then((data) => setWorkExperience(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const refresh = () => {
    fetchAllWorkExperience()
      .then((data) => setWorkExperience(data))
      .catch(console.error)
  }

  return (
    <div className={`flex h-dvh flex-col ${menuOpen && "max-md:overflow-hidden"}`}>
      <NavBar txtColor='text-black' bgColor='bg-purple-100' />
      <div className="flex flex-1 flex-col gap-3 bg-red-100 p-4">
        <div className="flex items-center gap-5 justify-center">
          <h1 className="text-3xl font-medium my-4 mx-2">
            {isChinese ? '工作经历' : 'Work Experience'}
          </h1>
          {isAdmin && (
            <button
              className="rounded-xl bg-red-200 px-8 py-3 hover:bg-red-300 cursor-pointer"
              onClick={() => setModal(true)}
            >
              {isChinese ? '添加工作经历' : 'Add Work Experience'}
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {loading ? <LoadingSpinner /> : workExperience.map((item) => (
            <WorkExperienceCard
              key={item.id}
              id={item.id}
              company={item.company}
              company_zh={item.company_zh}
              position={item.position}
              position_zh={item.position_zh}
              period={item.period}
              period_zh={item.period_zh}
              skills={item.skills}
              onUpdated={refresh}
            />
          ))}
        </div>
      </div>

      {modal && (
        <AddWorkExperienceModal
          onClose={() => setModal(false)}
          onAdded={() => {
            refresh()
            setModal(false)
          }}
        />
      )}
    </div>
  )
}
