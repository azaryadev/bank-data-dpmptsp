/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { use, useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Controller, useForm } from 'react-hook-form'
import { z, ZodType } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { useSupabaseMutation } from '@/services/swr/useSupabaseMutation'
import {
    Button,
    Card,
    DatePicker,
    Form,
    FormItem,
    Input,
    Notification,
    Select,
    toast,
    Upload,
} from '@/components/ui'
import {
    optionsBarangJasaUtama,
    optionsKelembagaan,
} from '../../_components/constants'
import { useSupabaseSWR } from '@/services/swr/useSupabaseSWR'
import { FaFilePdf } from 'react-icons/fa'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { selectRelation } from '@/utils/selectRelation'
import { SiupData } from '@/@types/siup'


type CreateSIUPDataFormInputs = {
    nomor_advis: string
    nama_perusahaan: string
    penanggung_jawab: string
    alamat_perusahaan: string
    kekayaan_bersih_rp: number
    kelembagaan: string //dropdown
    kegiatan_usaha_kbli: string
    direktur: string
    barang_jasa_utama: string //dropdown
    tanggal_keluar?: string | Date | null | undefined
    kategori_usaha_id: string // dripdown kategori_usaha
    documents?: string //base64
    // created_by : string
}

const validationSchema: ZodType<CreateSIUPDataFormInputs> = z.object({
    nomor_advis: z.string().min(1, 'Nomor advis wajib diisi'),
    nama_perusahaan: z.string().min(1, 'Nama perusahaan wajib diisi'),
    penanggung_jawab: z.string().min(1, 'Penanggung jawab wajib diisi'),
    alamat_perusahaan: z.string().min(1, 'Alamat perusahaan wajib diisi'),
    kekayaan_bersih_rp: z
        .number({ invalid_type_error: 'Kekayaan bersih harus berupa angka' })
        .min(0, 'Kekayaan bersih tidak boleh negatif'),
    kelembagaan: z.string().min(1, 'Kelembagaan wajib diisi'),
    kegiatan_usaha_kbli: z.string().min(1, 'Kegiatan usaha KBLI wajib diisi'),
    direktur: z.string().min(1, 'Direktur wajib diisi'),
    barang_jasa_utama: z.string().min(1, 'Barang/jasa utama wajib diisi'),
    tanggal_keluar: z.any().optional().nullable(),
    kategori_usaha_id: z.string().min(1, 'Kategori usaha wajib diisi'),
    documents: z.any().optional().nullable(),
})

