'use client'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    Tooltip,
    Table,
    Button,
    Tag,
    Pagination,
    Select,
    toast,
    Notification,
} from '@/components/ui'
import { useSupabaseMutation } from '@/services/swr/useSupabaseMutation'
import classNames from '@/utils/classNames'
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    OnChangeFn,
    SortingState,
    useReactTable,
} from '@tanstack/react-table'

import moment from 'moment'

import { useRouter } from 'next/navigation'
import React, { useMemo, useState } from 'react'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

const pageSizeOption = [
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
    { value: 30, label: '30 / page' },
    { value: 40, label: '40 / page' },
    { value: 50, label: '50 / page' },
]

type BodySiup = {
    id: string
    nomor_advis: string
    nama_perusahaan: string
    penanggung_jawab: string
    alamat_perusahaan: string
    kekayaan_bersih_rp: number
    kelembagaan: string
    kegiatan_usaha_kbli: string
    direktur: string
    barang_jasa_utama: string
    tanggal_keluar: string
    created_by: string
    created_at: string
    updated_at: string
    kategori_usaha_id: string
    kategori_usaha: {
        id: string
        name: string
    }
}

type TableSiupProps = {
    data?: BodySiup[] | undefined
    page: number
    pageSize: number
    setPage: (page: number) => void
    setPageSize: (pageSize: number) => void
    totalRecords: number | undefined
    sorting: SortingState // Add sorting prop
    setSorting: React.Dispatch<React.SetStateAction<SortingState>>
    refresh: () => void
}

