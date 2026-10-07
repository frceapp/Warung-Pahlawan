import { formatRupiah } from '../game/format.js'
import { sumMoney } from '../game/payment.js'
import BagImage from './BagImage.jsx'
import MoneyImage from './MoneyImage.jsx'
import Receipt from './Receipt.jsx'

// Setelah kembalian benar: nota lunas tetap di meja, dan bungkusan belanja
// serta uang kembalian disiapkan untuk pembeli. Keduanya lalu berpindah ke
// tangan pembeli (HandoverFlight); setelah itu tempatnya diberi keterangan,
// jadi meja tidak kosong. Tombol lanjut ke pembeli berikutnya ada di bar aksi.
function ServedStep({ customer, change, handedOver, isLast }) {
  const groups = [...new Set(change)].sort((a, b) => b - a)
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2 md:gap-4">
      <Receipt order={customer.order} showSubtotals showTotal paid />
      {/* Lebarnya tetap, supaya nota tidak bergeser saat isinya berganti. */}
      <div className="flex w-[100px] flex-col items-center gap-1 rounded-2xl border-4 border-tinta bg-kapur/90 px-1.5 py-1.5 text-center text-sm md:w-[150px] md:px-3 md:py-2 md:text-base">
        {handedOver ? (
          <p className="flex min-h-[72px] flex-col justify-center gap-1 md:min-h-[96px]">
            <span className="font-bold">Sudah diterima pembeli.</span>
            {isLast && <span>Semua pembeli sudah dilayani.</span>}
          </p>
        ) : (
          <>
            <div data-handover-item="bag">
              <BagImage size={44} className="h-12 w-11 md:h-16 md:w-14" />
            </div>
            {change.length > 0 ? (
              <div data-handover-item="change" className="flex flex-wrap justify-center gap-0.5">
                {groups.map((value) => (
                  <MoneyImage key={value} value={value} size={56} decorative className="h-6 w-10 md:h-[34px] md:w-14" />
                ))}
              </div>
            ) : null}
            <p className="sr-only">
              Bungkusan belanja{change.length > 0 ? ` dan kembalian ${formatRupiah(sumMoney(change))}` : ''} untuk
              pembeli.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default ServedStep
