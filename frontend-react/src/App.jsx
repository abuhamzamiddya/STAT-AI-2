import React, { useEffect, useMemo, useRef, useState } from 'react'

const API = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
const employees = [
  { id: 1, name: 'Diwakar Snehi', initials: 'DS', role: 'Assistant Section Officer' },
  { id: 2, name: 'Mehtab Alam', initials: 'MA', role: 'Section Officer' },
  { id: 3, name: 'Manali', initials: 'M', role: 'Data Analyst' }
]

async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: { Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}) }
  })
  const raw = await res.text()
  let data = raw
  try { data = raw ? JSON.parse(raw) : null } catch {}
  if (!res.ok) throw new Error(data?.message || `Request failed (${res.status})`)
  return data?.data ?? data
}

function useCountUp(value, duration = 900) {
  const target = Number.isFinite(Number(value)) ? Number(value) : 0
  const [display, setDisplay] = useState(target)
  useEffect(() => {
    let frame
    const start = performance.now()
    const from = display
    const tick = now => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(from + (target - from) * eased))
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target])
  return display
}

function useTilt() {
  const ref = useRef(null)
  const onMove = e => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--rx', `${-y * 5}deg`)
    el.style.setProperty('--ry', `${x * 6}deg`)
    el.style.setProperty('--mx', `${(x + 0.5) * 100}%`)
    el.style.setProperty('--my', `${(y + 0.5) * 100}%`)
  }
  const reset = () => {
    if (!ref.current) return
    ref.current.style.setProperty('--rx', '0deg')
    ref.current.style.setProperty('--ry', '0deg')
  }
  return { ref, onMove, reset }
}

function TiltCard({ className = '', children }) {
  const tilt = useTilt()
  return <article ref={tilt.ref} onMouseMove={tilt.onMove} onMouseLeave={tilt.reset} className={`surface tilt ${className}`}>
    <span className="surface-light" aria-hidden="true" />
    {children}
  </article>
}

function MagneticButton({ children, className = '', ...props }) {
  const ref = useRef(null)
  const move = e => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left - r.width / 2) * 0.12
    const y = (e.clientY - r.top - r.height / 2) * 0.12
    el.style.transform = `translate(${x}px, ${y}px)`
  }
  const leave = () => { if (ref.current) ref.current.style.transform = '' }
  return <button ref={ref} onMouseMove={move} onMouseLeave={leave} className={`magnetic ${className}`} {...props}>{children}</button>
}

function DataField() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    if (!canvas || !parent) return
    const ctx = canvas.getContext('2d')
    let width = 0, height = 0, dpr = 1, frame = 0, points = []
    const pointer = { x: -9999, y: -9999 }
    const resize = () => {
      const r = parent.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = r.width; height = r.height
      canvas.width = width * dpr; canvas.height = height * dpr
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(150, Math.max(70, Math.floor(width / 7)))
      points = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - .5) * .16,
        vy: (Math.random() - .5) * .16,
        r: i % 9 === 0 ? 1.8 : .9,
        phase: Math.random() * Math.PI * 2
      }))
    }
    const move = e => {
      const r = canvas.getBoundingClientRect()
      pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top
    }
    const leave = () => { pointer.x = pointer.y = -9999 }
    const draw = t => {
      ctx.clearRect(0, 0, width, height)
      const pts = points
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy
        if (p.x < -10 || p.x > width + 10) p.vx *= -1
        if (p.y < -10 || p.y > height + 10) p.vy *= -1
        const dx = pointer.x - p.x, dy = pointer.y - p.y
        const dist = Math.hypot(dx, dy)
        if (dist < 130) { p.x -= dx / Math.max(dist, 1) * (130 - dist) * .003; p.y -= dy / Math.max(dist, 1) * (130 - dist) * .003 }
        const glow = Math.max(0, 1 - dist / 150)
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r + glow * 1.2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${0.16 + glow * .55})`; ctx.fill()
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 72) {
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(255,255,255,${(1 - d / 72) * .075})`; ctx.lineWidth = .6; ctx.stroke()
          }
        }
      }
      const y = height * .67 + Math.sin(t / 850) * 7
      ctx.beginPath()
      for (let x = 0; x <= width; x += 5) {
        const n = x / Math.max(width, 1)
        const curve = Math.sin(n * Math.PI * 2.2 + t / 1000) * 7 + Math.sin(n * Math.PI * 5) * 2
        const yy = y - Math.pow(n, 1.55) * height * .42 + curve
        if (x === 0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy)
      }
      ctx.strokeStyle = 'rgba(255,255,255,.28)'; ctx.lineWidth = 1.2; ctx.stroke()
      frame = requestAnimationFrame(draw)
    }
    resize(); window.addEventListener('resize', resize); canvas.addEventListener('pointermove', move); canvas.addEventListener('pointerleave', leave)
    frame = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerleave', leave) }
  }, [])
  return <canvas ref={canvasRef} className="data-field" aria-hidden="true" />
}

