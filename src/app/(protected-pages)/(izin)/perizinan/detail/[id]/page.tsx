'use client'

import { RekapIzinData } from '@/@types/rekapIzin'
import Loading from '@/components/shared/Loading'
import { Button, Card } from '@/components/ui'
import { useSupabaseSWR } from '@/services/swr/useSupabaseSWR'
import { selectRelation } from '@/utils/selectRelation'
import React, { use } from 'react'
import DetailChart from './_components/DetailChart'
import { useRouter } from 'next/navigation'

const PageDetail = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params)

    const router = useRouter()

    const { data, isLoading } = useSupabaseSWR('rekap_izin', {
        select: selectRelation(['*'], ['surat_izin(id,name)']),
        filter: { id },
    })

    const selectedData = data?.data[0] as RekapIzinData

    console.log('data by id', selectedData)

    const bulanKeys = [
        'jan',
        'feb',
        'mart',
        'aprl',
        'mei',
        'juni',
        'juli',
        'agust',
        'sept',
        'okt',
        'nov',
        'des',
    ]

    const dataChart = selectedData
        ? bulanKeys.map((bulan) => ({
              bulan,
              total:
                  Number(selectedData[bulan as keyof typeof selectedData]) || 0,
          }))
        : []

    console.log('hasil', dataChart)

    return isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
            <Loading loading={true} type="cover" />
        </div>
    ) : (
        selectedData && (
            <Card bordered={false}>
                <div className=" flex flex-col gap-2 mb-8">
                    <h3>Detail Information</h3>
                    <h6 className=" font-semibold">
                        {selectedData.surat_izin?.name} / Tahun{' '}
                        {selectedData.tahun}
                    </h6>
                    <p>Total : <span className='text-black font-bold'>{selectedData.total} surat</span></p>
                </div>

                <DetailChart data={dataChart} />

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
