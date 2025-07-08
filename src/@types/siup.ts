export type SiupData = {
    nomor_advis?: string
    nama_perusahaan?: string
    penanggung_jawab?: string
    alamat_perusahaan?: string
    kekayaan_bersih_rp?: number
    kelembagaan?: string
    kegiatan_usaha_kbli?: string
    direktur?: string
    barang_jasa_utama?: string
    tanggal_keluar?: string | Date | null | undefined
    kategori_usaha_id?: string
    documents?: string
    created_by?: string
    created_at?: string | Date | null | undefined
    updated_at?: string | Date | null | undefined
    kategori_usaha?: {
        id: string
        name: string
    }
}
