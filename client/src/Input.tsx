import React from "react";

export default function Input(props: {
  label?: string;
  type: string;
  onChange?: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="px-2">{props.label}</label>
      <input
        type={props.type}
        className="rounded-full border-1 border-black px-4 py-2"
        onChange={props.onChange}
        value={props.value}
      />
    </div>
  );
}