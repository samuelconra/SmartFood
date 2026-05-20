function DashboardScreen({ products, suppliers, categories, stats, onNav, onAddProduct, onAlertSupplier, usuario }) {
  const expiringSoon = products
    .map(p => ({ ...p, daysLeft: daysBetween(p.fecha_caducidad) }))
    .filter(p => p.daysLeft <= 3 && p.estado === 'activo')
    .sort((a,b) => a.daysLeft - b.daysLeft)

  const lowStock = products.filter(p => p.estado === 'activo' && p.cantidad <= (p.stock_minimo || 0))
  const alertCount = expiringSoon.length + lowStock.length
  const totalItems = products.reduce((s,p) => s + Number(p.cantidad), 0)

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <div className="crumb">Workspace · The Kitchen</div>
          <h1 className="page-title">Good afternoon, {usuario?.nombre || 'there'}.</h1>
          <p className="page-sub">Here's what's moving in your pantry today.</p>
        </div>
        <div className="head-actions">
          <button className="btn btn-ghost" onClick={()=>onNav("inventory")}>
            <span dangerouslySetInnerHTML={{__html:I.Box({size:15})}}/> View inventory
          </button>
          <button className="btn btn-primary" onClick={onAddProduct}>
            <span dangerouslySetInnerHTML={{__html:I.Plus({size:15})}}/> Add product
          </button>
        </div>
      </header>

      <section className="stat-row">
        <StatCard label="Products in stock" value={products.filter(p=>p.estado==='activo').length} delta={`${totalItems} units total`} />
        <StatCard label="Active alerts" value={alertCount} delta={`${expiringSoon.length} expiring · ${lowStock.length} low`} accent={alertCount > 0 ? "amber" : null}/>
        <StatCard label="Food used this month" value={`${stats?.porcentaje_aprovechado || 0}%`} delta={`${stats?.desperdiciados || 0} waste · ${stats?.consumidos || 0} used`} accent="green"/>
        <StatCard label="Suppliers" value={suppliers.length} delta={`${stats?.proveedores_count || 0} on file`} />
      </section>

      {expiringSoon.length > 0 && (
        <section className="expiry-banner">
          <div className="banner-left">
            <div className="banner-icon"><span dangerouslySetInnerHTML={{__html:I.Bell({size:16})}}/></div>
            <div>
              <div className="banner-title">{expiringSoon.length} items expiring within 3 days</div>
              <div className="banner-sub">Move these to today's prep list or mark for donation before they go bad.</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={()=>onNav("inventory")}>Review all <span dangerouslySetInnerHTML={{__html:I.Chevron({size:14})}}/></button>
        </section>
      )}

      <div className="grid-2">
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3 className="panel-title">Closest to expiry</h3>
              <p className="panel-sub">Use these first.</p>
            </div>
            <button className="link" onClick={()=>onNav("inventory")}>See all</button>
          </div>
          <ul className="exp-list">
            {expiringSoon.slice(0, 5).map(p => {
              const sup = suppliers.find(s => s.id === p.proveedor_id)
              const tone = p.daysLeft <= 1 ? "red" : p.daysLeft <= 3 ? "amber" : "green"
              const low = p.cantidad <= (p.stock_minimo || 0)
              return (
                <li key={p.id} className="exp-row">
                  <div className="exp-main">
                    <div className={`pill pill-${tone}`}>{p.daysLeft <= 0 ? "Today" : `${p.daysLeft}d left`}</div>
                    <div>
                      <div className="exp-name">{p.nombre}</div>
                      <div className="exp-meta">{p.cantidad} {p.unidad} · {sup?.nombre || "—"}</div>
                    </div>
                  </div>
                  <div className="exp-actions">
                    {low && (
                      <button className="btn btn-ghost btn-xs" onClick={()=>onAlertSupplier(p)}>
                        <span dangerouslySetInnerHTML={{__html:I.Mail({size:13})}}/> Reorder
                      </button>
                    )}
                  </div>
                </li>
              )
            })}
            {expiringSoon.length === 0 && <li className="empty">Nothing expiring soon — nice.</li>}
          </ul>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h3 className="panel-title">Quick actions</h3>
          </div>
          <div className="qa-grid">
            <button className="qa" onClick={onAddProduct}>
              <span className="qa-icn" dangerouslySetInnerHTML={{__html:I.Plus({size:16})}}/>
              <span className="qa-title">Add product</span>
              <span className="qa-sub">SKU, supplier, expiry</span>
            </button>
            <button className="qa" onClick={()=>onNav("inventory")}>
              <span className="qa-icn" dangerouslySetInnerHTML={{__html:I.Box({size:16})}}/>
              <span className="qa-title">Inventory</span>
              <span className="qa-sub">{products.length} items tracked</span>
            </button>
            <button className="qa" onClick={()=>onNav("recipes")}>
              <span className="qa-icn" dangerouslySetInnerHTML={{__html:I.Chef({size:16})}}/>
              <span className="qa-title">Suggested recipes</span>
              <span className="qa-sub">Use expiring items</span>
            </button>
            <button className="qa" onClick={()=>onNav("suppliers")}>
              <span className="qa-icn" dangerouslySetInnerHTML={{__html:I.Truck({size:16})}}/>
              <span className="qa-title">Suppliers</span>
              <span className="qa-sub">{suppliers.length} on file</span>
            </button>
          </div>
          <div className="panel-foot">
            <div className="usage">
              <div className="usage-head">
                <span>Food used this month</span>
                <strong>{stats?.porcentaje_aprovechado || 0}%</strong>
              </div>
              <div className="usage-bar"><span style={{width:`${stats?.porcentaje_aprovechado || 0}%`}}/></div>
              <div className="usage-foot">
                <span><i className="dot dot-green"/> Used {stats?.porcentaje_aprovechado || 0}%</span>
                <span><i className="dot dot-amber"/> Donated {stats?.donados || 0}%</span>
                <span><i className="dot dot-red"/> Waste {stats?.desperdiciados || 0}</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="panel-head">
          <div>
            <h3 className="panel-title">By category</h3>
            <p className="panel-sub">Where your stock is sitting.</p>
          </div>
        </div>
        <div className="cat-row">
          {categories.map(c => {
            const items = products.filter(p => p.categoria_id === c.id && p.estado === 'activo')
            const qty = items.reduce((s,p) => s + Number(p.cantidad), 0)
            const exp = items.filter(p => daysBetween(p.fecha_caducidad) <= 3).length
            const catColors = {1:'#7B9E8D',2:'#A48D6C',3:'#C49A6C',4:'#A46758',5:'#8B7E74',6:'#7A9BA6'}
            return (
              <div key={c.id} className="cat-card">
                <div className="cat-swatch" style={{background:catColors[c.id] || '#817B73'}}/>
                <div className="cat-name">{c.nombre}</div>
                <div className="cat-meta">{items.length} SKUs · {qty} units</div>
                {exp > 0 && <div className="cat-exp"><span className="pill pill-amber">{exp} expiring</span></div>}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function StatCard({ label, value, delta, accent }) {
  return (
    <div className={`stat ${accent ? `stat-${accent}` : ""}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-delta">{delta}</div>
    </div>
  )
}

window.DashboardScreen = DashboardScreen
