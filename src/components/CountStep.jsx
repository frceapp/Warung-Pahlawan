import Button from './Button.jsx'
import Receipt from './Receipt.jsx'
import TotalChoices from './TotalChoices.jsx'

// Langkah 3: hitung total belanja dari nota.
function CountStep({ level, customer, wrongTotals, onChoose, onConfirm }) {
  const isShown = level.totalMode === 'shown'

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start">
      <Receipt
        order={customer.order}
        showSubtotals={level.totalMode !== 'unguided'}
        showTotal={isShown}
      />
      <div className="flex flex-col gap-3">
        {isShown ? (
          <>
            <p className="text-lg">
              Nota sudah menghitung totalnya. Lihat harga tiap buah, lalu lanjut terima uang.
            </p>
            <Button onClick={onConfirm} className="self-start">
              Terima uang pembeli
            </Button>
          </>
        ) : (
          <>
            <p className="text-lg">
              {level.totalMode === 'guided'
                ? 'Jumlahkan hasil kali tiap baris. Berapa totalnya?'
                : 'Kalikan harga dengan jumlah tiap buah, lalu jumlahkan. Berapa totalnya?'}
            </p>
            <TotalChoices
              choices={customer.totalChoices}
              wrongChoices={wrongTotals}
              onChoose={onChoose}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default CountStep
