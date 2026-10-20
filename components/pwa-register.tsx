"use client"

import { useEffect } from "react"

export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return
    if (!("serviceWorker" in navigator)) return
    const script = new URL("sw.js", document.baseURI)
    navigator.serviceWorker.register(script).catch(() => {})
  }, [])
  return null
}
