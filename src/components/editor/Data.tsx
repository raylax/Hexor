import React, {memo} from 'react'
import {makeStyles, tokens} from '@fluentui/react-components'
import {toAscii, toHex} from '@/utils'
import {DataRange} from '@/components/editor/types'
import {useSelectData} from '@/components/editor/hooks'
import {FixedSizeList as List, ListChildComponentProps, areEqual} from 'react-window'
import AutoSizer from "react-virtualized-auto-sizer"
import {FileBuffer} from '@/file'
import clsx from 'clsx'
import memoize from "memoize-one"
import * as buffer from 'buffer'

interface Props {
  buffer: FileBuffer
  bytes: number
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

type DataRowProps = { props: Props, s: ReturnType<typeof useSelectData> }

const DataRow = memo(({index, style, data: { props, s }}: ListChildComponentProps<DataRowProps>) => {

  const calculateAddress = (row: number, col: number) => row * props.bytesPerRow + col

  const styles = useStyles()

  return (
    <div
      key={index}
      className={styles.row}
      style={style}
    >
      <div>
          <span
            className={`${styles.item} ${styles.address}`}
          >
            {toHex(index * props.bytesPerRow, 8)}
          </span>
      </div>

      <div onMouseUp={s.handleMouseUp}>
        {[...Array(props.bytesPerRow)]
          .map((_, col) => ({ col, address: calculateAddress(index, col) }))
          .map(({ col, address }) => (
            <span
              className={s.isSelected(address) ? clsx(styles.item, styles.byteSelected) : styles.item}
              key={col}
              onMouseDown={(e) => s.handleMouseDown(e, address)}
              onMouseMove={() => s.handleMouseMove(address)}
            >
                {toHex(props.buffer.read(address), 2)}
              </span>
          ))
        }
      </div>

      <div onMouseUp={s.handleMouseUp}>
        {[...Array(props.bytesPerRow)]
          .map((_, col) => ({ col, address: calculateAddress(index, col) }))
          .map(({ col, address }) => (
            <span
              key={col}
              className={s.isSelected(address) ? clsx(styles.item, styles.text, styles.textSelected) : `${styles.item} ${styles.text}`}
              onMouseDown={(e) => s.handleMouseDown(e, address)}
              onMouseMove={() => s.handleMouseMove(address)}
            >
                {toAscii(props.buffer.read(address))}
              </span>
          ))
        }
      </div>

    </div>
  )
}, areEqual)

const createData = memoize((props, s) => ({
  props: props,
  s: s,
}))

const Data: React.FC<Props> = (props) => {

  const styles = useStyles()
  const s = useSelectData(props.bytesPerRow, props.selected, props.onSelect)
  const itemData = createData(props, s)

  return (
    <div className={styles.root}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            itemCount={props.rows}
            itemSize={22}
            itemData={itemData}
            width={width || 0}
            height={height || 0}
            overscanCount={30}
          >
            {DataRow}
          </List>
        )}
      </AutoSizer>
    </div>
  )
}

export default Data
