function LoginScreen({ onLogin }) {
  const [mode, setMode] = React.useState("login")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [name, setName] = React.useState("")
  const [err, setErr] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  async function submit(e) {
    e.preventDefault()
    if (!email.includes("@")) return setErr("Enter a valid email.")
    if (!password) return setErr("Password is required.")
    if (mode === "register" && !name) return setErr("Name is required.")
    setErr("")
    setLoading(true)
    try {
      const data = mode === "login"
        ? await api.login(email, password)
        : await api.register(name, email, password)
      localStorage.setItem('token', data.token)
      localStorage.setItem('usuario', JSON.stringify(data.usuario))
      onLogin(data.usuario)
    } catch (e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-shell">
      <div className="login-left">
        <div className="login-card">
          <Wordmark size={26}/>
          <h1 className="login-title">
            {mode === "login" ? "Welcome back." : "Create your workspace."}
          </h1>
          <p className="login-sub">
            {mode === "login"
              ? "Sign in to manage inventory, suppliers and waste."
              : "Track what you have, what's expiring, and what to cook next."}
          </p>

          <button className="btn btn-google" onClick={() => onLogin({ email: "alex@smartfood.app", nombre: "Alex" })}>
            <span dangerouslySetInnerHTML={{__html:I.Google({size:18})}}/> Continue with Google
          </button>

          <div className="divider"><span>or with email</span></div>

          <form onSubmit={submit} className="login-form">
            {mode === "register" && (
              <label className="field">
                <span className="field-label">Full name</span>
                <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Your name"/>
              </label>
            )}
            <label className="field">
              <span className="field-label">Email</span>
              <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@kitchen.com"/>
            </label>
            <label className="field">
              <span className="field-label">Password</span>
              <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="At least 8 characters"/>
            </label>
            {err && <div className="form-error" dangerouslySetInnerHTML={{__html:err}}/>}
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? "Please wait..." : (mode === "login" ? "Sign in" : "Create account")}
            </button>
          </form>

          <div className="login-foot">
            {mode === "login" ? (
              <>New to ReFood? <a onClick={()=>setMode("register")}>Create an account</a></>
            ) : (
              <>Already have an account? <a onClick={()=>setMode("login")}>Sign in</a></>
            )}
          </div>
        </div>
        <div className="login-tos">By continuing you agree to our Terms & Privacy.</div>
      </div>

      <div className="login-right" aria-hidden="true">
        <div className="login-art">
          <div className="art-row">
            <div className="art-card art-card-lg">
              <div className="art-tag">EXPIRES IN 2 DAYS</div>
              <div className="art-title">Whole milk, 1 gal</div>
              <div className="art-meta">12 on hand · Northbay Dairy Co.</div>
              <div className="art-bar"><span style={{width:"22%"}}/></div>
            </div>
            <div className="art-card art-pill">
              <span className="dot dot-amber"/> 4 alerts
            </div>
          </div>
          <div className="art-row">
            <div className="art-card art-pill">
              <span className="dot dot-green"/> 86% used
            </div>
            <div className="art-card art-card-md">
              <div className="art-title small">Suggested tonight</div>
              <div className="art-meta">Tomato risotto · 5/6 in stock</div>
            </div>
          </div>
          <div className="art-watermark">
            <Wordmark size={20}/>
            <span>Inventory, suppliers and waste — in one place.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Wordmark({ size = 28 }) {
  return (
    <div style={{display:"flex", alignItems:"center", gap:10, color:"var(--ink)"}}>
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <rect x="2" y="2" width="28" height="28" rx="8" fill="var(--accent)"/>
        <path d="M10 20.5c1.6 1.4 3.6 2.1 5.8 2 3.2-.2 5.5-2.2 5.5-4.6 0-2-1.5-3.1-4.6-3.7l-1.5-.3c-2.2-.4-3.1-1-3.1-2.1 0-1.3 1.3-2.2 3.3-2.2 1.6 0 3 .5 4.2 1.5"
              fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="22" cy="11" r="1.7" fill="#fff"/>
      </svg>
      <div style={{display:"flex", flexDirection:"column", lineHeight:1}}>
        <span style={{fontFamily:"var(--serif)", fontSize:size*0.78, letterSpacing:-0.4}}>ReFood</span>
      </div>
    </div>
  )
}

window.LoginScreen = LoginScreen
window.Wordmark = Wordmark
