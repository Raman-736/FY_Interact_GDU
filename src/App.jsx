import { useEffect, useState } from 'react'
import Welcome from './components/Welcome'
import Question from './components/Question'
import Result from './components/Result'
import { QUESTIONS, SUBMIT_URL } from './data/questions'
import { getView, makeCur, newGame, store, streakMultiplier } from './utils'

const GAME_KEY = 'gduSprint.v2'
const PROFILE_KEY = 'gduSprint.profile'

export default function App() {
  const [game, setGame] = useState(() => store(GAME_KEY) || null)
  const [profile, setProfile] = useState(() => store(PROFILE_KEY) || { team: '', members: ['', ''] })

  useEffect(() => {
    store(GAME_KEY, game)
  }, [game])

  // Send the final score once, if a collection URL has been configured.
  useEffect(() => {
    if (!game?.done || game.submitted || !SUBMIT_URL) return
    try {
      fetch(SUBMIT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({
          team: game.team, members: game.members, score: game.score,
          correct: game.correct, best: game.best, at: new Date().toISOString(),
        }),
      })
    } catch {
      /* offline - ignore */
    }
    setGame((g) => ({ ...g, submitted: true }))
  }, [game])

  const start = (team, members) => {
    const p = { team, members }
    setProfile(p)
    store(PROFILE_KEY, p)
    setGame(newGame(team, members))
  }

  // timeFrac = fraction of the timer left when the team answered (0..1)
  const answer = (picked, timeFrac) =>
    setGame((g) => {
      if (g.cur.picked != null) return g
      const q = QUESTIONS[g.order[g.i]]
      const { ans } = getView(q, g.cur)
      const ok = picked === ans
      const gain = ok ? Math.round((100 + Math.round(50 * timeFrac)) * streakMultiplier(g.streak)) : 0
      const streak = ok ? g.streak + 1 : 0
      return {
        ...g,
        cur: { ...g.cur, picked, gain },
        score: g.score + gain,
        correct: g.correct + (ok ? 1 : 0),
        streak,
        best: Math.max(g.best, streak),
        results: [...g.results, ok ? 'c' : 'w'],
      }
    })

  const askMentor = () =>
    setGame((g) => {
      if (g.mentor || g.cur.picked != null) return g
      const q = QUESTIONS[g.order[g.i]]
      const { opts, ans } = getView(q, g.cur)
      const wrong = opts.map((_, i) => i).filter((i) => i !== ans).sort(() => Math.random() - 0.5)
      return { ...g, mentor: true, cur: { ...g.cur, gone: wrong.slice(0, 2) } }
    })

  const next = () =>
    setGame((g) => {
      if (g.i + 1 >= QUESTIONS.length) return { ...g, done: true }
      const i = g.i + 1
      return { ...g, i, cur: makeCur(QUESTIONS[g.order[i]]) }
    })

  if (!game) return <Welcome profile={profile} onStart={start} />
  if (game.done) return <Result game={game} onAgain={() => setGame(null)} />

  const q = QUESTIONS[game.order[game.i]]
  return (
    <Question
      key={game.i}
      q={q}
      game={game}
      view={getView(q, game.cur)}
      onAnswer={answer}
      onMentor={askMentor}
      onNext={next}
    />
  )
}
