import { useEffect, useRef, useState } from 'react'
import Logo from './Logo'
import { BUG_TIME, CATS, MCQ_TIME, QUESTIONS } from '../data/questions'
import { streakMultiplier, vibrate } from '../utils'

const R = 20
const CIRC = 2 * Math.PI * R

function TimerRing({ left, limit }) {
  const frac = left / limit
  const low = left <= 5
  return (
    <div className={`ring ${low ? 'low' : ''}`} aria-label={`${Math.ceil(left)} seconds left`}>
      <svg viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={R} className="ring-bg" />
        <circle
          cx="24" cy="24" r={R} className="ring-fg"
          strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - frac)}
          transform="rotate(-90 24 24)"
        />
      </svg>
      <b>{Math.ceil(left)}</b>
    </div>
  )
}

export default function Question({ q, game, view, onAnswer, onMentor, onNext }) {
  const { cur } = game
  const { opts, ans } = view
  const limit = q.t === 'bug' ? BUG_TIME : MCQ_TIME
  const revealed = cur.picked != null
  const [left, setLeft] = useState(limit)

  const member = game.members[game.i % game.members.length]
  const memberIdx = game.i % game.members.length
  const cat = CATS[q.cat]
  const mult = streakMultiplier(game.streak)
  const total = QUESTIONS.length
  const correct = revealed && cur.picked === ans

  // keep the freshest callback/time for the timeout effect
  const revealRef = useRef(null)
  const latest = useRef({})
  latest.current = { onAnswer, left, limit }

  useEffect(() => {
    if (revealed) return
    const id = setInterval(() => setLeft((l) => Math.max(0, +(l - 0.1).toFixed(1))), 100)
    return () => clearInterval(id)
  }, [revealed])

  useEffect(() => {
    if (left <= 0 && !revealed) {
      vibrate([80, 60, 80])
      latest.current.onAnswer(-1, 0)
    }
  }, [left, revealed])

  // bring the verdict + explanation into view once an answer is locked in
  useEffect(() => {
    if (revealed) revealRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [revealed])

  const pick = (i) => {
    if (revealed || cur.gone.includes(i)) return
    vibrate(i === ans ? 60 : [80, 60, 80])
    onAnswer(i, left / limit)
  }

  const optClass = (i) => {
    if (revealed) return i === ans ? 'right' : i === cur.picked ? 'wrong' : 'dim'
    return cur.gone.includes(i) ? 'gone' : ''
  }

  return (
    <main className="shell play">
      <header className="topbar">
        <Logo size={34} />
        <div className="team-name">
          <b>{game.team}</b>
          <small>
            Round {game.i + 1} of {total}
          </small>
        </div>
        <div className="score-pill" key={game.score}>
          <small>SCORE</small>
          <b>{game.score}</b>
        </div>
      </header>

      <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={game.i + 1}>
        {Array.from({ length: total }, (_, i) => {
          const r = game.results[i]
          const state = r === 'c' ? 'ok' : r === 'w' ? 'no' : i === game.i ? 'now' : ''
          return <span key={i} className={state} />
        })}
      </div>

      <section className="turn">
        <i className={`avatar a${memberIdx}`}>{member[0].toUpperCase()}</i>
        <div>
          <b>{member}'s turn to tap</b>
          <small>Team can advise - only {member} taps!</small>
        </div>
        {game.streak > 0 && <span className="streak">🔥 x{mult}</span>}
      </section>

      <div className="qhead">
        <span className="chip">
          {cat.emoji} {cat.name}
        </span>
        {!revealed && <TimerRing left={left} limit={limit} />}
      </div>

      <section className="tip">
        <span>💡 Quick Tip</span>
        <p>{q.tip}</p>
      </section>

      <h2 className="question">{q.q}</h2>

      {q.t === 'bug' ? (
        <div className="code" role="group">
          {opts.map((line, i) => (
            <button key={i} className={`line ${optClass(i)}`} disabled={revealed} onClick={() => pick(i)}>
              <i>{i + 1}</i>
              <code>{line}</code>
            </button>
          ))}
        </div>
      ) : (
        <div className="options" role="group">
          {opts.map((text, i) => (
            <button
              key={i}
              className={`option ${optClass(i)}`}
              disabled={revealed || cur.gone.includes(i)}
              onClick={() => pick(i)}
            >
              <b>{'ABCD'[i]}</b>
              <span>{text}</span>
            </button>
          ))}
        </div>
      )}

      {!revealed && q.t === 'mcq' && (
        <button className="btn ghost" onClick={onMentor} disabled={game.mentor}>
          🎓 {game.mentor ? 'Mentor used' : 'Ask a GDU Mentor (50/50)'}
        </button>
      )}

      {revealed && (
        <section className="reveal" ref={revealRef}>
          <div className={`verdict ${correct ? 'good' : 'bad'}`}>
            {correct ? (
              <>
                <span>🎉 Correct!</span>
                <b className="gain">+{cur.gain}</b>
              </>
            ) : (
              <span>{cur.picked === -1 ? "⏰ Time's up!" : '❌ Not quite!'}</span>
            )}
          </div>
          <div className="explain">
            <span>🎓 Learn</span>
            <p>{q.e}</p>
          </div>
        </section>
      )}

      {revealed && (
        <div className="dock">
          <button className="btn primary big" onClick={onNext} autoFocus>
            {game.i + 1 < total ? 'Next round' : 'See results'} <span aria-hidden>→</span>
          </button>
        </div>
      )}
    </main>
  )
}
