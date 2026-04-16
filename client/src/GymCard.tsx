import { useContext } from "react"
import { Context } from "./Context"

export function GymCard(props: {image: string, desc_en: string, desc_zh : string}) {
  const { language } = useContext(Context);

  return (
    <div className="grid w-full h-full bg-[#1a1a1a] rounded-xl shadow-xl gap-5 overflow-hidden"
      style={{ gridTemplateColumns: 'repeat(15, 1fr)', gridTemplateRows: 'repeat(10, 1fr)' }}>
      <p className="text-white text-3xl rounded-xl flex items-center justify-center text-center p-4"
        style={{ gridColumn: '3 / 6', gridRow: '4 / 7' }}>
        { language === "English" ? props.desc_en : props.desc_zh}
      </p>
      <div className="rounded-xl bg-cover bg-center bg-no-repeat"
        style={{ gridColumn: '7 / 15', gridRow: '2 / 10', backgroundImage: `url(${props.image})` }} />
    </div>
  )
}