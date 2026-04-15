export default function ErrorModal(props: { message: string; onDismiss: () => void }) {
  return (
    <div className="flex items-center justify-between bg-red-300 rounded-lg p-2 relative">
      <p className="font-medium text-red-800">{props.message}</p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="h-6 w-6 cursor-pointer text-red-700"
        onClick={props.onDismiss}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>
    </div>
  );
}