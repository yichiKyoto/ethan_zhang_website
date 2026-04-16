import { useState, useContext } from 'react';
import { deleteProject, type NewProject, type ProjectAttribute } from './backendHelpers'
import { Context } from './Context'
import EditProjectCard from './EditProjectCard'

export default function ProjectCard(props: {id : number, title: string, title_zh: string, github: string, images: string[], attributes: ProjectAttribute[], index: number, handleDelete: (index: number) => void}) {
  const { images: initialImages, title, title_zh, github, attributes, id } = props;
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [current, setCurrent] = useState<NewProject>({ title, title_zh, github, images: initialImages, attributes })

  const { language, isAdmin } = useContext(Context)
  const isChinese = language === '中文'

  const images = current.images

  const changeImage = (next: (i: number) => number) => {
    setFading(true)
    setTimeout(() => {
      setIndex(next)
      setImgLoading(true)
      setFading(false)
    }, 100)
  }

  const prev = () => changeImage(i => (i - 1 + images.length) % images.length)
  const next = () => changeImage(i => (i + 1) % images.length)

  const supabaseDelete = async () => {
    setDeleting(true)
    try {
      await deleteProject(String(id))
    } catch (e) {
      console.error(e)
      setDeleting(false)
    }
  }

  if (editing) {
    return (
      <EditProjectCard
        id={id}
        title={current.title}
        title_zh={current.title_zh}
        github={current.github}
        images={current.images}
        attributes={current.attributes}
        onSave={(updated) => {
          setCurrent(updated)
          setEditing(false)
          setIndex(0)
        }}
      />
    )
  }

  return (
    <div className="relative inline-flex flex-col rounded-xl shadow-xl items-center border-black border-1 bg-purple-200 p-2 w-full h-full">

      {/* Admin icons — top right */}
      {isAdmin && (
        <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
          <button
            type="button"
            className="cursor-pointer text-gray-600 hover:text-blue-600 transition-colors"
            onClick={() => setEditing(true)}
            title={isChinese ? '编辑' : 'Edit'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </button>
          <button
            type="button"
            disabled={deleting}
            className="cursor-pointer text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
            onClick={() => {
              supabaseDelete()
              .then(() => {
                props.handleDelete(props.index);
              })
            }}
            title={isChinese ? '删除' : 'Delete'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        </div>
      )}

      <div className="relative bg-white rounded-xl flex items-center justify-center max-h-[500px] flex-col">
        {images.length === 0 && (
          <p className="text-center text-xl">no image!</p>
        )}
        {images.length > 0 && (
          <>
            {imgLoading && (
              <div className="flex items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-200 border-t-red-500" />
              </div>
            )}
            <img
              src={images[index]}
              onLoad={() => setImgLoading(false)}
              onLoadStart={() => setImgLoading(true)}
              className={`h-full rounded-lg object-contain transition-opacity duration-200 ${fading || imgLoading ? 'opacity-0' : 'opacity-100'}`}
            />
            {images.length > 1 && (
          <>
            <button className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/30 p-1 text-white hover:bg-black/50" onClick={prev}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/30 p-1 text-white hover:bg-black/50" onClick={next}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </>
        )}
          </>
        )}

      </div>
      {/*github and title stored here*/}
      <div className="flex gap-2 items-center justify-center py-5 w-full max-md:flex-col overflow-hidden">
        <h1 className="max-md:text-base text-xl shrink-0">
          {isChinese ? (current.title_zh || current.title) : current.title}
        </h1>
        <div className="h-2 w-2 rounded-full bg-black shrink-0" />
        <a href={current.github} className="max-md:text-base text-xl text-black/30 hover:text-black/50 min-w-0 truncate">
          {current.github}
        </a>
      </div>

      <div className="flex flex-wrap gap-2 px-4 pb-4 w-full justify-center">
        {current.attributes.map((attr, i) => (
          <span key={i} className="rounded-full bg-purple-300 px-3 py-1 text-sm font-medium text-purple-900 max-md:text-xs">
            {isChinese ? (attr.zh || attr.en) : attr.en}
          </span>
        ))}
      </div>
    </div>
  )
}
