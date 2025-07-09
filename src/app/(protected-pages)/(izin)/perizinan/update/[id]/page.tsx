/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { useSupabaseSWR } from '@/services/swr/useSupabaseSWR'
import { useSupabaseMutation } from '@/services/swr/useSupabaseMutation'
import { selectRelation } from '@/utils/selectRelation'

import { Controller, useForm } from 'react-hook-form'
import { z, ZodType } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import {
    Button,
    Card,
    Form,
    FormItem,
    Input,
    Notification,
    Select,
    toast,
} from '@/components/ui'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

import { RekapIzinData } from '@/@types/rekapIzin'

const validationSchema: ZodType<RekapIzinData> = z.object({
    surat_izin_id: z
        .string({ message: 'silahkan pilih surat izin terlebih dahulu' })
        .min(1, 'Surat izin wajib diisi'),
    jan: z.number().min(0, 'Jika tidak ada, maka isi saja 0'),
    feb: z.number().min(0, 'Jika tidak ada, maka isi saja 0'),
    mart: z.number().min(0, 'Jika tidak ada, maka isi saja 0'),
    aprl: z.number().min(0, 'Jika tidak ada, maka isi saja 0'),
    mei: z.number().min(0, 'Jika tidak ada, maka isi saja 0'),
    juni: z.number().min(0, 'Jika tidak ada, maka isi saja 0'),
    juli: z.number().min(0, 'Jika tidak ada, maka isi saja 0'),
    agust: z.number().min(0, 'Jika tidak ada, maka isi saja 0'),
    sept: z.number().min(0, 'Jika tidak ada, maka isi saja 0'),
    okt: z.number().min(0, 'Jika tidak ada, maka isi saja 0'),
    nov: z.number().min(0, 'Jika tidak ada, maka isi saja 0'),
    des: z.number().min(0, 'Jika tidak ada, maka isi saja 0'),
    tahun: z.coerce.number().min(2000, 'Tahun tidak valid'),
})

