import fs from 'node:fs'

export interface FileBuffer {
  read(address: number): number
  close() : void
}

export const newBuffer = (path: string): FileBuffer => {
  return new FileBufferImpl(path)
}

const bufferSize = 1024 * 1024 // 缓存大小

class FileBufferImpl implements FileBuffer {

  fd: number
  prev?: Uint8Array
  current?: Uint8Array
  next?: Uint8Array
  position: number

  constructor(path: string) {
    this.fd = fs.openSync(path, 'r')
    this.position = 0
    this.current = this._readBuffer(0)
    this.next = this._readBuffer(bufferSize / 2)
  }

  close() {
    fs.closeSync(this.fd)
  }

  read (address: number): number {
    if (!(address >= this.position && address <= (this.position + bufferSize))) {
      this.readBuffer(address)
    }
    return this.current![address - this.position]
  }

  readBuffer (position: number) {
    let newPosition
    if (position < this.position) {
      this.next = this.current
      this.current = this.prev
      this.prev = this._readBuffer(this.position - bufferSize)
      newPosition = this.position - bufferSize / 2
    } else {
      this.prev = this.current
      this.current = this.next
      this.next = this._readBuffer(this.position + bufferSize)
      newPosition = this.position + bufferSize / 2
    }
    console.log(`Read ${newPosition < this.position ? "PREV" : "NEXT"} ${this.position}->${this.next}`)
    this.position = newPosition
  }

  _readBuffer (position: number): Uint8Array {
    const buffer = new Uint8Array(bufferSize)
    fs.readSync(this.fd, buffer, 0, bufferSize, position)
    return buffer
  }

}