function Sparkline({ values, label }) {
  const max = Math.max(...values), min = Math.min(...values), range = Math.max(max - min, 1)
  const points = values.map((v, i) => `${(i / (values.length - 1)) * 100},${92 - ((v - min) / range) * 70}`).join(' ')
  return <div className="spark" aria-label={label} role="img"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points={points} /></svg></div>
}

function App() {
  const [tab, setTab] = useState('dashboard')
  const [employee, setEmployee] = useState(1)
  const [dashboard, setDashboard] = useState(null)
  const [gap, setGap] = useState(null)
  const [courses, setCourses] = useState([])
  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState({})
  const [score, setScore] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [theme, setTheme] = useState(localStorage.getItem('stat-ai-theme') || 'light')
  const current = useMemo(() => employees.find(e => e.id === employee) || employees[0], [employee])

  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('stat-ai-theme', theme) }, [theme])
  useEffect(() => { loadDashboard() }, [])
  async function loadDashboard() { try { setDashboard(await request('/api/dashboard/overview')) } catch (e) { setError(e.message) } }
  async function analyze() { setLoading(true); setError(''); try { setGap(await request(`/api/gaps/analyze/${employee}`, { method: 'POST' })); setTab('gap') } catch (e) { setError(e.message) } finally { setLoading(false) } }
  async function recommend() { setLoading(true); setError(''); try { const data = await request(`/api/training/recommend/${employee}`); setCourses(Array.isArray(data) ? data : data?.recommendations || data?.courses || []); setTab('training') } catch (e) { setError(e.message) } finally { setLoading(false) } }
  async function generateQuiz() { setLoading(true); setError(''); setScore(null); setAnswers({}); try { const data = await request('/api/quiz/generate', { method: 'POST', body: JSON.stringify({ title: 'National Accounts Statistics', documentText: 'National Accounts Statistics describe production, income and expenditure measures used to understand the Indian economy. Gross Value Added is output minus intermediate consumption. Evidence-based official statistics support public policy and planning.' }) }); setQuiz(data); setTab('quiz') } catch (e) { setError(e.message) } finally { setLoading(false) } }
  async function submitAdaptive() {
    if (!quiz?.questions?.length) return
    const submitted = {}; quiz.questions.forEach((q, i) => { if (answers[i] && q.id) submitted[q.id] = answers[i] })
    if (!Object.keys(submitted).length) { setError('Please answer at least one question before submitting.'); return }
    try { setScore(await request('/api/adaptive/score', { method: 'POST', body: JSON.stringify({ quizId: quiz.quizId, employeeId: employee, answers: submitted }) })) } catch (e) { setError(e.message) }
  }

  const nav = [['dashboard', '01', 'Overview'], ['gap', '02', 'Competency'], ['training', '03', 'Learning'], ['quiz', '04', 'Assessment']]
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><img src="/icon.svg" alt="Stat-ai"/><div><b>stat<span>-ai</span></b><small>LEARNING INTELLIGENCE</small></div></div>
      <div className="rail-label">WORKSPACE</div>
      <nav>{nav.map(([id, no, label]) => <button className={tab === id ? 'nav active' : 'nav'} onClick={() => setTab(id)} key={id}><span>{no}</span><b>{label}</b></button>)}</nav>
      <div className="sidebar-rule" />
      <div className="sidebar-footer"><span className="live-dot" />SYSTEM OPERATIONAL<small>MoSPI / iGOT aligned prototype</small></div>
    </aside>
    <main className="main">
      <header className="topbar"><div><p className="eyebrow">STAT-AI / {tab.toUpperCase()}</p><h1>{tab === 'dashboard' ? 'Learning intelligence' : tab === 'gap' ? 'Competency intelligence' : tab === 'training' ? 'Targeted learning' : 'Assessment studio'}</h1></div><div className="top-actions"><label className="employee-select"><span>LEARNER</span><select value={employee} onChange={e => setEmployee(Number(e.target.value))}>{employees.map(e => <option value={e.id} key={e.id}>{e.name}</option>)}</select></label><button className="icon-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">{theme === 'dark' ? '☼' : '◐'}</button><div className="avatar">{current.initials}</div></div></header>
      {error && <div className="alert"><span>{error}</span><button onClick={() => setError('')} aria-label="Dismiss error">×</button></div>}
      <section className="content">{tab === 'dashboard' && <Dashboard data={dashboard} employee={current} onAnalyze={analyze} onTraining={recommend} loading={loading}/>} {tab === 'gap' && <Gap data={gap} employee={current} onAnalyze={analyze} onTraining={recommend} loading={loading}/>} {tab === 'training' && <Training courses={courses} employee={current} onLoad={recommend} loading={loading}/>} {tab === 'quiz' && <Quiz quiz={quiz} answers={answers} setAnswers={setAnswers} score={score} onGenerate={generateQuiz} onSubmit={submitAdaptive} loading={loading}/>}</section>
    </main>
  </div>
}

