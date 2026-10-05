import Receipt from './Receipt.jsx'

// Langkah 3: hitung total belanja dari nota. Pilihan total (atau tombol
// lanjut di level 1) ada di bar aksi.
function CountStep({ level, customer }) {
  const prompt = {
    shown: 'Nota sudah menghitung totalnya. Lihat harga tiap buah.',
    guided: 'Jumlahkan hasil kali tiap baris, lalu pilih totalnya.',
    unguided: 'Kalikan harga dengan jumlah, jumlahkan, lalu pilih totalnya.',
  }[level.totalMode]

  return (
    <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start md:gap-4">
      <Receipt
        order={customer.order}
        showSubtotals={level.totalMode !== 'unguided'}
        showTotal={level.totalMode === 'shown'}
      />
      <p className="text-sm md:text-lg">{prompt}</p>
    </div>
  )
}

export default CountStep
