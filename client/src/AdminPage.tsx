import { useState } from "react";
import Input from "./Input";
import NavBar from "./NavBar";
import ErrorModal from "./ErrorModal";
import { useNavigate } from "react-router-dom";
import { Context } from "./Context";
import { useContext } from "react";

const copy = {
  en: {
    label: 'Admin Key',
    grant: 'Turn Edit Mode ON',
    revoke: 'Turn Edit Mode OFF',
    error: 'Invalid admin key',
  },
  zh: {
    label: '管理员密钥',
    grant: '开启编辑模式',
    revoke: '推出编辑模式',
    error: '管理员密钥无效',
  },
} as const

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState<string>("");
  const [error, setError] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const { setAdmin, isAdmin, language } = useContext(Context);
  const t = language === '中文' ? copy.zh : copy.en

  console.log(language);
  return (
    <div className="flex flex-col items-center justify-center h-dvh">
      <NavBar />
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-4 bg-red-100">
        <div className="-translate-y-1/2 flex flex-col gap-4">
          <Input
            label={t.label}
            type="password"
            onChange={(e) => setAdminKey(e.target.value)}
            value={adminKey}
          />
          {isAdmin ? (
            <button
              type="button"
              className="rounded-full border-1 border-black px-4 py-2 cursor-pointer bg-red-200 hover:bg-red-300"
              onClick={() => {
                if (adminKey === "bingbokchoy257?") {
                  setAdmin(false);
                  navigate("/");
                } else {
                  setError(t.error);
                }
              }}
            >
              {t.revoke}
            </button>
          ) : (
            <button
              type="button"
              className="rounded-full border-1 border-black px-4 py-2 cursor-pointer bg-red-200 hover:bg-red-300"
              onClick={() => {
                if (adminKey === "bingbokchoy257?") {
                  setAdmin(true);
                  navigate("/");
                } else {
                  setError(t.error);
                }
              }}
            >
              {t.grant}
            </button>
          )}

          {/* Fixed-height slot so -translate-y-1/2 and flex centering don’t jump when error appears */}
          <div className="flex min-h-14 w-full items-center justify-center" aria-live="polite">
            {error ? (
              <ErrorModal message={error} onDismiss={() => setError(undefined)} />
            ) : null}
          </div>
        </div>

      </div>
    </div>
  )
}