'use client'

import '@smastrom/react-rating/style.css'

import { Rating } from '@smastrom/react-rating'
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table'
import {
  ArrowUpDown,
  ChevronDown,
  Copy,
  Edit,
  MoreHorizontal,
  Search,
  Share,
  Trash2,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Photo } from '@/server/db/schema/photos'
import { usePhotoStore } from '@/stores/photo'
import { api } from '@/trpc/react'

const SkeletonRow = () => (
  <TableRow>
    <TableCell>
      <Skeleton className='h-4 w-4' />
    </TableCell>
    <TableCell>
      <Skeleton className='h-4 w-32' />
    </TableCell>
    <TableCell>
      <Skeleton className='h-4 w-20' />
    </TableCell>
    <TableCell>
      <Skeleton className='h-4 w-24' />
    </TableCell>
    <TableCell>
      <Skeleton className='h-4 w-20' />
    </TableCell>
    <TableCell>
      <Skeleton className='h-4 w-24' />
    </TableCell>
    <TableCell>
      <Skeleton className='h-4 w-16' />
    </TableCell>
    <TableCell>
      <Skeleton className='h-4 w-20' />
    </TableCell>
    <TableCell>
      <Skeleton className='h-4 w-4' />
    </TableCell>
  </TableRow>
)

export const createColumns = (
  resolvedTheme: string | undefined,
  handleRowClick: (photo: Photo) => void,
  handleDeletePhoto: (photo: Photo) => void,
): ColumnDef<Photo>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        onClick={(e) => e.stopPropagation()}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        onClick={(e) => e.stopPropagation()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 50,
    minSize: 50,
    maxSize: 50,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <button
          type='button'
          className='flex cursor-pointer items-center'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              column.toggleSorting(column.getIsSorted() === 'asc')
            }
          }}
          tabIndex={0}
        >
          <span className='mr-1'>Title</span>
          <ArrowUpDown size={14} />
        </button>
      )
    },
    cell: ({ row }) => (
      <div className='truncate font-medium'>{row.getValue('title')}</div>
    ),
    size: 200,
    minSize: 150,
    maxSize: 300,
  },
  {
    accessorKey: 'make',
    header: ({ column }) => {
      return (
        <button
          type='button'
          className='flex cursor-pointer items-center'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              column.toggleSorting(column.getIsSorted() === 'asc')
            }
          }}
          tabIndex={0}
        >
          <span className='mr-1'>Make</span>
          <ArrowUpDown size={14} />
        </button>
      )
    },
    cell: ({ row }) => {
      const make = row.getValue('make') as string
      return <div className='truncate font-medium'>{make || '-'}</div>
    },
    size: 120,
    minSize: 100,
    maxSize: 150,
  },
  {
    accessorKey: 'model',
    header: ({ column }) => {
      return (
        <button
          type='button'
          className='flex cursor-pointer items-center'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              column.toggleSorting(column.getIsSorted() === 'asc')
            }
          }}
          tabIndex={0}
        >
          <span className='mr-1'>Model</span>
          <ArrowUpDown size={14} />
        </button>
      )
    },
    cell: ({ row }) => {
      const model = row.getValue('model') as string
      return <div className='truncate font-medium'>{model || '-'}</div>
    },
    size: 120,
    minSize: 100,
    maxSize: 150,
  },
  {
    accessorKey: 'country',
    header: ({ column }) => {
      return (
        <button
          type='button'
          className='flex cursor-pointer items-center'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              column.toggleSorting(column.getIsSorted() === 'asc')
            }
          }}
          tabIndex={0}
        >
          <span className='mr-1'>Country</span>
          <ArrowUpDown size={14} />
        </button>
      )
    },
    cell: ({ row }) => {
      const country = row.getValue('country') as string
      return <div className='truncate font-medium'>{country || '-'}</div>
    },
    size: 100,
    minSize: 80,
    maxSize: 120,
  },
  {
    accessorKey: 'city',
    header: ({ column }) => {
      return (
        <button
          type='button'
          className='flex cursor-pointer items-center'
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              column.toggleSorting(column.getIsSorted() === 'asc')
            }
          }}
          tabIndex={0}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <span className='mr-1'>City</span>
          <ArrowUpDown size={14} />
        </button>
      )
    },
    cell: ({ row }) => {
      const city = row.getValue('city') as string
      return <div className='truncate font-medium'>{city || '-'}</div>
    },
    size: 100,
    minSize: 80,
    maxSize: 120,
  },
  {
    accessorKey: 'rating',
    header: ({ column }) => {
      return (
        <button
          type='button'
          className='flex cursor-pointer items-center'
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              column.toggleSorting(column.getIsSorted() === 'asc')
            }
          }}
          tabIndex={0}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <span className='mr-1'>Rating</span>
          <ArrowUpDown size={14} />
        </button>
      )
    },
    cell: ({ row }) => {
      const rating = row.getValue('rating') as number
      return (
        <div className='flex items-center'>
          <Rating
            style={{ maxWidth: 100, width: '100%', minWidth: 80 }}
            value={rating}
            readOnly
            items={5}
            spaceBetween='small'
            className='flex-shrink-0'
            itemStyles={{
              itemShapes: (
                <path d='M62.799,23.737c-0.47-1.399-1.681-2.419-3.139-2.642l-16.969-2.593L35.069,2.265 C34.419,0.881,33.03,0,31.504,0c-1.527,0-2.915,0.881-3.565,2.265l-7.623,16.238L3.347,21.096c-1.458,0.223-2.669,1.242-3.138,2.642 c-0.469,1.4-0.115,2.942,0.916,4l12.392,12.707l-2.935,17.977c-0.242,1.488,0.389,2.984,1.62,3.854 c1.23,0.87,2.854,0.958,4.177,0.228l15.126-8.365l15.126,8.365c0.597,0.33,1.254,0.492,1.908,0.492c0.796,0,1.592-0.242,2.269-0.72 c1.231-0.869,1.861-2.365,1.619-3.854l-2.935-17.977l12.393-12.707C62.914,26.68,63.268,25.138,62.799,23.737z'></path>
              ),
              activeFillColor: resolvedTheme === 'dark' ? '#ffd700' : '#ff9500',
              inactiveFillColor:
                resolvedTheme === 'dark' ? '#3f3f46' : '#d4d4d8',
            }}
          />
        </div>
      )
    },
    size: 120,
    minSize: 100,
    maxSize: 140,
  },
  {
    accessorKey: 'visibility',
    header: ({ column }) => {
      return (
        <button
          type='button'
          className='flex cursor-pointer items-center'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              column.toggleSorting(column.getIsSorted() === 'asc')
            }
          }}
          tabIndex={0}
        >
          <span className='mr-1'>Visibility</span>
          <ArrowUpDown size={14} />
        </button>
      )
    },
    cell: ({ row }) => {
      const visibility = row.getValue('visibility') as string
      return (
        <div className='flex items-center gap-1'>
          {visibility === 'public' ? <span>Public</span> : <span>Private</span>}
        </div>
      )
    },
    size: 100,
    minSize: 80,
    maxSize: 120,
  },
  {
    accessorKey: 'captureAt',
    header: ({ column }) => {
      return (
        <button
          type='button'
          className='flex cursor-pointer items-center'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              column.toggleSorting(column.getIsSorted() === 'asc')
            }
          }}
          tabIndex={0}
        >
          <span className='mr-1'>Capture Time</span>
          <ArrowUpDown size={14} />
        </button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue('dateTimeOriginal') as Date
      return (
        <div className='text-sm'>
          {date
            ? new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              }).format(new Date(date))
            : '-'}
        </div>
      )
    },
    size: 140,
    minSize: 120,
    maxSize: 160,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <button
          type='button'
          className='flex cursor-pointer items-center'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              column.toggleSorting(column.getIsSorted() === 'asc')
            }
          }}
          tabIndex={0}
        >
          <span className='mr-1'>Created At</span>
          <ArrowUpDown size={14} />
        </button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as Date
      return (
        <div className='text-sm'>
          {new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }).format(new Date(date))}
        </div>
      )
    },
    size: 140,
    minSize: 120,
    maxSize: 160,
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => {
      return (
        <button
          type='button'
          className='flex cursor-pointer items-center'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              column.toggleSorting(column.getIsSorted() === 'asc')
            }
          }}
          tabIndex={0}
        >
          <span className='mr-1'>Updated At</span>
          <ArrowUpDown size={14} />
        </button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue('updatedAt') as Date
      return (
        <div className='text-sm'>
          {new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }).format(new Date(date))}
        </div>
      )
    },
    size: 140,
    minSize: 120,
    maxSize: 160,
  },
  {
    id: 'actions',
    header: 'Actions',
    enableHiding: false,
    cell: ({ row }) => {
      const photo = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='h-8 w-8 cursor-pointer p-0'
              onClick={(e) => e.stopPropagation()}
            >
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                handleRowClick(photo)
              }}
              variant='default'
              className='cursor-pointer'
            >
              <Edit className='mr-2 h-4 w-4' />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                handleDeletePhoto(photo)
              }}
              variant='destructive'
              className='cursor-pointer'
            >
              <Trash2 className='mr-2 h-4 w-4' />
              <span className='text-destructive'>Delete</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className='cursor-pointer'
              onClick={(e) => {
                e.stopPropagation()
                navigator.clipboard.writeText(photo.id)
                toast.success('Photo ID copied to clipboard')
              }}
            >
              <Copy className='mr-2 h-4 w-4' />
              <span>Copy ID</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className='cursor-pointer'
              onClick={(e) => {
                e.stopPropagation()
                toast.info('todo: share photo')
              }}
            >
              <Share className='mr-2 h-4 w-4' />
              <span>Share Photo</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    size: 80,
    minSize: 80,
    maxSize: 80,
  },
]

