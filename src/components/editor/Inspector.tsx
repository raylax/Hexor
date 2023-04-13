import {makeStyles, tokens} from '@fluentui/react-components'

const useStyles = makeStyles({
  root: {
    position: 'fixed',
    fontWeight: tokens.fontWeightBold,
    right: tokens.spacingHorizontalL,
  },
  title: {

  },
})

const Inspector = () => {

  const styles = useStyles()

  return (
    <div className={styles.root}>
      <div className={styles.title}>Data Inspector</div>
    </div>
  )
}


export default Inspector