function Dashboard({ data, employee, onAnalyze, onTraining, loading }) {
  const metrics = data || {}
  const employeeCount = useCountUp(metrics.totalEmployees ?? 3)
  const competencyCount = useCountUp(metrics.totalCompetencies ?? 12)
  const materialCount = useCountUp(metrics.totalLearningMaterials ?? 8)
  const quizCount = useCountUp(metrics.totalQuizzes ?? 24)
  return <>
    <section className="hero-panel"><DataField/><div className="hero-copy"><span className="kicker"><i/> LIVE LEARNING SYSTEM</span><h2>Turn workforce data into <em>capability.</em></h2><p>Stat-ai maps role requirements to demonstrated competency, surfaces the highest-impact gaps, and turns them into measurable learning actions.</p><div className="hero-actions"><MagneticButton className="primary" onClick={onAnalyze} disabled={loading}>{loading ? 'ANALYZING' : 'RUN GAP ANALYSIS'} <span>↗</span></MagneticButton><button className="text-button" onClick={onTraining}>VIEW LEARNING PATH <span>→</span></button></div></div><div className="hero-index"><span>01</span><small>CAPABILITY<br/>ENGINE</small><strong>β 0.8</strong></div></section>
    <div className="section-head"><div><span className="section-number">01 / SYSTEM PULSE</span><h3>Operational overview</h3></div><p>Selected learner <b>{employee.name}</b> · {employee.role}</p></div>
    <div className="metric-grid">
      <Metric label="ACTIVE LEARNERS" value={employeeCount} suffix="" trend="+12.4%" sub="registered profiles" spark={[32,38,35,44,48,46,57,62]}/>
      <Metric label="COMPETENCIES" value={competencyCount} suffix="" trend="+8.1%" sub="role-aligned signals" spark={[22,28,27,31,34,33,38,43]}/>
      <Metric label="MATERIAL INDEX" value={materialCount} suffix="" trend="+16.7%" sub="learning sources" spark={[18,24,22,30,28,36,40,48]}/>
      <Metric label="ASSESSMENTS" value={quizCount} suffix="" trend="+21.0%" sub="generated sessions" spark={[15,19,25,23,31,35,34,44]}/>
    </div>
    <div className="dashboard-grid">
      <TiltCard className="signal-panel"><div className="surface-head"><div><span className="section-number">02 / SIGNAL MAP</span><h3>Capability trajectory</h3></div><span className="status-tag">REAL-TIME</span></div><div className="signal-chart"><div className="axis y"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div><div className="chart-body"><div className="grid-lines"/><svg viewBox="0 0 700 240" preserveAspectRatio="none" aria-label="Capability trajectory chart"><defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopOpacity=".22"/><stop offset="1" stopOpacity="0"/></linearGradient></defs><path className="area" d="M0 200 C80 185 95 155 155 165 S230 115 290 138 S360 88 420 110 S505 72 560 86 S635 45 700 52 L700 240 L0 240Z"/><path className="trend" d="M0 200 C80 185 95 155 155 165 S230 115 290 138 S360 88 420 110 S505 72 560 86 S635 45 700 52"/><circle cx="560" cy="86" r="4"/><circle cx="700" cy="52" r="5"/></svg><div className="axis x"><span>W1</span><span>W2</span><span>W3</span><span>W4</span><span>W5</span><span>W6</span><span>W7</span></div></div></div><div className="chart-foot"><div><strong>+18.6%</strong><span>capability velocity</span></div><div><strong>0.82</strong><span>confidence index</span></div><div><strong>07</strong><span>signals this week</span></div></div></TiltCard>
      <TiltCard className="loop-panel"><span className="section-number">03 / LEARNING LOOP</span><h3>From gap to mastery</h3><div className="loop"><LoopItem no="01" title="Map" text="Role + evidence"/><i>→</i><LoopItem no="02" title="Prioritize" text="Impact score"/><i>→</i><LoopItem no="03" title="Learn" text="Targeted path"/><i>→</i><LoopItem no="04" title="Assess" text="Adaptive quiz"/></div><div className="loop-note"><span>◎</span><p><b>Next action</b><br/>Run competency analysis for {employee.name.split(' ')[0]}.</p><button onClick={onAnalyze}>RUN →</button></div></TiltCard>
    </div>
    <div className="bottom-grid"><div className="quote-line"><span>“</span><p>Evidence-led learning is not another dashboard. It is a feedback system for building institutional capability.</p><small>STAT-AI / DESIGN PRINCIPLE 04</small></div><div className="tech-strip"><span>JAVA 17</span><span>SPRING BOOT</span><span>OPENAI</span><span>OPENNLP</span><span>TIKA</span><span>REACT</span></div></div>
  </>
}

