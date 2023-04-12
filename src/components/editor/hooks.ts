import {DataRange} from '@/components/editor/types'
import React, {useCallback, useState} from 'react'


const MOUSE_BUTTON_LEFT = 0


export const useSelectData = (bytesPerRow: number, selected: DataRange, onSelect: (range: DataRange) => void) => {


  const [selectMode, setSelectMode] = useState(false)

  const isSelected = useCallback(
    (address: number) => {
      return (address >= selected.start && address <= selected.end) || (address >= selected.end && address <= selected.start)
    },
    [selected]
  )

  const handleMouseDown = (e: React.MouseEvent<HTMLElement>, address: number) => {
    if (e.button !== MOUSE_BUTTON_LEFT) return
    onSelect({
      start: address,
      end: address,
    })
    setSelectMode(true)
  }

  const handleMouseMove = (address: number) => {
    if (!selectMode) return
    onSelect({ ...selected, end: address })
  }

  const handleMouseUp = (e: React.MouseEvent<HTMLElement>) => {
    if (e.button !== MOUSE_BUTTON_LEFT) return
    setSelectMode(false)
  }

  return {
    isSelected,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
  }
}
