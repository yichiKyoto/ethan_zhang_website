import { useRef, useState, useContext } from 'react'
import { updateGymCard, type GymCard } from './backendHelpers'
import { Context } from './Context'

export default function EditGymCardModal(props: {
  card: GymCard
  onClose: () => void
  onUpdated: () => void
}) {
  const { card, onClose, onUpdated } = props
  const { language } = useContext(Context)
  const isChinese = language === '中文'

  const [descriptionEn, setDescriptionEn] = useState(card.description_en)
  const [descriptionZh, setDescriptionZh] = useState(card.description_zh)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await updateGymCard(
        String(card.id),
        descriptionEn.trim(),
        descriptionZh.trim(),
        imageFile ?? undefined
      )
      onUpdated()
      onClose()
    } catch (e) {
      console.error(e)
      window.alert(isChinese ? '保存失败，请检查网络后重试。' : 'Could not save. Check the network and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const previewSrc = imageFile ? URL.createObjectURL(imageFile) : card.image_url

  return (
    <div className="fixed inset-0 z-50 flex min-h-dvh w-full flex-col gap-4 overflow-y-auto bg-[#1a1a1a] p-6">
      <div className="flex flex-col w-full items-center">
        <h1 className="text-2xl font-semibold text-white">{isChinese ? '编辑进度' : 'Edit Progress'}</h1>
        <p className="mt-1 text-base text-white/60">{isChinese ? '更新健身照片和描述。' : 'Update the gym photo and description.'}</p>
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">

        {/* Image upload */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-white/70 text-base">{isChinese ? '照片' : 'Photo'}</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => setImageFile(e.target.files?.[0] ?? null)}
          />
          <div className="relative w-fit">
            <img
              src={previewSrc}
              className="h-48 w-48 rounded-lg object-cover"
            />
            {imageFile && (
              <button
                type="button"
                className="absolute -right-2 -top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                onClick={() => setImageFile(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <button
              type="button"
              className="absolute bottom-1 right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
              onClick={() => fileInputRef.current?.click()}
              title={isChinese ? '更换图片' : 'Change photo'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Description EN */}
        <div className="flex flex-col gap-2">
          <label className="text-base font-medium text-white/70">{isChinese ? '描述 (英文)' : 'Description (English)'}</label>
          <textarea
            rows={3}
            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
            placeholder={isChinese ? '用英文描述你的进步...' : 'Describe your progress in English...'}
            value={descriptionEn}
            onChange={e => setDescriptionEn(e.target.value)}
          />
        </div>

        {/* Description ZH */}
        <div className="flex flex-col gap-2">
          <label className="text-base font-medium text-white/70">{isChinese ? '描述 (中文)' : 'Description (Chinese)'}</label>
          <textarea
            rows={3}
            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
            placeholder={isChinese ? '用中文描述你的进步...' : 'Describe your progress in Chinese...'}
            value={descriptionZh}
            onChange={e => setDescriptionZh(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-end gap-3 border-t border-white/10 pt-4">
          <button
            type="button"
            className="cursor-pointer rounded-xl border border-white/30 px-8 py-3 text-white hover:bg-white/10 text-sm"
            onClick={onClose}
          >
            {isChinese ? '关闭' : 'Close'}
          </button>
          <button
            type="button"
            disabled={submitting}
            className="cursor-pointer rounded-xl bg-white px-8 py-3 font-medium text-black hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60 text-sm"
            onClick={() => void handleSubmit()}
          >
            {submitting ? (isChinese ? '保存中…' : 'Saving…') : (isChinese ? '保存' : 'Save')}
          </button>
        </div>
      </div>
    </div>
  )
}