function Metric({ label, value, suffix, trend, sub, spark }) { return <TiltCard className="metric"><div className="metric-top"><span>{label}</span><b>{trend}</b></div><strong>{value}{suffix}</strong><div className="metric-bottom"><span>{sub}</span><Sparkline values={spark} label={`${label} trend`}/></div></TiltCard> }
function LoopItem({ no, title, text }) { return <div className="loop-item"><b>{no}</b><strong>{title}</strong><span>{text}</span></div> }

function Gap({ data, employee, onAnalyze, onTraining, loading }) {
  const scoreValue = Number(data?.overallScore ?? data?.score ?? 72)
  const skills = data?.skillGaps || data?.competencies || data?.gaps || []
  return <><div className="page-actions"><div><span className="section-number">ANALYSIS / {employee.initials}</span><h2>Competency gap</h2><p>Role-aware assessment with prioritized development areas.</p></div><MagneticButton className="primary" onClick={onAnalyze} disabled={loading}>{loading ? 'REFRESHING' : 'RUN ANALYSIS'} ↗</MagneticButton></div><div className="gap-grid"><TiltCard className="score-card"><span className="section-number">READINESS INDEX</span><div className="score-orbit"><div className="orbit-dot"/><div className="score-ring" style={{ '--score': `${scoreValue * 3.6}deg` }}><strong>{scoreValue}<small>%</small></strong></div></div><p>Current estimated readiness</p><div className="score-meta"><span>BASELINE<strong>64</strong></span><span>TARGET<strong>85</strong></span></div></TiltCard><TiltCard><div className="surface-head"><div><span className="section-number">PRIORITY MATRIX</span><h3>Development signals</h3></div><span className="status-tag">TOP 06</span></div>{skills.length ? skills.slice(0, 6).map((s, i) => <div className="skill" key={i}><div><strong>{s.skillName || s.name || `Competency ${i + 1}`}</strong><small>{s.priority || (i < 2 ? 'HIGH' : 'DEVELOPMENT')}</small></div><div className="bar"><i style={{ width: `${Math.max(18, Math.min(92, Number(s.score ?? s.currentLevel ?? 45)))}%` }}/></div></div>) : <div className="empty"><b>Analysis result ready.</b><p>Run the analysis to populate the returned competency matrix.</p></div>}</TiltCard></div><div className="next-action"><div><span className="section-number">RECOMMENDED NEXT STEP</span><h3>Convert gaps into a learning path.</h3><p>Use the recommendation engine for {employee.name}.</p></div><button onClick={onTraining}>OPEN LEARNING PATH <span>→</span></button></div></>
}

