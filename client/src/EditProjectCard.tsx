import { useRef, useState, useContext } from 'react'
import { updateProject, uploadProjectImage, type ProjectAttribute, type NewProject } from './backendHelpers'
import { Context } from './Context'
import LoadingSpinner from './LoadingSpinner'

const inputCls = "w-full min-w-0 rounded border border-gray-400 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400/50"

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
)

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
    <div className="relative inline-flex flex-col rounded-xl shadow-xl p-4 w-[700px] border border-black bg-purple-100 gap-4">

      {/* Save icon — top right */}
      <button
        type="button"
        disabled={saving}
        className="absolute right-3 top-3 cursor-pointer text-gray-600 hover:text-green-600 disabled:opacity-50 transition-colors"
        onClick={handleSave}
        title={isChinese ? '保存' : 'Save'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
        </svg>
      </button>

      {/* Title */}
      <div className="grid grid-cols-2 gap-2 pr-8">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">{isChinese ? '项目名称 (英文)' : 'Title (English)'}</label>
          <input className={inputCls} value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">{isChinese ? '项目名称 (中文)' : 'Title (Chinese)'}</label>
          <input className={inputCls} value={titleZh} onChange={e => setTitleZh(e.target.value)} />
        </div>
      </div>

      {/* GitHub */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">GitHub Link</label>
        <input className={inputCls} value={github} onChange={e => setGithub(e.target.value)} />
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
        <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-1">
          {attributes.map((attr, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className={`text-sm ${inputCls}`}
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
                className="shrink-0 cursor-pointer text-gray-400 hover:text-red-500 transition-colors"
                onClick={() => setAttributes(prev => prev.filter((_, j) => j !== i))}
              >
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="cursor-pointer self-start rounded-xl bg-red-200 px-4 py-2 text-sm hover:bg-red-300"
          onClick={() => setAttributes(prev => [...prev, { en: '', zh: '' }])}
        >
          {isChinese ? '添加特点' : 'Add Attribute'}
        </button>
      </div>
    </div>
  )
}
