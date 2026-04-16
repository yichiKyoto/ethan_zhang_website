import { useRef, useState, useContext } from 'react'
import { addGymCard } from './backendHelpers'
import { Context } from './Context'

export default function AddGymCardModal(props: {
  onClose: () => void
  onAdded: () => void
}) {
  const { onClose, onAdded } = props
  const { language } = useContext(Context)
  const isChinese = language === '中文'

  const [descriptionEn, setDescriptionEn] = useState('')
  const [descriptionZh, setDescriptionZh] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async () => {
    if (!imageFile) {
      window.alert(isChinese ? '请上传一张图片。' : 'Please upload an image.')
      return
    }
    setSubmitting(true)
    try {
      await addGymCard(imageFile, descriptionEn.trim(), descriptionZh.trim())
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
    <div className="fixed inset-0 z-50 flex min-h-dvh w-full flex-col gap-4 overflow-y-auto bg-[#1a1a1a] p-6">
      <div className="flex flex-col w-full items-center">
        <h1 className="text-2xl font-semibold text-white">{isChinese ? '更新进度' : 'Update Progress'}</h1>
        <p className="mt-1 text-sm text-white/60">{isChinese ? '上传健身照片和描述。' : 'Upload a gym photo and description.'}</p>
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">

        {/* Image upload */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-white/70">{isChinese ? '照片' : 'Photo'}</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => setImageFile(e.target.files?.[0] ?? null)}
          />
          {imageFile ? (
            <div className="relative w-fit">
              <img
                src={URL.createObjectURL(imageFile)}
                className="h-48 w-48 rounded-lg object-cover"
              />
              <button
                type="button"
                className="absolute -right-2 -top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                onClick={() => setImageFile(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="flex h-48 w-48 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-white/30 text-white/40 hover:border-white/60 hover:text-white/60"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          )}
        </div>

        {/* Description EN */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-white/70">{isChinese ? '描述 (英文)' : 'Description (English)'}</label>
          <textarea
            rows={3}
            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/30"
            placeholder={isChinese ? '用英文描述你的进步...' : 'Describe your progress in English...'}
            value={descriptionEn}
            onChange={e => setDescriptionEn(e.target.value)}
          />
        </div>

        {/* Description ZH */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-white/70">{isChinese ? '描述 (中文)' : 'Description (Chinese)'}</label>
          <textarea
            rows={3}
            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/30"
            placeholder={isChinese ? '用中文描述你的进步...' : 'Describe your progress in Chinese...'}
            value={descriptionZh}
            onChange={e => setDescriptionZh(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-end gap-3 border-t border-white/10 pt-4">
          <button
            type="button"
            className="cursor-pointer rounded-xl border border-white/30 px-8 py-3 text-white hover:bg-white/10"
            onClick={onClose}
          >
            {isChinese ? '关闭' : 'Close'}
          </button>
          <button
            type="button"
            disabled={submitting}
            className="cursor-pointer rounded-xl bg-white px-8 py-3 font-medium text-black hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => void handleSubmit()}
          >
            {submitting ? (isChinese ? '提交中…' : 'Submitting…') : (isChinese ? '提交' : 'Submit')}
          </button>
        </div>
      </div>
    </div>
  )
}
