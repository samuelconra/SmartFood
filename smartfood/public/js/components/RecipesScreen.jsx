function RecipesScreen({ products, recipeData }) {
  const [open, setOpen] = React.useState(null)
  const stockSet = new Set(products.filter(p => p.estado === 'activo' && p.cantidad > 0).map(p => p.nombre.toLowerCase().split(',')[0].trim()))

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <div className="crumb"><span dangerouslySetInnerHTML={{__html:I.Spark({size:12})}}/> AI suggestions</div>
          <h1 className="page-title">Cook what's in stock.</h1>
          <p className="page-sub">Three recipes that prioritize ingredients closest to expiry.</p>
        </div>
        <div className="head-actions">
          <button className="btn btn-ghost"><span dangerouslySetInnerHTML={{__html:I.Spark({size:14})}}/> Regenerate</button>
        </div>
      </header>

      <div className="recipe-grid">
        {(recipeData?.recetas || []).map((r, idx) => {
          return (
            <article key={idx} className="recipe-card">
              <div className="recipe-hero">
                <div className="hero-tag">RECIPE PHOTO</div>
                <div className="hero-meta">
                  <span>{r.tiempo || '30 min'}</span><span>·</span><span>Serves {r.porciones || 4}</span>
                </div>
              </div>
              <div className="recipe-body">
                <div className="recipe-match">
                  <div className="match-ring" style={{"--p": `${(r.ingredientes_disponibles / Math.max(r.ingredientes_necesarios.length,1))*100}%`}}>
                    <span>{r.ingredientes_disponibles}/{r.ingredientes_necesarios.length}</span>
                  </div>
                  <div>
                    <div className="match-title">{r.ingredientes_disponibles} of {r.ingredientes_necesarios.length} ingredients in stock</div>
                    <div className="match-sub">{r.ingredientes_disponibles >= 5 ? "Ready to cook tonight." : r.ingredientes_disponibles >= 3 ? "Just a couple short." : "Bigger shopping list."}</div>
                  </div>
                </div>

                <h3 className="recipe-title">{r.titulo}</h3>
                <p className="recipe-blurb">{r.descripcion || ''}</p>

                <ul className="ing-list">
                  {(r.en_stock || []).map((i, k) => (
                    <li key={k} className={i.disponible ? "have" : "miss"}>
                      <span className="ing-icn"><span dangerouslySetInnerHTML={{__html: i.disponible ? I.Check({size:12}) : I.Plus({size:12})}}/></span>
                      <span>{i.nombre.split(',')[0]}</span>
                      <span className="ing-tag">{i.disponible ? "In stock" : "Need"}</span>
                    </li>
                  ))}
                </ul>

                <div className="recipe-foot">
                  <button className="btn btn-primary btn-block" onClick={()=>setOpen(r)}>
                    View full instructions <span dangerouslySetInnerHTML={{__html:I.Chevron({size:14})}}/>
                  </button>
                </div>
              </div>
            </article>
          )
        })}
        {(!recipeData?.recetas || recipeData.recetas.length === 0) && (
          <p style={{gridColumn:'span 3', textAlign:'center', padding:40, color:'var(--ink-muted)'}}>
            {recipeData?.mensaje || 'Add products to get recipe suggestions.'}
          </p>
        )}
      </div>

      {open && (
        <div className="modal-scrim" onClick={()=>setOpen(null)}>
          <div className="modal modal-lg" onClick={e=>e.stopPropagation()} role="dialog">
            <header className="modal-head">
              <div>
                <div className="crumb">{open.tiempo || '30 min'} · Serves {open.porciones || 4}</div>
                <h3>{open.titulo}</h3>
              </div>
              <button className="icon-btn" onClick={()=>setOpen(null)}><span dangerouslySetInnerHTML={{__html:I.X({size:16})}}/></button>
            </header>
            <div className="modal-body recipe-modal">
              <p className="recipe-blurb">{open.descripcion || ''}</p>
              <h4 className="rs-h">Ingredients</h4>
              <ul className="ing-list">
                {(open.en_stock || []).map((i,k) => (
                  <li key={k} className={i.disponible ? "have":"miss"}>
                    <span className="ing-icn"><span dangerouslySetInnerHTML={{__html: i.disponible ? I.Check({size:12}) : I.Plus({size:12})}}/></span>
                    <span>{i.nombre.split(',')[0]}</span>
                    <span className="ing-tag">{i.disponible ? "In stock" : "Add to shopping list"}</span>
                  </li>
                ))}
              </ul>
              <h4 className="rs-h">Method</h4>
              <ol className="steps" style={{listStyle:'none', padding:0}}>
                {(open.instrucciones || '').split('\n').filter(Boolean).map((s,k) => (
                  <li key={k} style={{display:'flex', gap:12, padding:'8px 0', borderBottom:'1px solid rgba(229,231,235,0.3)', fontSize:13, lineHeight:1.5}}>
                    <span className="step-n">{k+1}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
            <footer className="modal-foot">
              <button className="btn btn-ghost" onClick={()=>setOpen(null)}>Close</button>
              <button className="btn btn-primary">Start cooking</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  )
}

window.RecipesScreen = RecipesScreen
