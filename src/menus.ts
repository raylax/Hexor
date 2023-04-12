import {app} from '@electron/remote'

export const COMMON_MENUS
  = process.platform === 'darwin'
  ? [{
    label: app.name,
    submenu: [
      {role: 'about', label: "关于"},
      {type: 'separator'},
      {role: 'quit', label: "退出"},
    ],
  }]
  : []
