import React, {useRef} from 'react'
import {useOutsideClick} from '@/hooks'


interface Props {
  onClick: () => void
  className?: string
}

const OutsideClickWrapper: React.FC<React.PropsWithChildren<Props>> = (props) => {

  const ref = useRef(null);
  useOutsideClick(ref, props.onClick)

  return (
    <div ref={ref} className={props.className}>
      {props.children}
    </div>
  )
}

export default OutsideClickWrapper
