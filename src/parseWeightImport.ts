import type { WeightEntry } from './types'

function normalizeDate(raw: string): string | null {
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw

  const us = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/)
  if (us) {
    const [, m, d, yRaw] = us
    const y = yRaw.length === 2 ? `20${yRaw}` : yRaw
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
  }

  return null
}

export function parseWeightImport(text: string): { entries: WeightEntry[]; skipped: number } {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  const entries: WeightEntry[] = []
  let skipped = 0

  for (const line of lines) {
    const parts = line.split(/[,\t]/).map((p) => p.trim())
    const date = parts[0] ? normalizeDate(parts[0]) : null
    const weightMatch = parts[1]?.match(/[\d.]+/)
    const weightLbs = weightMatch ? parseFloat(weightMatch[0]) : NaN

    if (!date || Number.isNaN(weightLbs)) {
      skipped++
      continue
    }
    entries.push({ id: crypto.randomUUID(), date, weightLbs })
  }

  return { entries, skipped }
}
