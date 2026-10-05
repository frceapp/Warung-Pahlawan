import ChangeTray from './ChangeTray.jsx'
import MoneyDrawer from './MoneyDrawer.jsx'

// Langkah 4: susun kembalian dari laci. Uang pembeli dan total belanja
// ada di balon bicara; tombol "Berikan kembalian" dan "Tidak perlu
// kembalian" ada di bar aksi.
function ChangeStep({ level, givenChange, onAdd, onRemove, onClear }) {
  return (
    <div className="grid gap-2 md:grid-cols-2 md:gap-4">
      <section
        aria-labelledby="drawer-title"
        className="rounded-2xl border-4 border-tinta bg-langit p-2 md:p-3"
      >
        <h3 id="drawer-title" className="sr-only md:not-sr-only md:mb-2 md:font-heading md:text-xl">
          Laci uang
        </h3>
        <MoneyDrawer values={level.drawer} onAdd={onAdd} />
      </section>
      <section
        aria-labelledby="tray-title"
        className="rounded-2xl border-4 border-tinta bg-langit p-2 md:p-3"
      >
        <h3 id="tray-title" className="sr-only">
          Kembalian
        </h3>
        <ChangeTray values={givenChange} onRemove={onRemove} onClear={onClear} />
      </section>
    </div>
  )
}

export default ChangeStep
