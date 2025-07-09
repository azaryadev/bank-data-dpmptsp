/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Controller, useForm } from 'react-hook-form'
import { z, ZodType } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import useCurrentSession from '@/utils/hooks/useCurrentSession'
import { useSupabaseMutation } from '@/services/swr/useSupabaseMutation'
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
import { useSupabaseSWR } from '@/services/swr/useSupabaseSWR'

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

const PageCreate = () => {
    const router = useRouter()

    const { session } = useCurrentSession()
    const userId = session.user?.profile.id

    const { data: dataSuratIzin } = useSupabaseSWR('surat_izin', {
        select: 'id,name',
        pageSize: null,
    })
    const optionSuratIzin = dataSuratIzin?.data?.map((item: any) => ({
        label: item.name,
        value: item.id,
    }))

    console.log('dataSuratIzin', dataSuratIzin)

    const {
        watch,
        handleSubmit,
        reset,
        // trigger,
        // setValue,
        formState: { errors },
        control,
    } = useForm<RekapIzinData>({
        defaultValues: {
            jan: 0,
            feb: 0,
            mart: 0,
            aprl: 0,
            mei: 0,
            juni: 0,
            juli: 0,
            agust: 0,
            sept: 0,
            okt: 0,
            nov: 0,
            des: 0,
        },
        resolver: zodResolver(validationSchema),
    })

    const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false)
    const [isConfirmCancel, setConfirmCancel] = useState(false)

    const {
        mutate,
        isLoading,
        error: errorCreate,
    } = useSupabaseMutation('rekap_izin', 'POST')

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
        const data = { ...formData, created_by: userId }
        console.log('data to submit', data)

        try {
            const res = await mutate(data)

            if (res) {
                setTimeout(() => {
                    setConfirmDialogOpen(false)
                    reset()
                }, 500)

                setTimeout(() => {
                    toast.push(
                        <Notification title="Success" type="success">
                            Successfully create data rekap izin
                        </Notification>,
                    )
                }, 1500)
                setTimeout(() => {
                    router.push('/perizinan')
                }, 2500)
            }

            if (errorCreate) {
                setConfirmDialogOpen(true)
                setTimeout(() => {
                    toast.push(
                        <Notification title="Error" type="danger">
                            Error to create data rekap izin
                        </Notification>,
                    )
                }, 500)
            }
        } catch (error) {
            if (error || errorCreate) {
                setTimeout(() => {
                    setConfirmDialogOpen(false)
                }, 500)
                setTimeout(() => {
                    toast.push(
                        <Notification title="Error" type="danger">
                            Failed create data rekap izin!
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
                    <h4 className="mb-8">Create Rekap Izin</h4>
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
                                Create
                            </Button>
                        </div>
                    </Form>
                </div>
            </Card>

            <ConfirmDialog
                isOpen={isConfirmDialogOpen || isConfirmCancel}
                title={
                    isConfirmCancel
                        ? 'Cancel Create Rekap Izin Data'
                        : 'Create  Rekap Izin Data'
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

export default PageCreate
