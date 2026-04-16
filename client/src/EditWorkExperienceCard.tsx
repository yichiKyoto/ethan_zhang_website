import { useContext, useState } from "react"
import type { NewWorkExperience, WorkSkill } from "./backendHelpers"
import { updateWorkExperience } from "./backendHelpers"
import { Context } from "./Context"


export default function EditWorkExperienceCard(props: {
  id: number
  company: string
  company_zh: string
  position: string
  position_zh: string
  period: string
  period_zh: string
  skills: WorkSkill[]
  setWork: (work: NewWorkExperience) => void | Promise<void>
  onDelete: () => void | Promise<void>
}) {
  const { language } = useContext(Context)
  const isChinese = language === '中文'

  const [company, setCompany] = useState(props.company)
  const [companyZh, setCompanyZh] = useState(props.company_zh)
  const [position, setPosition] = useState(props.position)
  const [positionZh, setPositionZh] = useState(props.position_zh)
  const [period, setPeriod] = useState(props.period)
  const [periodZh, setPeriodZh] = useState(props.period_zh)
  const [skills, setSkills] = useState<WorkSkill[]>(props.skills)
  const [saving, setSaving] = useState(false)
  const [viewingChinese, setViewingChinese] = useState(false)

  const currentWork = (): NewWorkExperience => ({
    company, company_zh: companyZh,
    position, position_zh: positionZh,
    period, period_zh: periodZh,
    skills,
  })

  const toggleLabel = viewingChinese
    ? (isChinese ? '英文版本' : 'View English Version')
    : (isChinese ? '中文版本' : 'View Chinese Version')

  return (
    <div className="relative flex w-full flex-col gap-2 rounded-lg bg-red-200 p-4 shadow-xl">
      <div className="flex min-w-0 flex-col justify-start gap-1">

        <div className="flex min-w-0 w-full items-center gap-2">
          <input
            className="text-2xl font-medium flex-1 rounded px-2 py-1 focus:outline-none shake"
            value={viewingChinese ? companyZh : company}
            placeholder={viewingChinese ? '公司 (ZH)' : 'Company (EN)'}
            onChange={(e) => viewingChinese ? setCompanyZh(e.target.value) : setCompany(e.target.value)}
          />
        </div>

        <div className="flex min-w-0 w-full items-center gap-2">
          <input
            className="flex-1 rounded px-2 py-1 text-lg font-medium text-gray-400 focus:outline-none shake"
            value={viewingChinese ? periodZh : period}
            placeholder={viewingChinese ? '时间段 (ZH)' : 'Period (EN)'}
            onChange={(e) => viewingChinese ? setPeriodZh(e.target.value) : setPeriod(e.target.value)}
          />
        </div>

        <div className="flex min-w-0 w-full items-center gap-2">
          <input
            className="flex-1 rounded px-2 py-1 text-lg font-medium text-gray-400 focus:outline-none shake"
            value={viewingChinese ? positionZh : position}
            placeholder={viewingChinese ? '职位 (ZH)' : 'Position (EN)'}
            onChange={(e) => viewingChinese ? setPositionZh(e.target.value) : setPosition(e.target.value)}
          />
        </div>

        <h4 className="mt-5 text-lg font-semibold">
          {viewingChinese ? '掌握的技能' : 'Skills Acquired'}
        </h4>

        <div className="shake mt-2 flex flex-wrap gap-2">
          {skills.map((item, index) => (
            <span key={index} className="flex items-center gap-1 rounded-full bg-purple-300 px-3 py-1 text-sm font-medium text-purple-900">
              <input
                className="bg-transparent min-w-0 w-24 outline-none placeholder-purple-600"
                value={viewingChinese ? item.zh : item.en}
                placeholder={viewingChinese ? '技能 (ZH)' : 'Skill (EN)'}
                onChange={(e) => {
                  const updated = [...skills]
                  updated[index] = viewingChinese
                    ? { ...updated[index], zh: e.target.value }
                    : { ...updated[index], en: e.target.value }
                  setSkills(updated)
                }}
              />
              <button
                type="button"
                className="shrink-0 cursor-pointer text-purple-600 hover:text-red-500 transition-colors duration-150"
                onClick={async () => {
                  const newSkills = skills.filter((_, i) => i !== index)
                  setSkills(newSkills)
                  await updateWorkExperience(String(props.id), { ...currentWork(), skills: newSkills })
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-1 my-5">
          <button
            type="button"
            className="cursor-pointer rounded-xl bg-red-300 px-8 py-3 opacity-80 transition-opacity duration-300 hover:bg-red-400 hover:opacity-100"
            onClick={async () => {
              setSaving(true)
              try {
                await props.setWork(currentWork())
              } finally {
                setSaving(false)
              }
            }}
          >
            {saving ? (isChinese ? '保存中...' : 'Saving...') : (isChinese ? '保存' : 'Save')}
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-xl bg-red-300 px-8 py-3 hover:bg-red-400"
            onClick={() => setSkills(prev => [...prev, { en: '', zh: '' }])}
          >
            {isChinese ? '添加技能' : 'Add Skill'}
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-xl bg-red-300 px-8 py-3 hover:bg-red-400"
            onClick={() => void props.onDelete()}
          >
            {isChinese ? '删除' : 'Delete'}
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-xl bg-red-300 px-8 py-3 hover:bg-red-400"
            onClick={() => setViewingChinese(prev => !prev)}
          >
            {toggleLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
