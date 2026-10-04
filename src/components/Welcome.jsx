import { useState } from 'react'
import Logo from './Logo'
import { QUESTIONS } from '../data/questions'

const STEPS = [
  { icon: '💡', title: 'Read the tip', text: 'Every round teaches you something first - the answer is hiding in it.' },
  { icon: '🤝', title: 'Take turns', text: 'The phone tells you whose turn it is to tap. Everyone can shout advice!' },
  { icon: '⚡', title: 'Be quick', text: 'Faster answers score more. Streaks multiply your points up to x2.' },
  { icon: '🎓', title: 'Ask a mentor', text: 'One 50/50 lifeline per game. Use it wisely.' },
]

export default function Welcome({ profile, onStart }) {
  const [team, setTeam] = useState(profile.team)
  const [members, setMembers] = useState(profile.members.length >= 2 ? profile.members : ['', ''])
  const [error, setError] = useState('')

  const setMember = (i, v) => setMembers((m) => m.map((x, j) => (j === i ? v : x)))

  const submit = (e) => {
    e.preventDefault()
    const names = members.map((m) => m.trim()).filter(Boolean)
    if (!team.trim()) return setError('Give your team a name.')
    if (names.length < 2) return setError('Add at least 2 team members.')
    onStart(team.trim(), names)
  }

  return (
    <main className="shell welcome">
      <header className="hero">
        <Logo size={112} glow className="hero-logo" />
        <p className="eyebrow">GameDevUtopia presents</p>
        <h1>
          Studio <span>Sprint</span>
        </h1>
        <p className="lead">
          No game dev experience needed. Team up (2-3 people, one phone), run a mini game studio and learn how
          games are made in {QUESTIONS.length} quick rounds.
        </p>
      </header>

      <section className="steps" aria-label="How to play">
        {STEPS.map((s) => (
          <div className="step" key={s.title}>
            <span className="step-icon">{s.icon}</span>
            <div>
              <b>{s.title}</b>
              <p>{s.text}</p>
            </div>
          </div>
        ))}
      </section>

      <form className="panel form" onSubmit={submit}>
        <label className="field">
          <span>Team name</span>
          <input
            value={team}
            maxLength={20}
            placeholder="e.g. Pixel Pirates"
            onChange={(e) => setTeam(e.target.value)}
            autoComplete="off"
          />
        </label>

        <div className="field">
          <span>Team members</span>
          {members.map((m, i) => (
            <div className="member-row" key={i}>
              <i className={`avatar a${i}`}>{(m.trim()[0] || i + 1 + '').toUpperCase()}</i>
              <input
                value={m}
                maxLength={16}
                placeholder={i < 2 ? `Member ${i + 1}` : 'Member 3 (optional)'}
                onChange={(e) => setMember(i, e.target.value)}
                autoComplete="off"
              />
            </div>
          ))}
          {members.length < 3 && (
            <button type="button" className="btn ghost small" onClick={() => setMembers([...members, ''])}>
              + Add a third member
            </button>
          )}
        </div>

        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn primary big" type="submit">
          Start the Sprint <span aria-hidden>→</span>
        </button>
      </form>

      <footer className="foot">GameDevUtopia · PICT Pune × IIIT Kottayam</footer>
    </main>
  )
}
