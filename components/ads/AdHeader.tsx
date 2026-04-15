'use client'
import { useEffect, useRef } from 'react'

export default function AdHeader() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current || ref.current.dataset.loaded) return
    ref.current.dataset.loaded = '1'
    ;(window as any).atOptions = {
      key: '6d1f8fea26d3267ac6c7ad8fb30a3a26',
      format: 'iframe',
      height: 90,
      width: 728,
      params: {}
    }
    const s = document.createElement('script')
    s.src = 'https://www.highperformanceformat.com/6d1f8fea26d3267ac6c7ad8fb30a3a26/invoke.js'
    s.async = true
    ref.current.appendChild(s)
  }, [])
  return (
    <div className="w-full flex justify-center py-2 bg-gray-50 border-b border-gray-100">
      <div ref={ref} className="min-h-[90px] flex items-center justify-center" />
    </div>
  )
}
