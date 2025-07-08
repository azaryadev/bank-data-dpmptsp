/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { SiupData } from '@/@types/siup'
import { Button, Card } from '@/components/ui'
import { useSupabaseSWR } from '@/services/swr/useSupabaseSWR'
import { selectRelation } from '@/utils/selectRelation'
import React, { use } from 'react'

import { useRouter } from 'next/navigation'

import FilePdf from '@/assets/svg/files/FilePdf'
import Loading from '@/components/shared/Loading'

const PageDetail = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params)

    const router = useRouter()

    const { data, isLoading } = useSupabaseSWR('siup_data', {
        select: selectRelation(['*'], ['kategori_usaha(id,name)']),
        filter: { id },
    })

    const selectedData = data?.data[0] as SiupData

    console.log('data by id', selectedData)

    const CardInformation = ({
        title,
        value,
    }: {
        title: string
        value: any
    }) => (
        <div className=" rounded-lg bg-gray-50 p-4 shadow-md border border-gray-200 ">
            <h6 className="font-bold mb-2">{title}</h6>
            <p>{value}</p>
        </div>
    )

    function getBase64FileSize(base64String: any) {
        const cleaned = base64String.split(',').pop() || ''
        const padding = (cleaned.match(/=+$/) || [''])[0].length
        return (cleaned.length * 3) / 4 - padding
    }

    function downloadBase64Pdf(
        base64String: string | undefined,
        fileName = 'document.pdf',
    ) {
        const linkSource = `data:application/pdf;base64,${base64String}`
        const downloadLink = document.createElement('a')
        downloadLink.href = linkSource
        downloadLink.download = fileName
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
    }

    return isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
            <Loading loading={true} type="cover" />
        </div>
    ) : (
        selectedData && (
            <Card bordered={false}>
                <div className="  mb-8 flex items-center justify-between">
                    <div>
                        <h3>Detail Information</h3>
                        <p>Surat Izin Usaha Perdagangan</p>
                    </div>
                    {selectedData.documents === null ? (
                        <></>
                    ) : (
                        <div
                            onClick={() =>
                                downloadBase64Pdf(
                                    selectedData.documents,
                                    `${selectedData.nomor_advis}.pdf`,
                                )
                            }
                            className="bg-white w-fit rounded-xl dark:bg-gray-800 border border-gray-200 dark:border-transparent p-2.5 lg:p-3.5 flex items-center gap-2 transition-all hover:shadow-[0_0_1rem_0.25rem_rgba(0,0,0,0.04),0px_2rem_1.5rem_-1rem_rgba(0,0,0,0.12)] cursor-pointer"
                            role="button"
                        >
                            <div className="text-3xl">
                                <FilePdf width={35} height={35} />
                            </div>
                            <div>
                                <div className="font-bold heading-text">
                                    {selectedData.nomor_advis}.pdf
                                </div>
                                <span className="text-xs">
                                    {selectedData.documents
                                        ? `${(getBase64FileSize(selectedData.documents) / 1024).toFixed(2)} KB`
                                        : '250 Kb'}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
                <div className=" grid grid-cols-3 gap-4">
                    <CardInformation
                        title="Nomor Advis"
                        value={selectedData.nomor_advis}
                    />
                    <CardInformation
                        title="Nama Perusahaan"
                        value={selectedData.nama_perusahaan}
                    />
                    <CardInformation
                        title="Penanggung Jawab"
                        value={selectedData.penanggung_jawab}
                    />
                    <CardInformation
                        title="Alamat Perusahaan"
                        value={selectedData.alamat_perusahaan}
                    />
                    <CardInformation
                        title="Kekayaan Bersih"
                        value={
                            <span>
                                {Number(
                                    selectedData.kekayaan_bersih_rp,
                                ).toLocaleString('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                })}
                            </span>
                        }
                    />
                    <CardInformation
                        title="Kelembagaan"
                        value={
                            <span className="uppercase">
                                {selectedData.kelembagaan}
                            </span>
                        }
                    />
                    <CardInformation
                        title="Kegiatan Usaha"
                        value={
                            <span className="uppercase">
                                {selectedData.kegiatan_usaha_kbli}
                            </span>
                        }
                    />
                    <CardInformation
                        title="Direktur"
                        value={
                            <span className="uppercase">
                                {selectedData.direktur}
                            </span>
                        }
                    />
                    <CardInformation
                        title="Barang Jasa Utama"
                        value={
                            <span className="uppercase">
                                {selectedData.barang_jasa_utama}
                            </span>
                        }
                    />
                    <CardInformation
                        title="Tanggal Keluar"
                        value={
                            <span>
                                {selectedData.tanggal_keluar
                                    ? new Date(
                                          selectedData.tanggal_keluar,
                                      ).toLocaleDateString('id-ID', {
                                          day: '2-digit',
                                          month: 'long',
                                          year: 'numeric',
                                      })
                                    : '-'}
                            </span>
                        }
                    />
                    <CardInformation
                        title="Kategori Usaha"
                        value={
                            <span className="uppercase">
                                {selectedData.kategori_usaha?.name}
                            </span>
                        }
                    />
                </div>

                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="solid"
                        onClick={() => {
                            router.back()
                        }}
                    >
                        Kembali
                    </Button>
                </div>
            </Card>
        )
    )
}

export default PageDetail
