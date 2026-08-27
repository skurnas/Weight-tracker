import { useCallback, useEffect, useState } from 'react'

export function useLocalStorageList<T extends { id: string }>(key: string) {
  const [items, setItems] = useState<T[]>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T[]) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(items))
  }, [key, items])

  const addItem = useCallback((item: T) => {
    setItems((prev) => [...prev, item])
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  return { items, addItem, removeItem }
}