const PageUpdate = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id: idParams } = use(params)

    const router = useRouter()

    const { data: dataKategoriUsaha } = useSupabaseSWR('kategori_usaha', {
        select: 'id,name',
    })

    const optionKategoriUsaha = dataKategoriUsaha?.data.map((item: any) => ({
        label: item.name,
        value: item.id,
    }))

    const { data } = useSupabaseSWR('siup_data', {
        select: selectRelation(['*'], ['kategori_usaha(id,name)']),
        filter: { id: idParams },
    })

    const selectedData = data?.data[0] as SiupData

    const {
        watch,
        handleSubmit,
        reset,
        // trigger,
        setValue,
        formState: { errors },
        control,
    } = useForm<CreateSIUPDataFormInputs>({
        resolver: zodResolver(validationSchema),
    })

    const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false)
    const [isConfirmCancel, setConfirmCancel] = useState(false)

    const {
        mutate,
        isLoading,
        error: errorUpdate,
    } = useSupabaseMutation('siup_data', 'PATCH')

    useEffect(() => {
        if (selectedData) {
            reset({
                nomor_advis: selectedData.nomor_advis,
                nama_perusahaan: selectedData.nama_perusahaan,
                penanggung_jawab: selectedData.penanggung_jawab,
                alamat_perusahaan: selectedData.alamat_perusahaan,
                kekayaan_bersih_rp: selectedData.kekayaan_bersih_rp,
                kelembagaan: selectedData.kelembagaan,
                kegiatan_usaha_kbli: selectedData.kegiatan_usaha_kbli,
                direktur: selectedData.direktur,
                barang_jasa_utama: selectedData.barang_jasa_utama,
                tanggal_keluar: selectedData.tanggal_keluar,
                kategori_usaha_id: selectedData.kategori_usaha_id,
                documents: selectedData.documents,
            })
        }
    }, [selectedData, reset])

    console.log('watch', watch())

    function formatRupiah(value: any) {
        if (!value) return ''
        // Hanya angka
        const numberString = value.replace(/[^,\d]/g, '')
        // Format dengan titik
        return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    }

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

    // Validate file before uploading
    const beforeUpload = (files: FileList | null) => {
        let valid: string | boolean = true

        const allowedFileType = ['pdf', 'docx'] // Only allow PDF and DOCX
        const maxFileSize = 500000 // 500KB

        if (files) {
            for (const f of files) {
                const fileExtension = f.name.split('.').pop()?.toLowerCase()

                if (!allowedFileType.includes(fileExtension || '')) {
                    valid = 'Please upload a .pdf or .docx file!'
                }

                if (f.size > maxFileSize) {
                    valid = 'Upload file cannot be more than 500KB!'
                }
            }
        }

        return valid
    }

    function getBase64String(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                // The result is something like "data:application/pdf;base64,JVBERi0xLjcKJc..."
                const result = reader.result as string
                // Extract the base64 part after the comma
                const base64String = result.split(',')[1]
                resolve(base64String)
            }
            reader.onerror = (error) => reject(error)
        })
    }

    const onFileUpload = (files: File[]) => {
        if (files.length > 0) {
            const file = files[0]
            getBase64String(file).then((base64String) => {
                setValue('documents', base64String)
            })
        }
    }

    const [formData, setFormData] = useState<CreateSIUPDataFormInputs>()

    const onSubmit = (data: CreateSIUPDataFormInputs) => {
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
                            Successfully update data siup
                        </Notification>,
                    )
                }, 1500)
                setTimeout(() => {
                    router.push('/siup')
                }, 2500)
            }

            if (errorUpdate) {
                setConfirmDialogOpen(true)
                setTimeout(() => {
                    toast.push(
                        <Notification title="Error" type="danger">
                            Error to update data siup
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
                            Failed update data siup!
                        </Notification>,
                    )
                }, 1500)
            }
        }
    }

    return (
        <main>
            <Card>
                <div className=" flex flex-col">
                    <h4 className="mb-8">Create SIUP Data</h4>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-4  items-start">
                            <FormItem
                                asterisk
                                label="Nomor Advis"
                                invalid={Boolean(errors.nomor_advis)}
                                errorMessage={errors.nomor_advis?.message}
                            >
                                <Controller
                                    name="nomor_advis"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            autoComplete="off"
                                            placeholder="Please input nomor advis..."
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                            <FormItem
                                asterisk
                                label="Nama Perusahaan"
                                invalid={Boolean(errors.nama_perusahaan)}
                                errorMessage={errors.nama_perusahaan?.message}
                            >
                                <Controller
                                    name="nama_perusahaan"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            autoComplete="off"
                                            placeholder="Please input nama perusahaan..."
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                            <FormItem
                                asterisk
                                label="Penanggung Jawab"
                                invalid={Boolean(errors.penanggung_jawab)}
                                errorMessage={errors.penanggung_jawab?.message}
                            >
                                <Controller
                                    name="penanggung_jawab"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            autoComplete="off"
                                            placeholder="Please input nama penanggung jawab..."
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                            <FormItem
                                asterisk
                                label="Alamat Perusahaan"
                                invalid={Boolean(errors.alamat_perusahaan)}
                                errorMessage={errors.alamat_perusahaan?.message}
                            >
                                <Controller
                                    name="alamat_perusahaan"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            autoComplete="off"
                                            placeholder="Please input alamat perusahaan..."
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                            <FormItem
                                asterisk
                                label="Kekayaan Bersih (Rp)"
                                invalid={Boolean(errors.kekayaan_bersih_rp)}
                                errorMessage={
                                    errors.kekayaan_bersih_rp?.message
                                }
                            >
                                <Controller
                                    name="kekayaan_bersih_rp"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            prefix={<span>Rp</span>}
                                            type="text"
                                            autoComplete="off"
                                            placeholder="Masukkan kekayaan bersih..."
                                            value={formatRupiah(
                                                field.value
                                                    ? field.value.toString()
                                                    : '',
                                            )}
                                            onChange={(e) => {
                                                // Ambil hanya angka
                                                const rawValue =
                                                    e.target.value.replace(
                                                        /[^,\d]/g,
                                                        '',
                                                    )
                                                // Update ke form sebagai number
                                                field.onChange(
                                                    rawValue
                                                        ? parseInt(rawValue, 10)
                                                        : '',
                                                )
                                            }}
                                        />
                                    )}
                                />
                            </FormItem>
                            <FormItem
                                asterisk
                                label="Direktur"
                                invalid={Boolean(errors.direktur)}
                                errorMessage={errors.direktur?.message}
                            >
                                <Controller
                                    name="direktur"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            autoComplete="off"
                                            placeholder="Please input nama direktur..."
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                            <FormItem
                                asterisk
                                label="Kelembagaan"
                                invalid={Boolean(errors.kelembagaan)}
                                errorMessage={errors.kelembagaan?.message}
                            >
                                <Controller
                                    name="kelembagaan"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            className="w-full uppercase"
                                            placeholder="Please select kelembagaan..."
                                            value={optionsKelembagaan?.find(
                                                (option) =>
                                                    option?.value ===
                                                    field?.value,
                                            )}
                                            options={optionsKelembagaan}
                                            isSearchable={false}
                                            isClearable={true}
                                            onChange={(option: any) =>
                                                field.onChange(option?.value)
                                            }
                                        />
                                    )}
                                />
                            </FormItem>
                            <FormItem
                                asterisk
                                label="Barang Jasa Utama"
                                invalid={Boolean(errors.barang_jasa_utama)}
                                errorMessage={errors.barang_jasa_utama?.message}
                            >
                                <Controller
                                    name="barang_jasa_utama"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            className="w-full uppercase"
                                            placeholder="Please select barang jasa utama..."
                                            value={optionsBarangJasaUtama?.find(
                                                (option) =>
                                                    option?.value ===
                                                    field?.value,
                                            )}
                                            options={optionsBarangJasaUtama}
                                            isSearchable={false}
                                            isClearable={true}
                                            onChange={(option: any) =>
                                                field.onChange(option?.value)
                                            }
                                        />
                                    )}
                                />
                            </FormItem>
                            <FormItem
                                asterisk
                                label="Tanggal Keluar"
                                invalid={Boolean(errors.tanggal_keluar)}
                                errorMessage={errors.tanggal_keluar?.message}
                            >
                                <DatePicker
                                    value={(() => {
                                        const tgl = watch('tanggal_keluar')
                                        if (!tgl) return undefined
                                        if (tgl instanceof Date) return tgl
                                        if (
                                            typeof tgl === 'string' ||
                                            typeof tgl === 'number'
                                        )
                                            return new Date(tgl)
                                        return undefined
                                    })()}
                                    placeholder="Pick a date"
                                    onChange={async (date) => {
                                        setValue('tanggal_keluar', date)
                                    }}
                                />
                            </FormItem>
                            <FormItem
                                asterisk
                                label="Kategori Usaha"
                                invalid={Boolean(errors.kategori_usaha_id)}
                                errorMessage={errors.kategori_usaha_id?.message}
                            >
                                <Controller
                                    name="kategori_usaha_id"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            className="w-full uppercase"
                                            placeholder="Please select kategori usaha..."
                                            value={optionKategoriUsaha?.find(
                                                (option: any) =>
                                                    option?.value ===
                                                    field?.value,
                                            )}
                                            options={optionKategoriUsaha}
                                            isSearchable={false}
                                            isClearable={true}
                                            onChange={(option: any) =>
                                                field.onChange(option?.value)
                                            }
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                        <FormItem
                            asterisk
                            label="Kegiatan Usaha (KBLI)"
                            invalid={Boolean(errors.kegiatan_usaha_kbli)}
                            errorMessage={errors.kegiatan_usaha_kbli?.message}
                        >
                            <Controller
                                name="kegiatan_usaha_kbli"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Please input kegiatan usaha..."
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        {selectedData.documents === null ? (
                            <FormItem label="Upload Documents">
                                <Controller
                                    name="documents"
                                    control={control}
                                    render={() => (
                                        <Upload
                                            draggable
                                            showList={true}
                                            className={`${errors.documents ? 'border-red-500' : ''}`}
                                            beforeUpload={beforeUpload}
                                            onChange={onFileUpload}
                                            onFileRemove={() =>
                                                setValue('documents', '')
                                            }
                                        >
                                            <div className="my-16 text-center">
                                                <div className="text-6xl mb-4 flex justify-center">
                                                    <FaFilePdf className=" w-24 h-24 text-primary" />
                                                </div>
                                                <p className="font-semibold">
                                                    <span className="text-gray-800 dark:text-white">
                                                        Drop your documents
                                                        here, or{' '}
                                                    </span>
                                                    <span className="text-blue-500">
                                                        browse
                                                    </span>
                                                </p>
                                                <p className="mt-1 opacity-60 dark:text-white">
                                                    Accepted format: .pdf
                                                </p>
                                            </div>
                                        </Upload>
                                    )}
                                />
                            </FormItem>
                        ) : (
                            <></>
                        )}

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
                        ? 'Cancel Update SIUP Data'
                        : 'Update  SIUP Data'
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