export const DataTable = () => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    description: false,
    fullAddress: false,
    city: true,
    country: true,
    rating: false,
    captureAt: false,
    captureTime: false,
    updatedAt: false,
  })
  const [rowSelection, setRowSelection] = useState({})
  const { resolvedTheme } = useTheme()
  const { setPhotoInfo, setDialogOpen, setTriggerType } = usePhotoStore()

  const {
    data: photosData,
    isLoading,
    error,
  } = api.photo.getPhotosList.useQuery()

  const { mutateAsync: deletePhoto } = api.photo.deletePhoto.useMutation()
  const utils = api.useUtils()

  const handleDeletePhoto = async (photo: Photo) => {
    try {
      toast.loading('Deleting photo...', { id: 'delete-photo' })
      await deletePhoto({ id: photo.id })
      toast.success('Photo deleted successfully!', { id: 'delete-photo' })
      // invalidate photos list
      await utils.photo.getPhotosList.invalidate()
    } catch (error) {
      console.error('Failed to delete photo:', error)
      toast.error('Failed to delete photo, please try again', {
        id: 'delete-photo',
      })
    }
  }

  const handleRowClick = (photo: Photo) => {
    const photoInfo = {
      id: photo.id,
      url: photo.url,
      fileName: photo.id,
      fileSize: photo.fileSize || undefined,
      blurDataUrl: photo.blurDataUrl,
      compressedUrl: photo.compressedUrl || undefined,
      compressedSize: photo.compressedSize || undefined,
      title: photo.title,
      description: photo.description,
      rating: photo.rating,
      isFavorite: photo.isFavorite,
      visibility: photo.visibility,
      width: photo.width,
      height: photo.height,
      aspectRatio: photo.aspectRatio,
      make: photo.make || undefined,
      model: photo.model || undefined,
      lensModel: photo.lensModel || undefined,
      focalLength: photo.focalLength || undefined,
      focalLength35mm: photo.focalLength35mm || undefined,
      fNumber: photo.fNumber || undefined,
      iso: photo.iso || undefined,
      exposureTime: photo.exposureTime || undefined,
      exposureCompensation: photo.exposureCompensation || undefined,
      latitude: photo.latitude || undefined,
      longitude: photo.longitude || undefined,
      gpsAltitude: photo.gpsAltitude || undefined,
      dateTimeOriginal: photo.dateTimeOriginal || undefined,
      country: photo.country || undefined,
      countryCode: photo.countryCode || undefined,
      region: photo.region || undefined,
      city: photo.city || undefined,
      district: photo.district || undefined,
      fullAddress: photo.fullAddress || undefined,
      placeFormatted: photo.placeFormatted || undefined,
    }

    setPhotoInfo(photoInfo)
    setTriggerType('edit-photo-info')
    setDialogOpen(true)
  }

  const columns = createColumns(
    resolvedTheme,
    handleRowClick,
    handleDeletePhoto,
  )

  const table = useReactTable({
    data: photosData?.data ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  if (error) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-destructive'>
          Error loading photos: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className='flex items-center py-4'>
        <div className='relative max-w-sm'>
          <Search className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search photos...'
            value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('title')?.setFilterValue(event.target.value)
            }
            className='pl-10'
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='outline'
              className='ml-auto'
            >
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map(() => (
                <SkeletonRow key={crypto.randomUUID()} />
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='cursor-pointer hover:bg-muted/50'
                  onClick={() => handleRowClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No photos found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <div className='flex-1 text-muted-foreground text-sm'>
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
