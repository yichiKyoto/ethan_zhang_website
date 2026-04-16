import { useContext, useRef, useState } from "react"
import type { NewEducation, Skill } from "./backendHelpers"
import { updateEducation, uploadTranscript } from "./backendHelpers"
import { Context } from "./Context"


export default function EditEducationCard(props: {
  id: number;
  university: string;
  university_zh: string;
  period: string;
  period_zh: string;
  degree: string;
  degree_zh: string;
  skills: Skill[];
  transcript: string;
  setEducation: (education: NewEducation) => void | Promise<void>;
  onDelete: () => void | Promise<void>;
}) {
  const { language } = useContext(Context)
  const isChinese = language === '中文'

  const [uni, setUniversity] = useState(props.university)
  const [uniZh, setUniversityZh] = useState(props.university_zh)
  const [period, setPeriod] = useState(props.period)
  const [periodZh, setPeriodZh] = useState(props.period_zh)
  const [degree, setDegree] = useState(props.degree)
  const [degreeZh, setDegreeZh] = useState(props.degree_zh)
  const [skills, setSkills] = useState<Skill[]>(props.skills)
  const [transcript, setTranscript] = useState(props.transcript)
  const [transcriptError, setTranscriptError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [viewingChinese, setViewingChinese] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentEducation = (): NewEducation => ({
    university: uni, university_zh: uniZh,
    period, period_zh: periodZh,
    degree, degree_zh: degreeZh,
    skills, transcript,
  })

  const toggleLabel = viewingChinese
    ? (isChinese ? '英文版本' : 'View English Version')
    : (isChinese ? '中文版本' : 'View Chinese Version')

  return (
    <div className="relative flex w-full flex-col gap-2 rounded-lg p-4 bg-red-200 shadow-xl">
      <div className="flex min-w-0 flex-col justify-start gap-1">

        <div className="shake flex min-w-0 w-full items-center gap-2">
          <input
            className="text-2xl font-medium flex-1 bg-transparent outline-none"
            value={viewingChinese ? uniZh : uni}
            placeholder={viewingChinese ? '大学 (ZH)' : 'University (EN)'}
            onChange={(e) => viewingChinese ? setUniversityZh(e.target.value) : setUniversity(e.target.value)}
          />
        </div>

        <div className="shake flex min-w-0 w-full items-center gap-2">
          <input
            className="flex-1 bg-transparent outline-none text-lg font-medium text-gray-400"
            value={viewingChinese ? periodZh : period}
            placeholder={viewingChinese ? '时间段 (ZH)' : 'Period (EN)'}
            onChange={(e) => viewingChinese ? setPeriodZh(e.target.value) : setPeriod(e.target.value)}
          />
        </div>

        <div className="shake flex min-w-0 w-full items-center gap-2">
          <input
            className="flex-1 bg-transparent outline-none text-lg font-medium text-gray-400"
            value={viewingChinese ? degreeZh : degree}
            placeholder={viewingChinese ? '学位 (ZH)' : 'Degree (EN)'}
            onChange={(e) => viewingChinese ? setDegreeZh(e.target.value) : setDegree(e.target.value)}
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
                  await updateEducation(String(props.id), { ...currentEducation(), skills: newSkills })
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>

        <h4 className="mt-5 text-lg font-semibold">
          {isChinese ? '成绩单' : 'Academic Transcript'}
        </h4>
        <button
          type="button"
          className="w-fit cursor-pointer text-blue-700 underline decoration-blue-700/40 underline-offset-2 hover:text-blue-900 text-left"
          onClick={() => {
            if (transcript === '') {
              setTranscriptError(isChinese
                ? '暂无成绩单，请使用下方按钮上传。'
                : 'No transcript uploaded yet. Use the Upload button below to add one.')
              return
            }
            setTranscriptError(null)
            const a = document.createElement('a')
            a.href = transcript
            a.download = `transcript_${props.id}.pdf`
            a.target = '_blank'
            a.click()
          }}
        >
          {isChinese ? '查看成绩单' : 'View Academic Transcript'}
        </button>

        {transcriptError && (
          <p className="text-sm text-red-600">{transcriptError}</p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0]
            if (!file) return
            try {
              const url = await uploadTranscript(props.id, file)
              setTranscript(url)
              setTranscriptError(null)
            } catch {
              setTranscriptError(isChinese ? '上传失败，请重试。' : 'Failed to upload transcript. Please try again.')
            }
            e.target.value = ''
          }}
        />

        <div className="flex flex-wrap gap-1 my-5">
          <button
            type="button"
            className="cursor-pointer rounded-xl bg-red-300 px-8 py-3 opacity-80 transition-opacity duration-300 hover:bg-red-400 hover:opacity-100"
            onClick={async () => {
              setSaving(true)
              try {
                await props.setEducation(currentEducation())
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
            onClick={() => fileInputRef.current?.click()}
          >
            {isChinese ? '上传成绩单' : 'Upload Academic Transcript'}
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
