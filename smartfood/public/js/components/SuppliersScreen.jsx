function SuppliersScreen({ suppliers, products, onAddSupplier, onDeleteSupplier, onAlertSupplier }) {
  const [show, setShow] = React.useState(false)

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <div className="crumb">Suppliers</div>
          <h1 className="page-title">Who you order from.</h1>
          <p className="page-sub">{suppliers.length} suppliers on file · low-stock alerts go to the listed email.</p>
        </div>
        <div className="head-actions">
          <button className="btn btn-primary" onClick={()=>setShow(true)}>
            <span dangerouslySetInnerHTML={{__html:I.Plus({size:15})}}/> New supplier
          </button>
        </div>
      </header>

      <div className="panel">
        <table className="inv-table">
          <thead>
            <tr><th>Supplier</th><th>Email</th><th>Phone</th><th>Products</th><th>Low stock</th><th></th></tr>
          </thead>
          <tbody>
            {suppliers.map(s => {
              const items = products.filter(p => p.proveedor_id === s.id && p.estado === 'activo')
              const low = items.filter(p => p.cantidad <= (p.stock_minimo || 0))
              return (
                <tr key={s.id}>
                  <td><strong>{s.nombre}</strong></td>
                  <td className="sup-mail">{s.email}</td>
                  <td style={{color:'var(--ink-dim)'}}>{s.telefono || "—"}</td>
                  <td>{items.length}</td>
                  <td>{low.length > 0 ? <span className="pill pill-amber">{low.length}</span> : <span className="muted">0</span>}</td>
                  <td className="row-actions">
                    {low.length > 0 && (
                      <button className="btn btn-ghost btn-xs" onClick={()=>onAlertSupplier(low[0])}>
                        <span dangerouslySetInnerHTML={{__html:I.Mail({size:13})}}/> Email restock
                      </button>
                    )}
                    <button className="icon-btn" title="Delete" onClick={()=>onDeleteSupplier(s)}>
                      <span dangerouslySetInnerHTML={{__html:I.Trash({size:14})}}/>
                    </button>
                  </td>
                </tr>
              )
            })}
            {suppliers.length === 0 && (
              <tr><td colSpan="6" className="empty">No suppliers yet. Add your first supplier.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <SupplierModal
        open={show}
        onClose={()=>setShow(false)}
        onCreate={(s) => { onAddSupplier(s); setShow(false) }}
      />
    </div>
  )
}

function SupplierModal({ open, onClose, onCreate }) {
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [err, setErr] = React.useState("")

  React.useEffect(()=>{ if (open) { setName(""); setEmail(""); setPhone(""); setErr("") }}, [open])
  if (!open) return null

  const create = async (e) => {
    e.preventDefault()
    if (!name.trim()) return setErr("Supplier name is required.")
    if (!email.includes("@")) return setErr("Valid email is required for restock alerts.")
    try {
      const data = await api.addProveedor({ nombre: name.trim(), email: email.trim(), telefono: phone.trim() })
      onCreate(data)
    } catch (e) {
      setErr(e.message)
    }
  }

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()} role="dialog" aria-label="New supplier">
        <header className="modal-head">
          <div>
            <div className="crumb">Suppliers</div>
            <h3>Add a new supplier</h3>
          </div>
          <button className="icon-btn" onClick={onClose}><span dangerouslySetInnerHTML={{__html:I.X({size:16})}}/></button>
        </header>
        <form onSubmit={create} className="modal-body" style={{display:'flex', flexDirection:'column', gap:16}}>
          <Field label="Supplier name">
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Pacific Pantry"/>
          </Field>
          <Field label="Order email" hint="Used for low-stock alerts">
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="orders@supplier.com"/>
          </Field>
          <Field label="Phone (optional)">
            <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+1 …"/>
          </Field>
          {err && <div className="form-error">{err}</div>}
          <footer className="modal-foot" style={{padding:0, border:'none', marginTop:8}}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create supplier</button>
          </footer>
        </form>
      </div>
    </div>
  )
}

window.SuppliersScreen = SuppliersScreen
window.SupplierModal = SupplierModal
