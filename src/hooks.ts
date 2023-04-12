import {MutableRefObject, useEffect} from 'react'

export const useOutsideClick = (ref: MutableRefObject<HTMLElement | null>, onClick: () => void) => {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      console.log(ref.current, event)
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClick()
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}
