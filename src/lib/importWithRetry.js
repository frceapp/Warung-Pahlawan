// Browser (misalnya Chrome) mengingat import() yang gagal: memanggil import()
// yang sama lagi langsung gagal tanpa mengunduh ulang, jadi "Coba lagi"
// tidak akan pernah berhasil walaupun jaringan sudah pulih. Kalau import
// gagal dan pesan errornya menyebut alamat berkasnya (Chrome dan Firefox),
// berkas itu diminta sekali lagi dengan alamat yang sedikit berbeda supaya
// benar-benar diunduh ulang.
export function findModuleUrl(error) {
  return String(error?.message ?? '').match(/https?:\/\/[^\s'"]+?\.js/)?.[0] ?? null
}

export function importWithRetry(importer, freshImport = (url) => import(/* @vite-ignore */ url)) {
  return importer().catch((error) => {
    const url = findModuleUrl(error)
    if (!url) throw error
    return freshImport(`${url}?coba=${Date.now()}`)
  })
}
