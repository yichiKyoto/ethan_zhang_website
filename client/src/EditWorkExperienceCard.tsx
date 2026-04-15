import { useContext, useState } from "react"
import type { NewWorkExperience, WorkSkill } from "./backendHelpers"
import { updateWorkExperience } from "./backendHelpers"
import { Context } from "./Context"

const inputCls = "w-full min-w-0 rounded border border-gray-400 px-2 py-1"

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
)

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
    <div className="relative flex w-[70%] flex-col gap-2 rounded-lg border-2 border-gray-300 bg-red-100 p-4">
      <div className="flex min-w-0 flex-col justify-start gap-1">

        <div className="flex min-w-0 w-full items-center gap-2">
          <input
            className="text-2xl font-medium flex-1 rounded border border-gray-400 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400/50"
            value={viewingChinese ? companyZh : company}
            placeholder={viewingChinese ? '公司 (ZH)' : 'Company (EN)'}
            onChange={(e) => viewingChinese ? setCompanyZh(e.target.value) : setCompany(e.target.value)}
          />
        </div>

        <div className="flex min-w-0 w-full items-center gap-2">
          <input
            className="flex-1 rounded border border-gray-400 px-2 py-1 text-lg font-medium text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400/50"
            value={viewingChinese ? periodZh : period}
            placeholder={viewingChinese ? '时间段 (ZH)' : 'Period (EN)'}
            onChange={(e) => viewingChinese ? setPeriodZh(e.target.value) : setPeriod(e.target.value)}
          />
        </div>

        <div className="flex min-w-0 w-full items-center gap-2">
          <input
            className="flex-1 rounded border border-gray-400 px-2 py-1 text-lg font-medium text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400/50"
            value={viewingChinese ? positionZh : position}
            placeholder={viewingChinese ? '职位 (ZH)' : 'Position (EN)'}
            onChange={(e) => viewingChinese ? setPositionZh(e.target.value) : setPosition(e.target.value)}
          />
        </div>

        <h4 className="mt-5 text-lg font-semibold">
          {viewingChinese ? '掌握的技能' : 'Skills Acquired'}
        </h4>

        <ul className="list-outside list-disc space-y-1 pl-6 marker:text-gray-600">
          {skills.map((item, index) => (
            <li key={index} className="min-w-0">
              <div className="flex items-center gap-1">
                <input
                  className={`text-sm ${inputCls}`}
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
                  className="shrink-0 cursor-pointer text-gray-400 hover:text-red-500 transition-colors duration-150"
                  onClick={async () => {
                    const newSkills = skills.filter((_, i) => i !== index)
                    setSkills(newSkills)
                    await updateWorkExperience(String(props.id), { ...currentWork(), skills: newSkills })
                  }}
                >
                  <TrashIcon />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-1 my-5">
          <button
            type="button"
            className="cursor-pointer rounded-xl bg-red-200 px-8 py-3 opacity-80 transition-opacity duration-300 hover:bg-red-300 hover:opacity-100"
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
            className="cursor-pointer rounded-xl bg-red-200 px-8 py-3 hover:bg-red-300"
            onClick={() => setSkills(prev => [...prev, { en: '', zh: '' }])}
          >
            {isChinese ? '添加技能' : 'Add Skill'}
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-xl bg-red-200 px-8 py-3 hover:bg-red-300"
            onClick={() => void props.onDelete()}
          >
            {isChinese ? '删除' : 'Delete'}
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-xl bg-blue-100 px-8 py-3 hover:bg-blue-200"
            onClick={() => setViewingChinese(prev => !prev)}
          >
            {toggleLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
