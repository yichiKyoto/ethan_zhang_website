import { useState } from "react"
import LoadingSpinner from "./LoadingSpinner";

export function GymCard(props: { image: string, isLoading: boolean }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const showSpinner = props.isLoading || !imgLoaded;

  return (
    <div className="w-full h-full rounded-xl bg-[#1a1a1a] overflow-hidden flex items-center justify-center">
      {showSpinner && <LoadingSpinner />}
      {!props.isLoading && (
        <img
          src={props.image}
          className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
        />
      )}
    </div>
  )
}
