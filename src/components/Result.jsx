import { useEffect, useState } from 'react'
import Logo from './Logo'
import Confetti from './Confetti'
import { QUESTIONS } from '../data/questions'
import { titleFor } from '../utils'

function useCountUp(target, ms = 1400) {
  const [v, setV] = useState(0)
  useEffect(() => {
    const t0 = performance.now()
    let raf
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / ms)
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])
  return v
}

export default function Result({ game, onAgain }) {
  const total = QUESTIONS.length
  const title = titleFor(game.correct, total)
  const score = useCountUp(game.score)
  const pct = Math.round((game.correct / total) * 100)

  return (
    <main className="shell result">
      {game.correct / total >= 0.45 && <Confetti />}

      <p className="eyebrow center">Sprint complete</p>

      <section className="card-score">
        <Logo size={72} glow />
        <h1 className="team-title">{game.team}</h1>
        <div className="crew">
          {game.members.map((m, i) => (
            <span className="crew-member" key={m + i}>
              <i className={`avatar small a${i}`}>{m[0].toUpperCase()}</i>
              {m}
            </span>
          ))}
        </div>

        <div className="big-score">{score}</div>
        <small className="muted-up">POINTS</small>

        <div className="rank">
          <span>{title.emoji}</span> {title.text}
        </div>

        <div className="stats">
          <div>
            <b>
              {game.correct}/{total}
            </b>
            <small>Correct</small>
          </div>
          <div>
            <b>{pct}%</b>
            <small>Accuracy</small>
          </div>
          <div>
            <b>🔥 {game.best}</b>
            <small>Best streak</small>
          </div>
        </div>

        <div className="dots" aria-hidden>
          {game.results.map((r, i) => (
            <span key={i} className={r === 'c' ? 'ok' : 'no'} />
          ))}
        </div>

        <small className="brand">GameDevUtopia · Studio Sprint</small>
      </section>

      <p className="snap">📸 Screenshot this card and show it at the GDU desk!</p>

      <section className="panel cta">
        <b>Liked it? Build real games with GDU.</b>
        <p>
          Workshops, game jams, mentoring from industry pros - Unity, Godot, Blender, Love2D and more. No experience
          needed: our founders started at zero too.
        </p>
      </section>

      <button className="btn ghost" onClick={onAgain}>
        ↻ Play again
      </button>
    </main>
  )
}