function Training({ courses, employee, onLoad, loading }) {
  const list = courses.length ? courses : [
    { title: 'Official Statistics & Evidence-Based Policy', description: 'Build practical understanding of official statistics and policy use.', provider: 'iGOT Karmayogi', duration: 'Self-paced', level: '01 / RECOMMENDED' },
    { title: 'Data Quality & Statistical Reasoning', description: 'Strengthen data interpretation and quality-focused decision making.', provider: 'iGOT Karmayogi', duration: '4 hours', level: '02 / PRIORITY' },
    { title: 'Public Data & Decision Intelligence', description: 'Translate statistical evidence into clear administrative decisions.', provider: 'iGOT Karmayogi', duration: '3 hours', level: '03 / NEXT' }
  ]
  return <><div className="page-actions"><div><span className="section-number">LEARNING / PERSONALIZED</span><h2>Targeted learning</h2><p>Courses ordered around the learner's highest-impact gaps.</p></div><button className="outline-button" onClick={onLoad} disabled={loading}>{loading ? 'LOADING…' : 'REFRESH SIGNALS'} ↻</button></div><div className="course-grid">{list.map((c, i) => <TiltCard className="course" key={i}><div className="course-top"><span className="course-index">0{i + 1}</span><span className="status-tag">{c.level || 'RECOMMENDED'}</span></div><div className="course-rule"/><h3>{c.title || c.courseTitle || `Learning module ${i + 1}`}</h3><p>{c.description || c.summary || 'Role-aligned learning recommendation.'}</p><div className="course-meta"><span>{c.provider || 'iGOT Karmayogi'}</span><span>{c.duration || 'Self-paced'}</span></div><button className="course-open">OPEN MODULE <span>↗</span></button></TiltCard>)}</div><div className="learning-footer"><span>PERSONALIZED FOR</span><strong>{employee.name}</strong><i>→</i><span>ROLE</span><strong>{employee.role}</strong></div></>
}

function Quiz({ quiz, answers, setAnswers, score, onGenerate, onSubmit, loading }) {
  return <><div className="page-actions"><div><span className="section-number">ASSESSMENT / ADAPTIVE</span><h2>Assessment studio</h2><p>Generate an MCQ assessment and feed the result into adaptive scoring.</p></div><MagneticButton className="primary" onClick={onGenerate} disabled={loading}>{loading ? 'GENERATING' : 'GENERATE QUIZ'} ↗</MagneticButton></div>{quiz ? <div className="quiz-layout"><div>{quiz.questions?.map((q, i) => <article className="surface question" key={i}><div className="question-head"><span>Q{i + 1}</span><small>ADAPTIVE ITEM</small></div><h3>{q.questionText}</h3>{[['optionA', 'A'], ['optionB', 'B'], ['optionC', 'C'], ['optionD', 'D']].map(([key, label]) => <label className={answers[i] === key ? 'option selected' : 'option'} key={key}><input type="radio" name={`q${i}`} checked={answers[i] === key} onChange={() => setAnswers({ ...answers, [i]: key })}/><b>{label}</b><span>{q[key]}</span><i>↗</i></label>)}</article>)}</div><aside className="surface quiz-side"><span className="section-number">SCORING ENGINE</span><h3>Measure mastery.</h3><p>Weighted responses determine mastery and the next difficulty level.</p><div className="score-lines"><span>WEIGHTING<strong>1.0 / 1.25 / 1.5</strong></span><span>MODEL<strong>ADAPTIVE v1</strong></span></div><button className="primary wide" onClick={onSubmit}>SUBMIT ASSESSMENT ↗</button>{score && <div className="result"><span>WEIGHTED SCORE</span><strong>{score.weightedScore ?? score.score ?? score.percentage ?? 0}%</strong><b>{score.masteryLevel || score.mastery || 'DEVELOPING'}</b><p>NEXT / {score.nextDifficulty || score.recommendedDifficulty || 'MEDIUM'}</p><small>{score.recommendation || ''}</small></div>}</aside></div> : <div className="empty large"><span>04</span><h3>Assessment queue is empty.</h3><p>Generate a short assessment from learning material to begin adaptive scoring.</p><button className="outline-button" onClick={onGenerate}>GENERATE FIRST QUIZ →</button></div>}</>
}

export default App
