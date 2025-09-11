'use client'

import { Button } from '@/components/ui/button'
import { useBearStore } from '@/stores/bear'

export function Bear() {
  const { bears, increase, decrease } = useBearStore()

  return (
    <>
      {bears}
      <div className='flex gap-10'>
        <Button
          className='cursor-pointer'
          onClick={() => increase(1)}
        >
          Add A Bear
        </Button>
        <Button
          className='cursor-pointer'
          onClick={() => decrease(1)}
        >
          Remove A Bear
        </Button>
      </div>
    </>
  )
}
