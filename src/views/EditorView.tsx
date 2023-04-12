import {makeStyles, tokens} from '@fluentui/react-components'
import {app, dialog, Menu, webContents} from "@electron/remote"
import fs from "node:fs"
import prettyBytes from 'pretty-bytes'
import Header from '@/components/editor/Header'
import React, {useEffect, useMemo, useState} from 'react'
import Data from '@/components/editor/Data'
import {DataRange} from '@/components/editor/types'
import MenuItemConstructorOptions = Electron.MenuItemConstructorOptions
import {COMMON_MENUS} from '@/menus'
import {FileBuffer, newBuffer} from '@/file'

const useStyles = makeStyles({
  root: {
    fontFamily: `ui-monospace, Menlo, Monaco, "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", "Oxygen Mono", "Ubuntu Monospace", "Source Code Pro","Fira Mono", "Droid Sans Mono", Console, "Courier New", monospace;`,
    fontWeight: tokens.fontWeightMedium,
    color: tokens.colorNeutralForeground1,
    lineHeight: tokens.lineHeightBase400,
    paddingLeft: tokens.spacingHorizontalS,
    paddingRight: tokens.spacingHorizontalS,
    paddingTop: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalS,
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalXXS,
  },
  container: {
    display: 'flex',
    columnGap: tokens.spacingHorizontalMNudge,
    flexGrow: 1,
  },
})

const EditorView = () => {
  const styles = useStyles()

  const [buffer, setBuffer] = useState<FileBuffer>()
  const [bytesPerRow, setBytesPerRow] = useState(0x10)
  const [bytes, setBytes] = useState(12345)
  const rows = useMemo(() => Math.ceil(bytes / bytesPerRow), [bytesPerRow, bytes])


  const [selected, setSelected] = useState<DataRange>({ start: -1, end: -1 })

  const handleOpenFile = async () => {
    const { canceled, filePaths: [path] } = await dialog.showOpenDialog({ properties: ['openFile'] })
    if (canceled) return
    console.time(`Open [${path}]`)
    const stat = await fs.statSync(path)
    setBytes(stat.size)
    setBuffer(newBuffer(path))
    console.timeEnd(`Open [${path}]`)
    document.title = path
  }

  const handleCloseFile = () => {
    buffer && buffer.close()
  }

  const handleSelect = (range: DataRange) => {
    setSelected(range)
  }

  useEffect(() => {
    const menuTemplate = [
      ...COMMON_MENUS,
      {
        label: '文件',
        submenu: [
          { label: "打开文件", accelerator: 'CommandOrControl+N', click: handleOpenFile },
          { label: "关闭文件", accelerator: 'CommandOrControl+W', click: handleCloseFile },
        ]
      },
    ]
    // @ts-ignore
    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)
    return () => {
      handleCloseFile()
    }
  }, [])

  return (
    <div className={styles.root}>
      {buffer && (
        <>
          <Header bytesPerRow={bytesPerRow} />
          <div className={styles.container}>
            <Data buffer={buffer} rows={rows} bytesPerRow={bytesPerRow} selected={selected} onSelect={handleSelect} />
          </div>
        </>
      )}
    </div>
  )
}

export default EditorView
