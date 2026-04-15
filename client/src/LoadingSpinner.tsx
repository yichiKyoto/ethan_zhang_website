import { useContext } from 'react'
import { Context } from './Context'

export default function LoadingSpinner() {
  const { language } = useContext(Context)
  const isChinese = language === '中文'

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-200 border-t-red-500" />
        <p className="text-sm text-gray-500">{isChinese ? '加载中' : 'Loading...'}</p>
      </div>
    </div>
  )
}
