import {makeStyles, mergeClasses, tokens} from '@fluentui/react-components'
import React from 'react'
import {DataRange} from '@/components/editor/types'
import {useSelectData} from '@/components/editor/hooks'

interface Props {
  rows: number
  bytesPerRow: number
  selected: DataRange
  onSelect: (range: DataRange) => void
}

const useStyles = makeStyles({
  root: {
    userSelect: 'none',
  },
  row: {
    display: 'flex',
  },
  item: {
    paddingLeft: tokens.spacingHorizontalXS,
    paddingRight: tokens.spacingHorizontalXS,
  },
  itemSelected: {
    backgroundColor: tokens.colorNeutralForeground2BrandSelected,
  },
})

const Text: React.FC<Props> = (props) => {

  const styles = useStyles()
  const { isSelected, handleMouseDown, handleMouseMove, handleMouseUp } = useSelectData(props.bytesPerRow, props.selected, props.onSelect)

  return (
    <div className={styles.root}>
      {[...Array(props.rows)].map((_, row) => (
        <div
          key={row}
          className={styles.row}
          onMouseUp={handleMouseUp}
        >
          {[...Array(props.bytesPerRow)].map((_, col) => (
            <span
              key={col}
              className={mergeClasses(styles.item, isSelected(row, col) && styles.itemSelected)}
              onMouseDown={(e) => handleMouseDown(e, row, col)}
              onMouseMove={() => handleMouseMove(row, col)}
            >
              {String.fromCharCode(0x28 + col)}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

export default Text