const TableSiup: React.FC<TableSiupProps> = ({
    data,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalRecords,
    sorting,
    setSorting,
    refresh,
}) => {
    const totalData = data ? data.length : 0

    const router = useRouter()

    const handleSortingChange: OnChangeFn<SortingState> = (updaterOrValue) => {
        if (typeof updaterOrValue === 'function') {
            setSorting(updaterOrValue(sorting)) // Handle functional update
        } else {
            setSorting(updaterOrValue) // Handle direct value update
        }
    }

    const {
        mutate,
        isLoading: isLoadingDelete,
        error: errorDelete,
    } = useSupabaseMutation('siup_data', 'DELETE')

    const [isConfirmDelete, setIsConfirmDelete] = useState(false)
    const [id, setId] = useState<string | undefined>(undefined)
    console.log('selected id: ', id)

    const onHandleDelete = async (id: string | undefined): Promise<void> => {
        if (id === undefined) return

        try {
            const res = await mutate(undefined, { id })

            if (res) {
                setTimeout(() => {
                    setIsConfirmDelete(false)
                }, 500)

                setTimeout(() => {
                    toast.push(
                        <Notification title="Success" type="success">
                            Successfully delete data
                        </Notification>,
                    )
                }, 1500)
                setTimeout(() => {
                    refresh()
                }, 2500)
            }

            if (errorDelete) {
                setIsConfirmDelete(true)
                setTimeout(() => {
                    toast.push(
                        <Notification title="Error" type="danger">
                            Error to deleting data.
                        </Notification>,
                    )
                }, 500)
            }
        } catch (error) {
            if (error || errorDelete) {
                toast.push(
                    <Notification title="Error" type="danger">
                        Failed to delete data.
                    </Notification>,
                )
            }
        }
    }

    const columns = useMemo<ColumnDef<BodySiup>[]>(
        () => [
            {
                header: (header) => (
                    <div className="flex items-center justify-left">
                        {' '}
                        Nomor Advis
                        <Tooltip
                            title={
                                header.column.getIsSorted() === 'asc'
                                    ? 'Sorted Ascending'
                                    : header.column.getIsSorted() === 'desc'
                                      ? 'Sorted Descending'
                                      : 'Click to Sort'
                            }
                        >
                            <Sorter sort={header.column.getIsSorted()} />{' '}
                        </Tooltip>
                    </div>
                ),
                accessorKey: 'nomor_advis',
                cell: ({ getValue }) => (
                    <div
                        style={{ width: '200px' }}
                        className="  text-left" // Centered content
                    >
                        {getValue() as string}
                    </div>
                ),
            },
            {
                header: (header) => (
                    <div className="flex items-center justify-left">
                        {' '}
                        Name Perusahaan
                        <Tooltip
                            title={
                                header.column.getIsSorted() === 'asc'
                                    ? 'Sorted Ascending'
                                    : header.column.getIsSorted() === 'desc'
                                      ? 'Sorted Descending'
                                      : 'Click to Sort'
                            }
                        >
                            <Sorter sort={header.column.getIsSorted()} />{' '}
                        </Tooltip>
                    </div>
                ),
                accessorKey: 'nama_perusahaan',
                cell: ({ getValue }) => {
                    return (
                        <div
                            className="  text-left" // Centered content
                        >
                            {getValue() as string}
                        </div>
                    )
                },
                enableSorting: true,
            },

            {
                header: (header) => (
                    <div className="flex items-center justify-left">
                        {' '}
                        Kategori Usaha
                        <Tooltip
                            title={
                                header.column.getIsSorted() === 'asc'
                                    ? 'Sorted Ascending'
                                    : header.column.getIsSorted() === 'desc'
                                      ? 'Sorted Descending'
                                      : 'Click to Sort'
                            }
                        >
                            <Sorter sort={header.column.getIsSorted()} />{' '}
                        </Tooltip>
                    </div>
                ),
                accessorKey: 'kategori_usaha.name',
                cell: ({ getValue }) => {
                    const value = getValue() as boolean

                    return (
                        <div
                            style={{ width: '100px', minWidth: '100px' }}
                            className="text-center"
                        >
                            <Tag className="bg-emerald-100 py-1 px-2.5 text-emerald-600 border-0 rounded">
                                {value}
                            </Tag>
                        </div>
                    )
                },
            },

            {
                header: (header) => (
                    <div className="flex items-center justify-left">
                        {' '}
                        Tanggal Keluar
                        <Tooltip
                            title={
                                header.column.getIsSorted() === 'asc'
                                    ? 'Sorted Ascending'
                                    : header.column.getIsSorted() === 'desc'
                                      ? 'Sorted Descending'
                                      : 'Click to Sort'
                            }
                        >
                            <Sorter sort={header.column.getIsSorted()} />{' '}
                        </Tooltip>
                    </div>
                ),
                accessorKey: 'tanggal_keluar',
                cell: ({ getValue }) => {
                    const value = getValue() as string
                    const date = moment(value)
                    if (date.isValid()) {
                        return <div>{date.format('YYYY-MM-DD')}</div>
                    } else {
                        return <p>-</p>
                    }
                },
            },

            {
                header: 'Actions',
                id: 'actions',
                enableSorting: false,
                cell: ({ row }) => (
                    <div className="flex flex-col lg:flex-row space-y-2 lg:space-x-2 lg:space-y-0">
                        <Button
                            size="xs"
                            variant="solid"
                            customColorClass={({ active, unclickable }) =>
                                classNames(
                                    'hover:text-white dark:hover:bg-blue-600 border-0 hover:ring-0',
                                    active ? 'bg-blue-600' : 'bg-blue-500',
                                    unclickable &&
                                        'opacity-50 cursor-not-allowed',
                                    !active &&
                                        !unclickable &&
                                        'hover:bg-blue-600',
                                )
                            }
                            onClick={() => {
                                setId(row.original.id)
                                router.push(`/siup/detail/${row.original.id}`)
                            }}
                        >
                            Detail
                        </Button>
                        <Button
                            size="xs"
                            variant="solid"
                            customColorClass={({ active, unclickable }) =>
                                classNames(
                                    'hover:text-white dark:hover:bg-yellow-600 border-0 hover:ring-0',
                                    active ? 'bg-yellow-600' : 'bg-yellow-500',
                                    unclickable &&
                                        'opacity-50 cursor-not-allowed',
                                    !active &&
                                        !unclickable &&
                                        'hover:bg-yellow-600',
                                )
                            }
                            onClick={() => {
                                router.push(`/siup/update/${row.original.id}`)
                            }}
                        >
                            Update
                        </Button>
                        <Button
                            size="xs"
                            variant="solid"
                            customColorClass={({ active, unclickable }) =>
                                classNames(
                                    'hover:text-white dark:hover:bg-red-600 border-0 hover:ring-0',
                                    active ? 'bg-red-600' : 'bg-red-500',
                                    unclickable &&
                                        'opacity-50 cursor-not-allowed',
                                    !active &&
                                        !unclickable &&
                                        'hover:bg-red-600',
                                )
                            }
                            onClick={() => {
                                setId(row.original.id)
                                setIsConfirmDelete(true)
                            }}
                        >
                            Delete
                        </Button>
                    </div>
                ),
            },
        ],
        [router],
    )

    const table = useReactTable({
        data: data ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            pagination: {
                pageIndex: page - 1,
                pageSize: pageSize,
            },
            sorting,
        },
        onSortingChange: handleSortingChange, // Update sorting state
        manualSorting: true, // Enable manual sorting
        onPaginationChange: (updater) => {
            if (typeof updater === 'function') {
                const newPagination = updater(table.getState().pagination)
                setPage(newPagination.pageIndex + 1)
                setPageSize(newPagination.pageSize)
            }
        },
        manualPagination: true,
        pageCount: totalRecords ? Math.ceil(totalRecords / pageSize) : -1,
    })

    const onPaginationChange = (page: number) => {
        setPage(page)
        // table.setPageIndex(page - 1)
    }
    const onSelectChange = (value = 0) => {
        const newPageSize = Number(value)
        setPageSize(newPageSize)
        // table.setPageSize(newPageSize)
    }

    return (
        <>
            {totalData > 0 ? (
                <div className="overflow-x-auto">
                    <Table className="text-[12px]">
                        <THead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <Tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <Th
                                                key={header.id}
                                                colSpan={header.colSpan}
                                            >
                                                {header.isPlaceholder ? null : (
                                                    <div
                                                        {...{
                                                            className:
                                                                header.column.getCanSort()
                                                                    ? 'cursor-pointer select-none'
                                                                    : '',
                                                            onClick:
                                                                header.column.getToggleSortingHandler(),
                                                        }}
                                                    >
                                                        {flexRender(
                                                            header.column
                                                                .columnDef
                                                                .header,
                                                            header.getContext(),
                                                        )}
                                                    </div>
                                                )}
                                            </Th>
                                        )
                                    })}
                                </Tr>
                            ))}
                        </THead>

                        <TBody>
                            {table.getRowModel().rows.map((row) => {
                                return (
                                    <Tr key={row.id}>
                                        {row.getVisibleCells().map((cell) => {
                                            return (
                                                <Td key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef
                                                            .cell,
                                                        cell.getContext(),
                                                    )}
                                                </Td>
                                            )
                                        })}
                                    </Tr>
                                )
                            })}
                        </TBody>
                    </Table>
                </div>
            ) : (
                <div>
                    <h6 className=" text-center mt-10">No data</h6>
                </div>
            )}

            <div className="flex items-center justify-between mt-4">
                <Pagination
                    displayTotal
                    pageSize={pageSize}
                    currentPage={page}
                    total={totalRecords ?? 0}
                    onChange={onPaginationChange}
                />
                <div style={{ minWidth: 130 }}>
                    <Select
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOption.find(
                            (option) => option.value === pageSize,
                        )}
                        options={pageSizeOption}
                        onChange={(option) => onSelectChange(option?.value)}
                    />
                </div>
            </div>

            <ConfirmDialog
                isOpen={isConfirmDelete}
                title="Delete Data"
                confirmText={isLoadingDelete ? 'Deleting...' : 'Yes'}
                cancelText="Cancel"
                type="warning"
                closable={false}
                onCancel={() => {
                    setIsConfirmDelete(false)
                }}
                onConfirm={() => {
                    onHandleDelete(id)
                }}
            >
                <p>
                    You’re about to permanently delete this data and its
                    dependencies. <br />
                    <br />
                    If you’re not sure, you can select cancel instead
                </p>
            </ConfirmDialog>
        </>
    )
}

export default TableSiup
