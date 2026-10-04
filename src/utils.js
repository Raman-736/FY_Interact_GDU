import { QUESTIONS } from './data/questions'

export const shuffle = (arr) => {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function store(key, value) {
  try {
    if (value === undefined) return JSON.parse(localStorage.getItem(key))
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, JSON.stringify(value))
  } catch {
    return null
  }
  return null
}

export const vibrate = (pattern) => {
  try {
    navigator.vibrate?.(pattern)
  } catch {
    /* not supported */
  }
}

export const streakMultiplier = (streak) => 1 + Math.min(streak, 4) * 0.25

// Per-question view state: shuffled option order is kept in the saved game so a refresh can't re-roll it.
export const makeCur = (q) => ({ perm: q.t === 'mcq' ? shuffle([0, 1, 2, 3]) : null, gone: [] })

export function getView(q, cur) {
  if (q.t === 'bug') return { opts: q.code, ans: q.a }
  return { opts: cur.perm.map((i) => q.o[i]), ans: cur.perm.indexOf(q.a) }
}

export function newGame(team, members) {
  const ids = QUESTIONS.map((_, i) => i)
  const order = [0, ...shuffle(ids.slice(1))] // first round is always the friendly GDU story
  return {
    team, members, order, i: 0,
    cur: makeCur(QUESTIONS[order[0]]),
    score: 0, correct: 0, streak: 0, best: 0,
    mentor: false, results: [], done: false, submitted: false,
  }
}

export function titleFor(correct, total) {
  const r = correct / total
  if (r >= 0.9) return { text: 'Legendary Game Devs', emoji: '👑' }
  if (r >= 0.7) return { text: 'Game Jam Champions', emoji: '🏆' }
  if (r >= 0.45) return { text: 'Rising Indie Devs', emoji: '🚀' }
  return { text: 'Fresh Spawns - the adventure begins', emoji: '🌱' }
}
