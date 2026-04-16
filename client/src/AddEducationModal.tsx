import { useRef, useState, useContext } from "react"
import Input from "./Input"
import { addEducation, uploadTranscript } from "./backendHelpers"
import type { NewEducation, Skill } from "./backendHelpers"
import { Context } from "./Context"


const zh = {
  university : "大学",
  degree : "学位",
  period: "时间段",
  transcript: "成绩单 (PDF)",
  choosePdf: "选择 PDF",
  addSkill: "添加技术"
}

export default function AddEducationModal(props: {
  onClose: () => void
  onAdded: () => void
}) {
  const { onClose, onAdded } = props
  const [university, setUniversity] = useState('')
  const [universityZh, setUniversityZh] = useState('')
  const [period, setPeriod] = useState('')
  const [periodZh, setPeriodZh] = useState('')
  const [degree, setDegree] = useState('')
  const [degreeZh, setDegreeZh] = useState('')
  const [skills, setSkills] = useState<Skill[]>([])
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { language } = useContext(Context);
  const isChinese = language === '中文'
  const handleDeleteSkill = (index: number) => {
    setSkills(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const payload: NewEducation = {
        university: university.trim(),
        university_zh: universityZh.trim(),
        degree: degree.trim(),
        degree_zh: degreeZh.trim(),
        period: period.trim(),
        period_zh: periodZh.trim(),
        skills,
        transcript: '',
      }
      const created = await addEducation(payload)
      if (transcriptFile) {
        await uploadTranscript(created.id, transcriptFile)
      }
      onAdded()
      onClose()
    } catch (e) {
      console.error(e)
      window.alert("Could not save education. Check the network and try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex min-h-dvh w-full flex-col gap-4 overflow-y-auto bg-[#FFD6C9] p-6">
      <div className="flex flex-col w-full items-center">
        <h1 className="text-2xl font-semibold text-black">{isChinese ? '添加教育经历' : 'Add Education'}</h1>
        <p className="mt-1 text-sm text-black/70">{isChinese ? '请填写您的教育详情。' : 'Add your education details.'}</p>
      </div>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">

        <div className="grid min-w-0 grid-cols-2 gap-4 [&>*]:min-w-0">
          <Input label={isChinese ? `${zh.university} (英文)` : 'University (English)'} type="text" value={university} onChange={(e) => setUniversity(e.target.value)} />
          <Input label={isChinese ? `${zh.university} (中文)` : 'University (Chinese)'} type="text" value={universityZh} onChange={(e) => setUniversityZh(e.target.value)} />
          <Input label={isChinese ? `${zh.degree} (英文)` : 'Degree (English)'} type="text" value={degree} onChange={(e) => setDegree(e.target.value)} />
          <Input label={isChinese ? `${zh.degree} (中文)` : 'Degree (Chinese)'} type="text" value={degreeZh} onChange={(e) => setDegreeZh(e.target.value)} />
          <Input label={isChinese ? `${zh.period} (英文)` : 'Period (English)'} type="text" value={period} onChange={(e) => setPeriod(e.target.value)} />
          <Input label={isChinese ? `${zh.period} (中文)` : 'Period (Chinese)'} type="text" value={periodZh} onChange={(e) => setPeriodZh(e.target.value)} />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">{isChinese ? zh.transcript : 'Transcript (PDF)'}</label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden overflow-hidden"
              onChange={(e) => {
                setTranscriptFile(e.target.files?.[0] ?? null)
                e.target.value = ''
              }}

            />
            <button
              type="button"
              className="cursor-pointer rounded border border-gray-400 px-3 py-2 text-left text-sm text-gray-700 hover:bg-red-50 overflow-hidden"
              onClick={() => fileInputRef.current?.click()}
            >
              {transcriptFile ? transcriptFile.name : (isChinese ? zh.choosePdf : 'Choose PDF…')}
            </button>
          </div>
        </div>

        <div className="flex min-h-0 max-h-[300px] flex-col gap-3 overflow-y-auto pr-1 max-md:items-center gap-10">
          {skills.map((skill, index) => (
            <div key={index} className="grid min-w-0 grid-cols-[1fr_1fr_auto] items-end gap-x-2 max-md:flex max-md:flex-col">
              <Input
                type="text"
                label={isChinese ? `技能 ${index + 1} (英文)` : `Skill ${index + 1} (English)`}
                value={skill.en}
                onChange={(e) => {
                  const updated = [...skills]
                  updated[index] = { ...updated[index], en: e.target.value }
                  setSkills(updated)
                }}
              />
              <Input
                type="text"
                label={isChinese ? `技能 ${index + 1} (中文)` : `Skill ${index + 1} (Chinese)`}
                value={skill.zh}
                onChange={(e) => {
                  const updated = [...skills]
                  updated[index] = { ...updated[index], zh: e.target.value }
                  setSkills(updated)
                }}
              />
              <button
                type="button"
                className="shrink-0 cursor-pointer rounded-lg p-2 text-gray-700 hover:bg-red-200/60"
                aria-label="Remove skill"
                onClick={() => handleDeleteSkill(index)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="w-full shrink-0 cursor-pointer rounded-xl bg-red-200 px-8 py-3 hover:bg-red-300 sm:w-auto sm:self-start"
          onClick={() => setSkills(prev => [...prev, { en: '', zh: '' }])}
        >
          {isChinese ? zh.addSkill : 'Add Skill'}
        </button>

        <div className="flex flex-wrap justify-end gap-3 border-t border-black/10 pt-4">
          <button
            type="button"
            className="cursor-pointer rounded-xl border border-gray-600 bg-white px-8 py-3 text-gray-800 hover:bg-gray-100"
            onClick={onClose}
          >
            {isChinese ? '关闭' : 'Close'}
          </button>
          <button
            type="button"
            disabled={submitting}
            className="cursor-pointer rounded-xl bg-red-300 px-8 py-3 font-medium hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => void handleSubmit()}
          >
            {submitting ? (isChinese ? '提交中…' : 'Submitting…') : (isChinese ? '提交' : 'Submit')}
          </button>
        </div>
      </div>
    </div>
  )
}
