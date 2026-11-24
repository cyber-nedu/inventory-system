"use client"

import { useCallback, useSyncExternalStore } from "react"

export type KyypPreferences = {
  confirmBeforeDelete: boolean
  compactTables: boolean
}

const STORAGE_KEY = "kyyp-preferences"
const PREFERENCES_EVENT = "kyyp-preferences-updated"

const defaultPreferences: KyypPreferences = {
  confirmBeforeDelete: true,
  compactTables: false,
}

function readPreferences(): KyypPreferences {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)

    if (!stored) {
      return defaultPreferences
    }

    const parsed = JSON.parse(stored) as Partial<KyypPreferences>

    return {
      confirmBeforeDelete:
        typeof parsed.confirmBeforeDelete === "boolean"
          ? parsed.confirmBeforeDelete
          : defaultPreferences.confirmBeforeDelete,
      compactTables:
        typeof parsed.compactTables === "boolean"
          ? parsed.compactTables
          : defaultPreferences.compactTables,
    }
  } catch {
    return defaultPreferences
  }
}

function subscribe(callback: () => void) {
  const handleStorage = () => {
    callback()
  }

  window.addEventListener("storage", handleStorage)
  window.addEventListener(PREFERENCES_EVENT, handleStorage)

  return () => {
    window.removeEventListener("storage", handleStorage)
    window.removeEventListener(PREFERENCES_EVENT, handleStorage)
  }
}

function getSnapshot() {
  return JSON.stringify(readPreferences())
}

function getServerSnapshot() {
  return JSON.stringify(defaultPreferences)
}

export function usePreferences() {
  const preferencesSnapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  )

  const preferences = JSON.parse(preferencesSnapshot) as KyypPreferences

  const setPreference = useCallback(
    <K extends keyof KyypPreferences>(
      key: K,
      value: KyypPreferences[K],
    ) => {
      const current = readPreferences()

      const next: KyypPreferences = {
        ...current,
        [key]: value,
      }

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      window.dispatchEvent(new Event(PREFERENCES_EVENT))
    },
    [],
  )

  return {
    preferences,
    setPreference,
  }
}