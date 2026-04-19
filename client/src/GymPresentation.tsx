import React, { useContext, useEffect, useRef, useState } from "react"
import { getAllGymCards, deleteGymCard, type GymCard } from "./backendHelpers"
import { GymCard as GymCardComponent } from "./GymCard"
import { Context } from "./Context"
import EditGymCardModal from "./EditGymCardModal"

export default function GymPresentation({ refreshKey }: { refreshKey: number }) {
  const [gymCards, setGymCards] = useState<GymCard[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentCard, setCurrentCard] = useState<undefined | GymCard>(gymCards.length !== 0 ? gymCards[currentIndex] : undefined);
  const [progress, setProgress] = useState<number>(0)
  const [dragging, setDragging] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)
  const { isAdmin, language } = useContext(Context)
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getAllGymCards().then((data) => setGymCards(data)).finally(() => {
      setIsLoading(false);
    })
  }, [refreshKey])

  useEffect(() => {
    let newIndex = Math.floor((progress / 100) * gymCards.length)
    if (newIndex >= gymCards.length) newIndex = gymCards.length - 1
    if (newIndex < 0) newIndex = 0
    setCurrentIndex(newIndex);
    setCurrentCard(gymCards[newIndex]);
  }, [progress, gymCards.length])

  const getPercent = (clientX: number) => {
    if (!barRef.current) return 0
    const rect = barRef.current.getBoundingClientRect()
    const percent = ((clientX - rect.left) / rect.width) * 100
    return Math.min(100, Math.max(0, percent))
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true)
    setProgress(getPercent(e.clientX))
  }

  useEffect(() => {
    if (!dragging) return

    const onMouseMove = (e: MouseEvent) => setProgress(getPercent(e.clientX))
    const onMouseUp = (e: MouseEvent) => {
      setProgress(getPercent(e.clientX))
      setDragging(false)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [dragging])

  useEffect(() => {
    if (dragging || gymCards.length === 0) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev + 0.1 >= 100) {
          return 0;
        }
        return prev + 0.1;
      })
    }, 50)

    return () => clearInterval(interval)
  }, [dragging, gymCards.length])

  const handleDelete = async () => {
    if (!currentCard) return
    try {
      await deleteGymCard(String(currentCard.id))
      const updated = gymCards.filter(c => c.id !== currentCard.id)
      setGymCards(updated)
      setIsLoading(false);
      if (updated.length === 0) {
        setProgress(0)
        setCurrentCard(undefined)
      } else {
        const newIdx = Math.min(currentIndex, updated.length - 1)
        setCurrentIndex(newIdx)
        setCurrentCard(updated[newIdx])
        setProgress((newIdx / updated.length) * 100)
      }
    } catch (e) {
      console.error(e)
      window.alert('Could not delete. Check the network and try again.')
    }
  }

  return (
    <div className="shrink-0 w-[98%] aspect-[2/1] max-md:aspect-[1/2] max-h-[85%] mx-auto flex flex-col rounded-2xl bg-[#1c1c1e] shadow-2xl overflow-hidden">

      {/* Row: description + image */}
      <div className="flex flex-row max-md:flex-col flex-1 min-h-0">

        {/* Description */}
        <div className="flex-1 h-full flex items-center justify-center text-white text-2xl font-semibold text-center p-8">
          {currentCard
            ? (language === '中文' ? currentCard.description_zh : currentCard.description_en)
            : null}
        </div>

        {/* Image */}
        <div className="relative flex-1 h-full min-w-0">
          {currentCard && (
            <>
              <GymCardComponent
                key={currentIndex}
                image={currentCard.image_url}
                isLoading={isLoading}
              />
              {isAdmin && (
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  <button
                    type="button"
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-black/60 text-white hover:bg-black/80"
                    onClick={() => setShowEditModal(true)}
                    title="Edit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-black/60 text-white hover:bg-red-600"
                    onClick={() => void handleDelete()}
                    title="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Progress bar — bottom border */}
      <div
        ref={barRef}
        className="h-1 w-full shrink-0 bg-white/20 cursor-pointer select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="h-full bg-red-300" style={{ width: `${progress}%` }} />
      </div>

      {showEditModal && currentCard && (
        <EditGymCardModal
          card={currentCard}
          onClose={() => setShowEditModal(false)}
          onUpdated={() => {
            setShowEditModal(false)
            setIsLoading(true)
            getAllGymCards().then(data => {
              setGymCards(data)
              const updated = data.find(c => c.id === currentCard.id)
              if (updated) setCurrentCard(updated)
            }).finally(() => {
              setIsLoading(false)
            })
          }}
        />
      )}
    </div>
  )
}
