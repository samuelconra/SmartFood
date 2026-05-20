function Field({ label, hint, right, error, children }) {
  return (
    <label className="field">
      <span className="field-label">
        {label}
        {right && <span className="field-right">{right}</span>}
      </span>
      {children}
      {hint && !error && <small className="field-hint">{hint}</small>}
      {error && <small className="field-error">{error}</small>}
    </label>
  )
}

function ProductDrawer({ open, initial, categories, suppliers, onClose, onSave, onAddSupplier }) {
  const [form, setForm] = React.useState({})
  const [errs, setErrs] = React.useState({})
  const [showSupplier, setShowSupplier] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      if (initial) {
        setForm({ ...initial })
      } else {
        const cat = categories[0]
        setForm({ nombre:'', sku: autoSku(cat?.nombre), categoria_id: cat?.id || '', proveedor_id: '', cantidad:1, unidad:'ea', stock_minimo:5, precio_unitario:0, fecha_caducidad: new Date(Date.now()+14*86400000).toISOString().split('T')[0] })
      }
      setErrs({})
    }
  }, [open, initial])

  if (!open) return null
  const set = (k,v) => setForm(f => ({...f, [k]: v}))

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.nombre?.trim()) next.nombre = "Required"
    if (!form.categoria_id) next.categoria_id = "Required"
    if (!form.fecha_caducidad) next.fecha_caducidad = "Required"
    setErrs(next)
    if (Object.keys(next).length === 0) onSave(form)
  }

  const catColors = {1:'#7B9E8D',2:'#A48D6C',3:'#C49A6C',4:'#A46758',5:'#8B7E74',6:'#7A9BA6'}
  const expiryDays = daysBetween(form.fecha_caducidad)
  const previewTone = expiryDays <= 3 ? "red" : expiryDays <= 7 ? "amber" : "green"
  const isLow = (form.cantidad || 0) <= (form.stock_minimo || 0)

  return (
    <>
      <div className="drawer-scrim" onClick={onClose}/>
      <aside className="drawer" role="dialog" aria-label="Product details">
        <header className="drawer-head">
          <div>
            <div className="crumb">{initial ? "Edit product" : "New product"}</div>
            <h2>{initial ? form.nombre || "Untitled" : "Add a product"}</h2>
          </div>
          <button className="icon-btn" onClick={onClose}><span dangerouslySetInnerHTML={{__html:I.X({size:16})}}/></button>
        </header>

        <form onSubmit={submit} className="drawer-body">
          <Field label="Name *" error={errs.nombre}>
            <input value={form.nombre || ''} onChange={e=>set("nombre", e.target.value)} placeholder="e.g. Aged parmesan"/>
          </Field>

          <div className="row-2">
            <Field label="Category *" error={errs.categoria_id}>
              <select value={form.categoria_id || ''} onChange={e=>set("categoria_id", e.target.value)}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </Field>
            <Field label="SKU">
              <input value={form.sku || ''} onChange={e=>set("sku", e.target.value)} placeholder="SF-XX-0000"/>
            </Field>
          </div>

          <div className="row-3">
            <Field label="Quantity *" error={errs.cantidad}>
              <input type="number" min="0" value={form.cantidad || 0} onChange={e=>set("cantidad", Number(e.target.value))}/>
            </Field>
            <Field label="Unit">
              <select value={form.unidad || 'ea'} onChange={e=>set("unidad", e.target.value)}>
                {["ea","lb","kg","gal","L","pk","oz"].map(u => <option key={u}>{u}</option>)}
              </select>
            </Field>
            <Field label="Reorder at" hint="Trigger email">
              <input type="number" min="0" value={form.stock_minimo || 0} onChange={e=>set("stock_minimo", Number(e.target.value))}/>
            </Field>
          </div>

          <div className="row-2">
            <Field label="Expiration date *" error={errs.fecha_caducidad}>
              <input type="date" value={form.fecha_caducidad || ''} onChange={e=>set("fecha_caducidad", e.target.value)}/>
            </Field>
            <Field label="Unit price">
              <div className="prefix-input">
                <span className="prefix">$</span>
                <input type="number" step="0.01" value={form.precio_unitario || 0} onChange={e=>set("precio_unitario", Number(e.target.value))}/>
              </div>
            </Field>
          </div>

          <Field label="Supplier" right={
            <button type="button" className="link" onClick={()=>setShowSupplier(true)}>+ New supplier</button>
          }>
            <select value={form.proveedor_id || ''} onChange={e=>set("proveedor_id", e.target.value || null)}>
              <option value="">None</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.nombre} — {s.email}</option>)}
            </select>
          </Field>

          <div className="preview">
            <div className="preview-title">Preview</div>
            <div className="preview-row">
              <span className={`pill pill-${previewTone}`}>
                {expiryDays <= 0 ? "Expired" : `${expiryDays}d left`}
              </span>
              <span className="preview-name">{form.nombre || "Untitled product"}</span>
              <code className="sku">{form.sku || "SF-—"}</code>
            </div>
            <div className="preview-meta">
              {form.cantidad || 0} {form.unidad || 'ea'} on hand · reorder at {form.stock_minimo || 0} · {suppliers.find(s=>s.id===form.proveedor_id)?.nombre || 'No supplier'}
            </div>
            {isLow && (
              <div className="preview-warn">
                <span dangerouslySetInnerHTML={{__html:I.Mail({size:13})}}/> Auto-email will be sent to {suppliers.find(s=>s.id===form.proveedor_id)?.email || 'supplier'} on save.
              </div>
            )}
          </div>

          <footer className="drawer-foot" style={{padding:0, border:'none', marginTop:'auto'}}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{initial ? "Save changes" : "Add product"}</button>
          </footer>
        </form>
      </aside>

      {showSupplier && (
        <SupplierModal
          open={showSupplier}
          onClose={()=>setShowSupplier(false)}
          onCreate={(s) => { onAddSupplier(s); set("proveedor_id", s.id); setShowSupplier(false) }}
        />
      )}
    </>
  )
}

window.ProductDrawer = ProductDrawer
