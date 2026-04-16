import { Context } from "./Context";
import NavBar from "./NavBar";
import { useContext, useState } from "react";
import AddGymCardModal from "./AddGymCardModal";
import GymPresentation from "./GymPresentation";

export default function Gym() {

  const [showModal, setShowModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const {language, isAdmin} = useContext(Context)

  return (
    <div className="flex h-dvh flex-col bg-black">
      <NavBar txtColor="text-white" bgColor="bg-black opacity-70" />

      <div className="flex flex-1 flex-col p-10 relative">
        {
          isAdmin
          ?
          (
            <button
              className="text-xl px-4 py-2 text-white border-white border-2 rounded-xl bg-neutral-900 hover:bg-gray-500 cursor-pointer absolute"
              onClick={() => setShowModal(true)}
            >
              {language === "English" ? ("Update your progress") : ("更新你的进步")}
            </button>
          )
          :
          undefined
        }

        <div className="flex flex-1 h-[70%] w-[70%] self-center overflow-hidden">
          <GymPresentation refreshKey={refreshKey} />
        </div>
      </div>



      {showModal && (
        <AddGymCardModal
          onClose={() => setShowModal(false)}
          onAdded={() => { setShowModal(false); setRefreshKey(k => k + 1) }}
        />
      )}
    </div>
  )
}
