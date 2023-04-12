import React, {CSSProperties} from 'react'
import {makeStyles, mergeClasses, tokens} from '@fluentui/react-components'
import {toAscii, toHex} from '@/utils'
import {DataRange} from '@/components/editor/types'
import {useSelectData} from '@/components/editor/hooks'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from "react-virtualized-auto-sizer"
import {FileBuffer} from '@/file'

interface Props {
  buffer: FileBuffer
  rows: number
  bytesPerRow: number
  selected: DataRange
  onSelect: (range: DataRange) => void
}

const useStyles = makeStyles({
  root: {
    userSelect: 'none',
    lineHeight: tokens.lineHeightBase200,
    height: '100%',
    width: '100%',
  },
  row: {
    display: 'flex',
    columnGap: tokens.spacingHorizontalXS,
  },
  item: {
    paddingTop: tokens.spacingHorizontalXS,
    paddingBottom: tokens.spacingHorizontalXS,
    paddingLeft: tokens.spacingHorizontalXS,
    paddingRight: tokens.spacingHorizontalXS,
  },
  byteSelected: {
    backgroundColor: tokens.colorNeutralForeground2BrandSelected,
  },
  address: {
    color: tokens.colorNeutralForeground3,
  },
  text: {
    paddingLeft: tokens.spacingHorizontalXXS,
    paddingRight: tokens.spacingHorizontalXXS,
  },
  textSelected: {
    backgroundColor: tokens.colorNeutralForeground2BrandSelected,
  },
})

const Data: React.FC<Props> = (props) => {


  const calculateAddress = (row: number, col: number) => row * props.bytesPerRow + col
  const styles = useStyles()
  const { isSelected, handleMouseDown, handleMouseMove, handleMouseUp } = useSelectData(props.bytesPerRow, props.selected, props.onSelect)

  const renderRow = ({index, style}: { index: number, style: CSSProperties }) => {


    return (
      <div
        className={styles.row}
        style={style}
      >

        <div>
          <span
            className={mergeClasses(styles.item, styles.address)}
          >
            {toHex(index * props.bytesPerRow, 8)}
          </span>
        </div>

        <div onMouseUp={handleMouseUp}>
          {[...Array(props.bytesPerRow)]
            .map((_, col) => ({ col, address: calculateAddress(index, col) }))
            .map(({ col, address }) => (
              <span
                className={mergeClasses(styles.item, isSelected(address) && styles.byteSelected)}
                key={col}
                onMouseDown={(e) => handleMouseDown(e, address)}
                onMouseMove={() => handleMouseMove(address)}
              >
                {toHex(props.buffer.read(address), 2)}
              </span>
            ))
          }
        </div>

        <div onMouseUp={handleMouseUp}>
          {[...Array(props.bytesPerRow)]
            .map((_, col) => ({ col, address: calculateAddress(index, col) }))
            .map(({ col, address }) => (
              <span
                key={col}
                className={mergeClasses(styles.item, styles.text, isSelected(address) && styles.textSelected)}
                onMouseDown={(e) => handleMouseDown(e, address)}
                onMouseMove={() => handleMouseMove(address)}
              >
                {toAscii(props.buffer.read(address))}
              </span>
            ))
          }
        </div>

      </div>
    )
  }

  return (
    <div className={styles.root}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            itemCount={props.rows}
            itemSize={22}
            width={width || 0}
            height={height || 0}
            overscanCount={30}
          >
            {renderRow}
          </List>
        )}
      </AutoSizer>
    </div>
  )
}

export default Data
