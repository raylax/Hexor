import {makeStyles, tokens} from '@fluentui/react-components'
import React from 'react'
import {toHex} from '@/utils'

interface Props {
  bytesPerRow: number
}

const useStyles = makeStyles({
  root: {
    fontWeight: tokens.fontWeightSemibold,
    display: 'flex',
    columnGap: tokens.spacingHorizontalMNudge,
  },
  index: {
    display: 'flex',
  },
  indexItem: {
    paddingLeft: tokens.spacingHorizontalXS,
    paddingRight: tokens.spacingHorizontalXS,
  }
})

const Header: React.FC<Props> = (props) => {

  const styles = useStyles()

  return (
    <div className={styles.root}>
      <div>00000000</div>
      <div className={styles.index}>
        {[...Array(props.bytesPerRow)].map((_, i) => (
          <span className={styles.indexItem} key={i}>{toHex(i, 2)}</span>
        ))}
      </div>
      <div>Text</div>
    </div>
  )
}

export default Header
