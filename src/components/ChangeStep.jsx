import { formatRupiah } from '../game/format.js'
import Button from './Button.jsx'
import ChangeTray from './ChangeTray.jsx'
import MoneyDrawer from './MoneyDrawer.jsx'

// Langkah 4: susun kembalian dari laci, atau pilih "tidak perlu kembalian".
function ChangeStep({ level, customer, givenChange, onAdd, onRemove, onClear, onGive, onNoChange }) {
  return (
    <div className="flex flex-col gap-4">
      <dl className="grid grid-cols-2 gap-2 sm:max-w-md">
        <div className="rounded-xl border-4 border-tinta bg-langit px-3 py-2">
          <dt className="text-sm font-bold">Total belanja</dt>
          <dd className="font-heading text-2xl" data-total={customer.total}>
            {formatRupiah(customer.total)}
          </dd>
        </div>
        <div className="rounded-xl border-4 border-tinta bg-langit px-3 py-2">
          <dt className="text-sm font-bold">Uang pembeli</dt>
          <dd className="font-heading text-2xl" data-paid={customer.payment.amount}>
            {formatRupiah(customer.payment.amount)}
          </dd>
        </div>
      </dl>
      <p className="text-base">
        Kembalian = uang pembeli − total belanja. Jika uangnya pas, tidak perlu kembalian.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <section
          aria-labelledby="drawer-title"
          className="rounded-2xl border-4 border-tinta bg-langit p-3"
        >
          <h3 id="drawer-title" className="mb-2 font-heading text-xl">
            Laci uang
          </h3>
          <MoneyDrawer values={level.drawer} onAdd={onAdd} />
        </section>
        <section
          aria-labelledby="tray-title"
          className="flex flex-col gap-3 rounded-2xl border-4 border-tinta bg-langit p-3"
        >
          <h3 id="tray-title" className="font-heading text-xl">
            Kembalian
          </h3>
          <ChangeTray values={givenChange} onRemove={onRemove} onClear={onClear} />
          <div className="mt-auto flex flex-wrap gap-3">
            <Button onClick={onGive}>Berikan kembalian</Button>
            <Button variant="secondary" onClick={onNoChange}>
              Tidak perlu kembalian
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ChangeStep
