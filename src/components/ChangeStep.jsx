import ChangeTray from './ChangeTray.jsx'
import MoneyDrawer from './MoneyDrawer.jsx'

// Langkah 4: susun kembalian dari laci ke nampan, keduanya di atas meja
// kasir. Uang pembeli dan total belanja ada di balon bicara; tombol "Berikan
// kembalian" dan "Tidak perlu kembalian" ada di bar aksi.
function ChangeStep({ level, givenChange, onAdd, onRemove, onClear }) {
  return (
    <div className="grid gap-1.5 md:grid-cols-[5fr_4fr] md:gap-4 lg:grid-cols-1 lg:gap-3">
      <section
        aria-labelledby="drawer-title"
        className="counter-drawer rounded-2xl border-4 border-tinta p-1 md:p-2"
      >
        <h3 id="drawer-title" className="sr-only">
          Laci uang
        </h3>
        <MoneyDrawer values={level.drawer} onAdd={onAdd} />
      </section>
      <section
        aria-labelledby="tray-title"
        className="counter-tray rounded-[1.75rem] border-4 border-tinta px-3 py-1.5 md:px-5 md:py-2"
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
