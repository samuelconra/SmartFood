function App() {
  const [route, setRoute] = React.useState(window.location.hash || '#login')
  const [usuario, setUsuario] = React.useState(() => {
    const u = localStorage.getItem('usuario')
    return u ? JSON.parse(u) : null
  })
  const [products, setProducts] = React.useState([])
  const [suppliers, setSuppliers] = React.useState([])
  const [categories, setCategories] = React.useState([])
  const [stats, setStats] = React.useState({})
  const [recipeData, setRecipeData] = React.useState({})
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [editProduct, setEditProduct] = React.useState(null)

  React.useEffect(() => {
    const handler = () => {
      const hash = window.location.hash || '#login'
      setRoute(hash)
    }
    window.addEventListener('hashchange', handler)
    window.addEventListener('load', () => {
      if (!window.location.hash) window.location.hash = '#login'
      setRoute(window.location.hash)
    })
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  React.useEffect(() => {
    if (route !== '#login' && usuario) {
      loadData()
    }
  }, [route, usuario])

  async function loadData() {
    try {
      const [pData, sData, stData, rData] = await Promise.all([
        api.getInsumos(),
        api.getProveedores(),
        api.getEstadisticas(),
        api.getRecetas().catch(() => ({ recetas: [] })),
      ])
      setProducts(pData.insumos || [])
      setCategories(pData.categorias || [])
      setSuppliers(sData || [])
      setStats(stData || {})
      setRecipeData(rData || {})
    } catch (e) {
      console.error('Error loading data:', e)
    }
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
    window.location.hash = '#login'
  }

  function navigate(path) {
    window.location.hash = path
  }

  function handleLogin(userData) {
    setUsuario(userData)
    window.location.hash = '#dashboard'
  }

  async function handleAddProduct(formData) {
    try {
      await api.addInsumo({
        nombre: formData.nombre,
        categoria_id: formData.categoria_id,
        cantidad: formData.cantidad,
        unidad: formData.unidad,
        fecha_caducidad: formData.fecha_caducidad,
        precio_unitario: formData.precio_unitario || 0,
        stock_minimo: formData.stock_minimo || 0,
        proveedor_id: formData.proveedor_id || null,
      })
      setDrawerOpen(false)
      setEditProduct(null)
      loadData()
    } catch (e) {
      console.error('Error adding product:', e)
    }
  }

  async function handleEditProduct(formData) {
    try {
      await api.updateInsumo(formData.id, {
        nombre: formData.nombre,
        categoria_id: formData.categoria_id,
        cantidad: formData.cantidad,
        unidad: formData.unidad,
        fecha_caducidad: formData.fecha_caducidad,
        precio_unitario: formData.precio_unitario || 0,
        stock_minimo: formData.stock_minimo || 0,
        proveedor_id: formData.proveedor_id || null,
      })
      setDrawerOpen(false)
      setEditProduct(null)
      loadData()
    } catch (e) {
      console.error('Error updating product:', e)
    }
  }

  async function handleDeleteProduct(product) {
    if (!confirm(`Delete ${product.nombre}?`)) return
    try {
      await api.deleteInsumo(product.id)
      loadData()
    } catch (e) {
      console.error('Error deleting product:', e)
    }
  }

  async function handleMarkProduct(id, tipo) {
    try {
      await api.addHistorial(id, tipo)
      loadData()
    } catch (e) {
      console.error('Error marking product:', e)
    }
  }

  async function handleAddSupplier(supplierData) {
    try {
      await api.addProveedor({
        nombre: supplierData.nombre,
        email: supplierData.email,
        telefono: supplierData.telefono || '',
      })
      loadData()
    } catch (e) {
      console.error('Error adding supplier:', e)
    }
  }

  async function handleDeleteSupplier(supplier) {
    if (!confirm(`Delete ${supplier.nombre}?`)) return
    try {
      await api.deleteProveedor(supplier.id)
      loadData()
    } catch (e) {
      console.error('Error deleting supplier:', e)
    }
  }

  function openDrawer(product = null) {
    setEditProduct(product)
    setDrawerOpen(true)
  }

  if (!usuario || route === '#login') {
    return <LoginScreen onLogin={handleLogin} />
  }

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: '▦' },
    { id: 'inventory', label: 'Inventory', icon: '📦' },
    { id: 'recipes', label: 'Recipes', icon: '🍳' },
    { id: 'suppliers', label: 'Suppliers', icon: '🏭' },
  ]

  const currentPage = route.replace('#', '') || 'dashboard'
  const initial = (usuario?.nombre || 'U')[0].toUpperCase()

  return (
    <div style={{display:'flex'}}>
      <div className="sidebar glass-dark">
        <div className="sidebar-logo">
          <Wordmark size={18}/>
        </div>
        <div className="sidebar-label">navigation</div>
        <nav className="sidebar-nav">
          {navLinks.map(l => (
            <a key={l.id}
              href={`#${l.id}`}
              className={`sidebar-link ${currentPage === l.id ? 'active' : ''}`}
            >{l.icon} {l.label}</a>
          ))}
        </nav>
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initial}</div>
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontSize:13, fontWeight:500}}>{usuario?.nombre || 'User'}</div>
            <div style={{fontSize:11, color:'rgba(255,255,255,0.4)'}}>{usuario?.email || ''}</div>
          </div>
          <button onClick={handleLogout} style={{background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:16}} title="Logout">⏻</button>
        </div>
      </div>

      <div className="main-content">
        {currentPage === 'dashboard' && (
          <DashboardScreen
            products={products}
            suppliers={suppliers}
            categories={categories}
            stats={stats}
            onNav={navigate}
            onAddProduct={() => openDrawer(null)}
            onAlertSupplier={(p) => alert(`Restock alert sent to supplier for ${p.nombre}`)}
            usuario={usuario}
          />
        )}
        {currentPage === 'inventory' && (
          <InventoryScreen
            products={products}
            categories={categories}
            suppliers={suppliers}
            onAdd={() => openDrawer(null)}
            onEdit={(p) => openDrawer(p)}
            onDelete={handleDeleteProduct}
            onMark={handleMarkProduct}
            onAlertSupplier={(p) => alert(`Restock alert sent to supplier for ${p.nombre}`)}
          />
        )}
        {currentPage === 'recipes' && (
          <RecipesScreen products={products} recipeData={recipeData} />
        )}
        {currentPage === 'suppliers' && (
          <SuppliersScreen
            suppliers={suppliers}
            products={products}
            onAddSupplier={handleAddSupplier}
            onDeleteSupplier={handleDeleteSupplier}
            onAlertSupplier={(p) => alert(`Restock alert sent to supplier for ${p.nombre}`)}
          />
        )}
      </div>

      <ProductDrawer
        open={drawerOpen}
        initial={editProduct}
        categories={categories}
        suppliers={suppliers}
        onClose={() => { setDrawerOpen(false); setEditProduct(null) }}
        onSave={(form) => editProduct ? handleEditProduct(form) : handleAddProduct(form)}
      />
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('app'))
root.render(<App />)
