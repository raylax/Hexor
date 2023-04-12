import {Button, makeStyles} from '@fluentui/react-components'
import EditorView from '@/views/EditorView'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  }
})

function App() {
  const styles = useStyles()
  return (
    <div className={styles.root}>
      <EditorView />
    </div>
  )
}

export default App
