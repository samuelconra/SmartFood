function InventoryScreen({ products, categories, suppliers, onAdd, onEdit, onDelete, onMark, onAlertSupplier }) {
  const [q, setQ] = React.useState("")
  const [cat, setCat] = React.useState("all")
  const [sort, setSort] = React.useState("expiry")
  const [view, setView] = React.useState("table")

  const rows = React.useMemo(() => {
    let r = products.filter(p => p.estado === 'activo').map(p => ({ ...p, daysLeft: daysBetween(p.fecha_caducidad) }))
    if (cat !== "all") r = r.filter(p => p.categoria_id === cat)
    if (q) {
      const Q = q.toLowerCase()
      r = r.filter(p =>
        p.nombre.toLowerCase().includes(Q) ||
        (p.sku || '').toLowerCase().includes(Q) ||
        (suppliers.find(s=>s.id===p.proveedor_id)?.nombre || '').toLowerCase().includes(Q)
      )
    }
    r.sort((a,b) => {
      if (sort === "expiry") return a.daysLeft - b.daysLeft
      if (sort === "name") return a.nombre.localeCompare(b.nombre)
      if (sort === "quantity") return a.cantidad - b.cantidad
      return 0
    })
    return r
  }, [products, q, cat, sort, suppliers])

  const counts = React.useMemo(() => {
    const c = { all: products.filter(p=>p.estado==='activo').length }
    categories.forEach(k => c[k.id] = products.filter(p=>p.categoria_id===k.id && p.estado==='activo').length)
    return c
  }, [products, categories])

  const catColors = {1:'#7B9E8D',2:'#A48D6C',3:'#C49A6C',4:'#A46758',5:'#8B7E74',6:'#7A9BA6'}

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <div className="crumb">Inventory</div>
          <h1 className="page-title">All products</h1>
          <p className="page-sub">{products.filter(p=>p.estado==='activo').length} SKUs · {products.filter(p=>p.estado==='activo').reduce((s,p)=>s+Number(p.cantidad),0)} units on hand</p>
        </div>
        <div className="head-actions">
          <div className="seg">
            <button className={view==="table"?"on":""} onClick={()=>setView("table")}>Table</button>
            <button className={view==="cards"?"on":""} onClick={()=>setView("cards")}>Cards</button>
          </div>
          <button className="btn btn-primary" onClick={onAdd}>
            <span dangerouslySetInnerHTML={{__html:I.Plus({size:15})}}/> Add product
          </button>
        </div>
      </header>

      <div className="filter-bar">
        <div className="search">
          <span dangerouslySetInnerHTML={{__html:I.Search({size:15})}}/>
          <input placeholder="Search by name, SKU, supplier…" value={q} onChange={(e)=>setQ(e.target.value)}/>
          {q && <button className="search-clear" onClick={()=>setQ("")}><span dangerouslySetInnerHTML={{__html:I.X({size:12})}}/></button>}
        </div>
        <div className="chips">
          <button className={`chip ${cat==="all"?"on":""}`} onClick={()=>setCat("all")}>
            All <span className="chip-count">{counts.all}</span>
          </button>
          {categories.map(c => (
            <button key={c.id} className={`chip ${cat===c.id?"on":""}`} onClick={()=>setCat(c.id)}>
              <span className="chip-swatch" style={{background:catColors[c.id]}}/>{c.nombre}
              <span className="chip-count">{counts[c.id]||0}</span>
            </button>
          ))}
        </div>
        <div className="sort">
          <label>Sort</label>
          <select value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="expiry">Days remaining</option>
            <option value="name">Name (A→Z)</option>
            <option value="quantity">Quantity</option>
          </select>
        </div>
      </div>

      {view === "table" ? (
        <div className="table-wrap panel">
          <table className="inv-table">
            <thead>
              <tr>
                <th style={{width:"32%"}}>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Supplier</th>
                <th>Expiry</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(p => {
                const sup = suppliers.find(s=>s.id===p.proveedor_id)
                const c = categories.find(k=>k.id===p.categoria_id)
                const tone = p.daysLeft <= 3 ? "red" : p.daysLeft <= 7 ? "amber" : "green"
                const low = p.cantidad <= (p.stock_minimo || 0)
                return (
                  <tr key={p.id}>
                    <td>
                      <div className="prod-cell">
                        <button className="row-link" onClick={()=>onEdit(p)}>{p.nombre}</button>
                        {low && <span className="tag tag-low">Low stock</span>}
                      </div>
                    </td>
                    <td><code className="sku">{p.sku || '—'}</code></td>
                    <td>
                      <span className="cat-badge">
                        <span className="cat-dot" style={{background:catColors[p.categoria_id] || '#817B73'}}/>{c?.nombre}
                      </span>
                    </td>
                    <td>
                      <div className="qty-cell">
                        <strong>{p.cantidad}</strong> <span className="unit">{p.unidad}</span>
                        <div className="qty-bar"><span style={{width:`${Math.min(100, (p.cantidad/Math.max((p.stock_minimo||1)*2, 1))*100)}%`}}/></div>
                      </div>
                    </td>
                    <td>
                      <div className="sup-cell">
                        <div>{sup?.nombre || '—'}</div>
                        <div className="sup-mail">{sup?.email}</div>
                      </div>
                    </td>
                    <td>
                      <span className={`pill pill-${tone}`}>
                        {p.daysLeft <= 0 ? "Expired" : `${p.daysLeft}d`}
                      </span>
                      <div className="exp-date">{formatDate(p.fecha_caducidad)}</div>
                    </td>
                    <td className="row-actions">
                      {low && (
                        <button className="icon-btn" title="Email supplier for restock" onClick={()=>onAlertSupplier(p)}>
                          <span dangerouslySetInnerHTML={{__html:I.Mail({size:14})}}/>
                        </button>
                      )}
                      <button className="icon-btn" title="Mark consumed" onClick={()=>onMark(p.id,'consumido')}>
                        <span dangerouslySetInnerHTML={{__html:I.Check({size:14})}}/>
                      </button>
                      <button className="icon-btn" title="Edit" onClick={()=>onEdit(p)}>
                        <span dangerouslySetInnerHTML={{__html:I.Edit({size:14})}}/>
                      </button>
                      <button className="icon-btn" title="Delete" onClick={()=>onDelete(p)}>
                        <span dangerouslySetInnerHTML={{__html:I.Trash({size:14})}}/>
                      </button>
                    </td>
                  </tr>
                )
              })}
              {rows.length === 0 && (
                <tr><td colSpan="7" className="empty">No products match those filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card-grid">
          {rows.map(p => {
            const sup = suppliers.find(s=>s.id===p.proveedor_id)
            const c = categories.find(k=>k.id===p.categoria_id)
            const tone = p.daysLeft <= 3 ? "red" : p.daysLeft <= 7 ? "amber" : "green"
            return (
              <div key={p.id} className="prod-card" onClick={()=>onEdit(p)}>
                <div className="prod-card-head">
                  <code className="sku">{p.sku || '—'}</code>
                  <span className={`pill pill-${tone}`}>{p.daysLeft <= 0 ? "Expired" : `${p.daysLeft}d`}</span>
                </div>
                <div className="prod-card-name">{p.nombre}</div>
                <div className="cat-badge"><span className="cat-dot" style={{background:catColors[p.categoria_id]}}/>{c?.nombre}</div>
                <div className="prod-card-foot">
                  <div><strong>{p.cantidad}</strong> <span className="unit">{p.unidad}</span></div>
                  <div className="sup-mail">{sup?.nombre || '—'}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <button className="fab" onClick={onAdd} aria-label="Add product">
        <span dangerouslySetInnerHTML={{__html:I.Plus({size:20})}}/>
      </button>
    </div>
  )
}

window.InventoryScreen = InventoryScreen
