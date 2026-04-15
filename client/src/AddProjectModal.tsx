import { useRef, useState, useContext } from "react"
import Input from "./Input"
import { addProject, type ProjectAttribute } from "./backendHelpers"
import { Context } from "./Context"

export default function AddProjectModal(props: {
  onClose: () => void
  onAdded: () => void
}) {
  const { onClose, onAdded } = props
  const { language } = useContext(Context)
  const isChinese = language === '中文'

  const [title, setTitle] = useState('')
  const [titleZh, setTitleZh] = useState('')
  const [github, setGithub] = useState('')
  const [attributes, setAttributes] = useState<ProjectAttribute[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDeleteAttribute = (index: number) => {
    setAttributes(prev => prev.filter((_, i) => i !== index))
  }

  const handleDeleteImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await addProject(title.trim(), titleZh.trim(), github.trim(), imageFiles, attributes)
      onAdded()
      onClose()
    } catch (e) {
      console.error(e)
      window.alert(isChinese ? '保存失败，请检查网络后重试。' : 'Could not save. Check the network and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex min-h-dvh w-full flex-col gap-4 overflow-y-auto bg-[#FFD6C9] p-6">
      <div className="flex flex-col w-full items-center">
        <h1 className="text-2xl font-semibold text-black">{isChinese ? '添加项目' : 'Add Project'}</h1>
        <p className="mt-1 text-sm text-black/70">{isChinese ? '请填写项目详情。' : 'Add your project details.'}</p>
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <div className="grid min-w-0 grid-cols-2 gap-4 [&>*]:min-w-0">
          <Input
            label={isChinese ? '项目名称 (英文)' : 'Title (English)'}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            label={isChinese ? '项目名称 (中文)' : 'Title (Chinese)'}
            type="text"
            value={titleZh}
            onChange={(e) => setTitleZh(e.target.value)}
          />
          <Input
            label={isChinese ? 'GitHub 链接' : 'GitHub Link'}
            type="text"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
          />
        </div>

        {/* Images */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">{isChinese ? '项目截图' : 'Project Screenshots'}</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files ?? [])
              setImageFiles(prev => [...prev, ...files])
              e.target.value = ''
            }}
          />
          <div className="flex flex-wrap gap-2">
            {imageFiles.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  className="h-20 w-20 rounded object-cover"
                />
                <button
                  type="button"
                  className="absolute -right-1 -top-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-red-400 text-white hover:bg-red-500"
                  onClick={() => handleDeleteImage(index)}
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
        <div className="flex min-h-0 max-h-[300px] flex-col gap-3 overflow-y-auto pr-1">
          {attributes.map((attr, index) => (
            <div key={index} className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-end gap-x-2">
              <Input
                type="text"
                label={isChinese ? `特点 ${index + 1} (英文)` : `Attribute ${index + 1} (English)`}
                value={attr.en}
                onChange={(e) => {
                  const updated = [...attributes]
                  updated[index] = { ...updated[index], en: e.target.value }
                  setAttributes(updated)
                }}
              />
              <Input
                type="text"
                label={isChinese ? `特点 ${index + 1} (中文)` : `Attribute ${index + 1} (Chinese)`}
                value={attr.zh}
                onChange={(e) => {
                  const updated = [...attributes]
                  updated[index] = { ...updated[index], zh: e.target.value }
                  setAttributes(updated)
                }}
              />
              <button
                type="button"
                className="shrink-0 cursor-pointer rounded-lg p-2 text-gray-700 hover:bg-red-200/60"
                onClick={() => handleDeleteAttribute(index)}
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
          onClick={() => setAttributes(prev => [...prev, { en: '', zh: '' }])}
        >
          {isChinese ? '添加特点' : 'Add Attribute'}
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