const PageUpdate = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id: idParams } = use(params)

    const router = useRouter()

    const { data: dataSuratIzin } = useSupabaseSWR('surat_izin', {
        select: 'id,name',
        pageSize: null,
    })
    const optionSuratIzin = dataSuratIzin?.data?.map((item: any) => ({
        label: item.name,
        value: item.id,
    }))

    const { data } = useSupabaseSWR('rekap_izin', {
        select: selectRelation(['*'], ['surat_izin(id,name)']),
        filter: { id: idParams },
    })

    const selectedData = data?.data[0] as RekapIzinData

    console.log('selectedData', selectedData)

    console.log('dataSuratIzin', optionSuratIzin)

    const {
        watch,
        handleSubmit,
        reset,
        // trigger,
        // setValue,
        formState: { errors },
        control,
    } = useForm<RekapIzinData>({
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        if (selectedData) {
            reset({
                surat_izin_id: selectedData.surat_izin_id,
                jan: selectedData.jan,
                feb: selectedData.feb,
                mart: selectedData.mart,
                aprl: selectedData.aprl,
                mei: selectedData.mei,
                juni: selectedData.juni,
                juli: selectedData.juli,
                agust: selectedData.agust,
                sept: selectedData.sept,
                okt: selectedData.okt,
                nov: selectedData.nov,
                des: selectedData.des,
                tahun: selectedData.tahun,
            })
        }
    }, [selectedData, reset])

    const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false)
    const [isConfirmCancel, setConfirmCancel] = useState(false)

    const {
        mutate,
        isLoading,
        error: errorUpdate,
    } = useSupabaseMutation('rekap_izin', 'PATCH')

    const onHandleBack = () => {
        const obj = watch()
        const isEmpty = Object.values(obj).every(
            (value) =>
                value === undefined ||
                value === null ||
                (typeof value === 'string' && value.trim() === '') ||
                (Array.isArray(value) && value.length === 0),
        )

        if (isEmpty) {
            router.back()
            reset()
        } else {
            setConfirmCancel(true)
        }
    }

    const onHandleCancel = () => {
        setConfirmCancel(false)
        router.back()
        reset()
    }

    const [formData, setFormData] = useState<RekapIzinData>()

    const onSubmit = (data: RekapIzinData) => {
        setFormData(data)
        setConfirmDialogOpen(true)
    }

    const onHandleSubmit = async () => {
        const data = { ...formData }
        console.log('data to submit', data)

        try {
            const res = await mutate(data, { id: idParams })

            if (res) {
                setTimeout(() => {
                    setConfirmDialogOpen(false)
                    reset()
                }, 500)

                setTimeout(() => {
                    toast.push(
                        <Notification title="Success" type="success">
                            Successfully update data rekap izin
                        </Notification>,
                    )
                }, 1500)
                setTimeout(() => {
                    router.push('/perizinan')
                }, 2500)
            }

            if (errorUpdate) {
                setConfirmDialogOpen(true)
                setTimeout(() => {
                    toast.push(
                        <Notification title="Error" type="danger">
                            Error to update data rekap izin
                        </Notification>,
                    )
                }, 500)
            }
        } catch (error) {
            if (error || errorUpdate) {
                setTimeout(() => {
                    setConfirmDialogOpen(false)
                }, 500)
                setTimeout(() => {
                    toast.push(
                        <Notification title="Error" type="danger">
                            Failed update data rekap izin!
                        </Notification>,
                    )
                }, 1500)
            }
        }
    }

    const listFormMonth = [
        {
            label: 'Januari',
            alias: 'jan',
        },
        {
            label: 'Februari',
            alias: 'feb',
        },
        {
            label: 'Maret',
            alias: 'mart',
        },
        {
            label: 'April',
            alias: 'aprl',
        },
        {
            label: 'Mei',
            alias: 'mei',
        },
        {
            label: 'Juni',
            alias: 'juni',
        },
        {
            label: 'Juli',
            alias: 'juli',
        },
        {
            label: 'Agustus',
            alias: 'agust',
        },
        {
            label: 'September',
            alias: 'sept',
        },
        {
            label: 'Oktober',
            alias: 'okt',
        },
        {
            label: 'November',
            alias: 'nov',
        },
        {
            label: 'Desember',
            alias: 'des',
        },
    ]

    return (
        <main>
            <Card>
                <div className=" flex flex-col">
                    <h4 className="mb-8">Update Rekap Izin</h4>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-x-4 mb-8  items-start">
                            <FormItem
                                asterisk
                                label="Surat Izin"
                                invalid={Boolean(errors.surat_izin_id)}
                                errorMessage={errors.surat_izin_id?.message}
                            >
                                <Controller
                                    name="surat_izin_id"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            className="w-full uppercase"
                                            placeholder="Please select surat izin..."
                                            value={optionSuratIzin?.find(
                                                (option: any) =>
                                                    option?.value ===
                                                    field?.value,
                                            )}
                                            options={optionSuratIzin}
                                            isSearchable={true}
                                            isClearable={true}
                                            onChange={(option: any) =>
                                                field.onChange(option?.value)
                                            }
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 mb-4  items-start">
                            {listFormMonth?.map((item, i) => (
                                <FormItem
                                    key={i}
                                    asterisk
                                    label={item.label}
                                    invalid={Boolean(
                                        errors[
                                            item.alias as keyof RekapIzinData
                                        ],
                                    )}
                                    errorMessage={
                                        errors[
                                            item.alias as keyof RekapIzinData
                                        ]?.message
                                    }
                                >
                                    <div>
                                        <Controller
                                            name={
                                                item.alias as keyof RekapIzinData
                                            }
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    type="number"
                                                    autoComplete="off"
                                                    placeholder="Please input total..."
                                                    value={
                                                        field.value as
                                                            | string
                                                            | number
                                                    }
                                                    onChange={(e) => {
                                                        const value =
                                                            e.target.value
                                                        field.onChange(
                                                            value === ''
                                                                ? 0
                                                                : parseInt(
                                                                      value,
                                                                      10,
                                                                  ),
                                                        )
                                                    }}
                                                    onBlur={field.onBlur}
                                                    name={field.name}
                                                />
                                            )}
                                        />
                                    </div>
                                </FormItem>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-x-4 mb-8 items-start">
                            <FormItem
                                asterisk
                                label="Tahun"
                                invalid={Boolean(errors.tahun)}
                                errorMessage={errors.tahun?.message}
                            >
                                <Controller
                                    name="tahun"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            autoComplete="off"
                                            placeholder="Please input tahun..."
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                        <div className="text-right mt-6">
                            <Button
                                className="ltr:mr-2 rtl:ml-2"
                                variant="plain"
                                onClick={onHandleBack}
                            >
                                Back
                            </Button>
                            <Button
                                className=" hover:bg-primary-mild"
                                variant="solid"
                                type="submit"
                            >
                                Update
                            </Button>
                        </div>
                    </Form>
                </div>
            </Card>

            <ConfirmDialog
                isOpen={isConfirmDialogOpen || isConfirmCancel}
                title={
                    isConfirmCancel
                        ? 'Cancel Update Rekap Izin Data'
                        : 'Update  Rekap Izin Data'
                }
                confirmText={
                    isLoading
                        ? 'Loading....'
                        : isConfirmCancel
                          ? 'Discard Change'
                          : 'Yes'
                }
                cancelText={isConfirmCancel ? 'Go Back' : 'No'}
                type="warning"
                closable={false}
                onCancel={() => {
                    setConfirmDialogOpen(false)
                    setConfirmCancel(false)
                }}
                onConfirm={isConfirmCancel ? onHandleCancel : onHandleSubmit}
            >
                {isConfirmCancel ? (
                    <p>
                        Your changes won’t be saved. We won’t be able to save
                        your data if you move away from this page.
                    </p>
                ) : (
                    <p>Are you sure want to do this ?</p>
                )}
            </ConfirmDialog>
        </main>
    )
}

export default PageUpdate
