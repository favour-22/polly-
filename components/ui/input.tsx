"use client";
import { InputHTMLAttributes } from "react";

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`rounded-md border px-3 py-2 text-sm w-full ${props.className ?? ""}`}
    />
  );
}