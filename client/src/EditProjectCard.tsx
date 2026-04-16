import { useRef, useState, useContext } from 'react'
import { updateProject, uploadProjectImage, type ProjectAttribute, type NewProject } from './backendHelpers'
import { Context } from './Context'
import LoadingSpinner from './LoadingSpinner'


export default function EditProjectCard(props: {
  id: number
  title: string
  title_zh: string
  github: string
  images: string[]
  attributes: ProjectAttribute[]
  onSave: (project: NewProject) => void
}) {
  const { language } = useContext(Context)
  const isChinese = language === '中文'

  const [title, setTitle] = useState(props.title)
  const [titleZh, setTitleZh] = useState(props.title_zh)
  const [github, setGithub] = useState(props.github)
  const [keptImages, setKeptImages] = useState<string[]>(props.images)
  const [newImageFiles, setNewImageFiles] = useState<File[]>([])
  const [attributes, setAttributes] = useState<ProjectAttribute[]>(props.attributes)
  const [saving, setSaving] = useState(false)
  const [viewingChinese, setViewingChinese] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const toggleLabel = viewingChinese
    ? (isChinese ? '英文版本' : 'View English Version')
    : (isChinese ? '中文版本' : 'View Chinese Version')

  const handleSave = async () => {
    setSaving(true)
    try {
      const uploadedUrls = await Promise.all(
        newImageFiles.map(file => uploadProjectImage(props.id, file))
      )
      const allImages = [...keptImages, ...uploadedUrls]
      const updated: NewProject = {
        title,
        title_zh: titleZh,
        github,
        images: allImages,
        attributes,
      }
      await updateProject(String(props.id), updated)
      props.onSave(updated)
    } catch (e) {
      console.error(e)
      window.alert(isChinese ? '保存失败，请检查网络后重试。' : 'Could not save. Check the network and try again.')
    } finally {
      setSaving(false)
    }
  }

  if (saving) {
    return (
      <div className="inline-flex w-[700px] rounded-xl shadow-xl border border-black bg-purple-100 p-5">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="inline-flex flex-col rounded-xl shadow-xl p-4 w-[700px] border border-black bg-purple-100 gap-4">

      {/* Title */}
      <div className="grid grid-cols-2 gap-2 pr-8">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">{isChinese ? '项目名称 (英文)' : 'Title (English)'}</label>
          <input className="w-full min-w-0 rounded border border-gray-400 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400/50" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">{isChinese ? '项目名称 (中文)' : 'Title (Chinese)'}</label>
          <input className="w-full min-w-0 rounded border border-gray-400 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400/50" value={titleZh} onChange={e => setTitleZh(e.target.value)} />
        </div>
      </div>

      {/* GitHub */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">GitHub Link</label>
        <input className="w-full min-w-0 rounded border border-gray-400 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400/50" value={github} onChange={e => setGithub(e.target.value)} />
      </div>

      {/* Images */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">{isChinese ? '项目截图' : 'Screenshots'}</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => {
            const files = Array.from(e.target.files ?? [])
            setNewImageFiles(prev => [...prev, ...files])
            e.target.value = ''
          }}
        />
        <div className="flex flex-wrap gap-2">
          {keptImages.map((url, i) => (
            <div key={`kept-${i}`} className="relative">
              <img src={url} className="h-20 w-20 rounded object-cover" />
              <button
                type="button"
                className="absolute -right-1 -top-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-red-400 text-white hover:bg-red-500"
                onClick={() => setKeptImages(prev => prev.filter((_, j) => j !== i))}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          {newImageFiles.map((file, i) => (
            <div key={`new-${i}`} className="relative">
              <img src={URL.createObjectURL(file)} className="h-20 w-20 rounded object-cover" />
              <button
                type="button"
                className="absolute -right-1 -top-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-red-400 text-white hover:bg-red-500"
                onClick={() => setNewImageFiles(prev => prev.filter((_, j) => j !== i))}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <button
            type="button"
            className="flex h-20 w-20 cursor-pointer items-center justify-center rounded border-2 border-dashed border-gray-400 text-gray-400 hover:border-gray-600 hover:text-gray-600"
            onClick={() => fileInputRef.current?.click()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Attributes */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-500">{isChinese ? '特点' : 'Attributes'}</label>
          <button
            type="button"
            className="text-xs cursor-pointer rounded bg-blue-100 px-2 py-1 hover:bg-blue-200"
            onClick={() => setViewingChinese(p => !p)}
          >
            {toggleLabel}
          </button>
        </div>
        <div className="shake flex flex-wrap gap-2 max-h-[200px] overflow-y-auto pr-1">
          {attributes.map((attr, i) => (
            <span key={i} className="flex items-center gap-1 rounded-full bg-purple-300 px-3 py-1 text-sm font-medium text-purple-900">
              <input
                className="bg-transparent min-w-0 w-24 outline-none placeholder-purple-600"
                value={viewingChinese ? attr.zh : attr.en}
                placeholder={viewingChinese ? '特点 (ZH)' : 'Attribute (EN)'}
                onChange={e => {
                  const updated = [...attributes]
                  updated[i] = viewingChinese
                    ? { ...updated[i], zh: e.target.value }
                    : { ...updated[i], en: e.target.value }
                  setAttributes(updated)
                }}
              />
              <button
                type="button"
                className="shrink-0 cursor-pointer text-purple-600 hover:text-red-500 transition-colors duration-150"
                onClick={() => setAttributes(prev => prev.filter((_, j) => j !== i))}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="cursor-pointer self-start rounded-xl bg-red-200 px-4 py-2 text-sm hover:bg-red-300"
            onClick={() => setAttributes(prev => [...prev, { en: '', zh: '' }])}
          >
            {isChinese ? '添加特点' : 'Add Attribute'}
          </button>
          <button
            type="button"
            disabled={saving}
            className="cursor-pointer self-start rounded-xl bg-red-200 px-4 py-2 text-sm hover:bg-red-300 disabled:opacity-50"
            onClick={handleSave}
          >
            {saving ? (isChinese ? '保存中...' : 'Saving...') : (isChinese ? '保存' : 'Save')}
          </button>
        </div>
      </div>
    </div>
  )
}
