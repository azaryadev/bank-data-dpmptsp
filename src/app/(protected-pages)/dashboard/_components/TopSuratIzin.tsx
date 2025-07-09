'use client'
import { Card } from '@/components/ui'
import { callSupabaseRPC } from '@/services/supabaseRpc'
import React, { useEffect, useState } from 'react'
import { IoDocument } from 'react-icons/io5'

const TopSuratIzin = () => {
    const [dataList, setDataList] = useState([])

    useEffect(() => {
        const getData = async () => {
            const dataTop5SuratIzin = await callSupabaseRPC(
                'get_top_5_jenis_izin',
            )

            setDataList(dataTop5SuratIzin)
        }

        getData()
    }, [])

    return (
        <Card>
            <div className=" flex items-center justify-between mb-4">
                <h4>Surat Izin</h4>
            </div>
            {dataList?.map(
                (
                    item: {
                        jenis_izin: string
                        jumlah: number
                    },
                    i: number,
                ) => (
                    <div key={i} className="flex items-center gap-4 mb-4">
                        <div className=" bg-primary-subtle  p-2 rounded-xl">
                            <IoDocument className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                            <p className=" text-black font-semibold">
                                {item.jenis_izin}
                            </p>
                        </div>
                        <p className=" text-primary bg-primary-subtle py-0.5 px-2 font-bold rounded-lg">
                            {item.jumlah}
                        </p>
                    </div>
                ),
            )}
        </Card>
    )
}

export default TopSuratIzin
