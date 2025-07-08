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
    toast,
} from '@/components/ui'

import { KategoriUsahaData } from '@/@types/kategoriUsaha'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

const validationSchema: ZodType<KategoriUsahaData> = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
})

const PageCreate = () => {
    const router = useRouter()

    const { session } = useCurrentSession()

    const userId = session.user?.profile.id

    const {
        watch,
        handleSubmit,
        reset,
        // trigger,
        formState: { errors },
        control,
    } = useForm<KategoriUsahaData>({
        resolver: zodResolver(validationSchema),
    })

    const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false)
    const [isConfirmCancel, setConfirmCancel] = useState(false)

    const {
        mutate,
        isLoading,
        error: errorCreate,
    } = useSupabaseMutation('kategori_usaha', 'POST')

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

    const [formData, setFormData] = useState<KategoriUsahaData>()

    const onSubmit = (data: KategoriUsahaData) => {
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
                            Successfully create kategori usaha
                        </Notification>,
                    )
                }, 1500)
                setTimeout(() => {
                    router.push('/kategori-usaha')
                }, 2500)
            }

            if (errorCreate) {
                setConfirmDialogOpen(true)
                setTimeout(() => {
                    toast.push(
                        <Notification title="Error" type="danger">
                            Error to create kategori usaha
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
                            Failed create kategori usaha!
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
                    <h4 className="mb-8">Create Kategori Usaha Data</h4>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-x-4  items-start">
                            <FormItem
                                asterisk
                                label="Name"
                                invalid={Boolean(errors.name)}
                                errorMessage={errors.name?.message}
                            >
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            autoComplete="off"
                                            placeholder="Please input name..."
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                            <FormItem
                                asterisk
                                label="Description"
                                invalid={Boolean(errors.description)}
                                errorMessage={errors.description?.message}
                            >
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            textArea
                                            rows={5}
                                            type="text"
                                            autoComplete="off"
                                            placeholder="Please input description..."
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
                        ? 'Cancel Create Kategori Usaha Data'
                        : 'Create  Kategori Usaha Data'
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
