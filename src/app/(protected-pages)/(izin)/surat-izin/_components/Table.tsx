'use client'
import React, { useMemo, useState } from 'react'
// import { useRouter } from 'next/navigation'

import { Tooltip, Table, Button, Pagination, Select } from '@/components/ui'
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

const { Tr, Th, Td, THead, TBody, Sorter } = Table

const pageSizeOption = [
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
    { value: 30, label: '30 / page' },
    { value: 40, label: '40 / page' },
    { value: 50, label: '50 / page' },
]
type BodySuratIzin = {
    id: string
    name: string
}

type TableSuratIzinProps = {
    data?: BodySuratIzin[] | undefined
    page: number
    pageSize: number
    setPage: (page: number) => void
    setPageSize: (pageSize: number) => void
    totalRecords: number | undefined
    sorting: SortingState // Add sorting prop
    setSorting: React.Dispatch<React.SetStateAction<SortingState>>
    refresh: () => void
}

const TableSuratIzin: React.FC<TableSuratIzinProps> = ({
    data,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalRecords,
    sorting,
    setSorting,
    refresh
}) => {
    const totalData = data ? data.length : 0
    // const router = useRouter()

    const handleSortingChange: OnChangeFn<SortingState> = (updaterOrValue) => {
        if (typeof updaterOrValue === 'function') {
            setSorting(updaterOrValue(sorting)) // Handle functional update
        } else {
            setSorting(updaterOrValue) // Handle direct value update
        }
    }

    const [id, setId] = useState<string | undefined>(undefined)
    console.log('selected id: ', id)

    const columns = useMemo<ColumnDef<BodySuratIzin>[]>(
        () => [
            {
                header: (header) => (
                    <div className="flex items-center justify-left">
                        {' '}
                        Name
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
                accessorKey: 'name',
                cell: ({ getValue }) => (
                    <div
                        // style={{ width: '150px' }}
                        className="  text-left" // Centered content
                    >
                        {getValue() as string}
                    </div>
                ),
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
                                    'hover:text-white dark:hover:bg-yellow-600 border-0 hover:ring-0',
                                    active ? 'bg-yellow-600' : 'bg-yellow-500',
                                    unclickable &&
                                        'opacity-50 cursor-not-allowed',
                                    !active &&
                                        !unclickable &&
                                        'hover:bg-yellow-600',
                                )
                            }
                            onClick={() => {}}
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
                            onClick={() => {}}
                        >
                            Delete
                        </Button>
                    </div>
                ),
            },
        ],
        [],
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
        </>
    )
}

export default TableSuratIzin
