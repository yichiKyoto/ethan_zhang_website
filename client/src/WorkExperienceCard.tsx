import { useContext, useEffect, useState } from "react"
import EditWorkExperienceCard from "./EditWorkExperienceCard"
import { deleteWorkExperience, type WorkExperience, updateWorkExperience } from "./backendHelpers"
import { Context } from "./Context"

export default function WorkExperienceCard(props: {
  id: number
  company: string
  company_zh: string
  position: string
  position_zh: string
  period: string
  period_zh: string
  skills: WorkExperience['skills']
  onUpdated: () => void
}) {
  const { isAdmin, language } = useContext(Context)
  const [work, setWork] = useState<WorkExperience>({ ...props })
  const { company, company_zh, position, position_zh, period, period_zh, skills } = work
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const zh = language === '中文'

  useEffect(() => {
    setWork({ ...props })
  }, [props.id, props.company, props.company_zh, props.position, props.position_zh, props.period, props.period_zh, props.skills])

  if (isEditing) {
    return (
      <EditWorkExperienceCard
        id={props.id}
        company={company} company_zh={company_zh}
        position={position} position_zh={position_zh}
        period={period} period_zh={period_zh}
        skills={skills}
        setWork={async (nextWork) => {
          try {
            setSaving(true)
            await updateWorkExperience(String(props.id), nextWork)
            setWork({ id: props.id, ...nextWork })
            props.onUpdated()
            setIsEditing(false)
          } catch (error) {
            console.error(error)
            window.alert(zh ? '更新失败。' : 'Failed to update work experience.')
          } finally {
            setSaving(false)
          }
        }}
        onDelete={async () => {
          try {
            setDeleting(true)
            await deleteWorkExperience(String(props.id))
            props.onUpdated()
          } catch (error) {
            console.error(error)
            window.alert(zh ? '删除失败。' : 'Failed to delete work experience.')
          } finally {
            setDeleting(false)
          }
        }}
      />
    )
  }

  return (
    <div className="flex w-[70%] flex-col gap-2 rounded-lg border-2 border-gray-300 bg-red-100 p-4 relative">
      <div className="flex flex-col justify-start">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-2xl font-medium">{zh ? (company_zh || company) : company}</h2>
          <h3 className="text-lg font-medium text-gray-400">{zh ? (period_zh || period) : period}</h3>
        </div>
        <h3 className="text-lg font-medium text-gray-400">{zh ? (position_zh || position) : position}</h3>
        <h4 className="mt-5 text-lg font-semibold">{zh ? '掌握的技能' : 'Skills Acquired'}</h4>
        <ul className="list-outside list-disc space-y-1 pl-6 marker:text-gray-600">
          {skills.map((item, i) => (
            <li key={i}>{zh ? (item.zh || item.en) : item.en}</li>
          ))}
        </ul>
        {isAdmin && (
          <div className="my-5 flex gap-2">
            <button
              disabled={saving || deleting}
              className="opacity-80 hover:opacity-100 transition-opacity duration-300 rounded-xl bg-red-200 hover:bg-red-300 px-8 py-3 cursor-pointer self-start disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => setIsEditing(true)}
            >
              {zh ? '编辑' : 'Edit'}
            </button>
            <button
              disabled={deleting || saving}
              className="opacity-80 hover:opacity-100 transition-opacity duration-300 rounded-xl bg-red-200 hover:bg-red-300 px-8 py-3 cursor-pointer self-start disabled:cursor-not-allowed disabled:opacity-60"
              onClick={async () => {
                try {
                  setDeleting(true)
                  await deleteWorkExperience(String(props.id))
                  props.onUpdated()
                } catch (error) {
                  console.error(error)
                  window.alert(zh ? '删除失败。' : 'Failed to delete work experience.')
                } finally {
                  setDeleting(false)
                }
              }}
            >
              {deleting ? (zh ? '删除中...' : 'Deleting...') : (zh ? '删除' : 'Delete')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
