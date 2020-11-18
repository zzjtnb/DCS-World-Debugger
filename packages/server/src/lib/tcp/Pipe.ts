import type { DecodeData, PackageOptions } from 'types/socket'

class Pipe {
  packageHeaderLen: number // 包头长度
  serialNumber: number// 初始包序列号
  packageSerialNumberLen: number // 包序列号所占用的字节长度
  constructor(options?: Partial<PackageOptions>) {
    this.packageHeaderLen = 8
    this.packageSerialNumberLen = 4
    this.serialNumber = 0
  }

  /**
   * 编码
   * @param {string} data Buffer 对象数据
   * @param { number } serialNumber  包序号,客户端编码时自动生成,服务端解码之后在编码时需要传入解码的包序列号
   * @returns {Buffer} 编码后的数据
   */
  encode(data: string, serialNumber?: number): Buffer {
    data = data.replace(/--.*|\n/g, '')

    const bodyBuffer = Buffer.from(data)
    // 1.先按照指定的长度来申请一片内存空间作为 header 来使用
    const headerBuffer = Buffer.alloc(this.packageHeaderLen)
    // 先把包序列号写入 header 中
    headerBuffer.writeInt32BE(serialNumber || this.serialNumber)
    // 接着把 body 的长度写入 header 中,要跳过上面设置的序列号所占的字节
    headerBuffer.writeInt32BE(bodyBuffer.length, this.packageSerialNumberLen)
    // 如果没有传入序列号,则递增当前包序列号
    if (serialNumber === undefined)
      this.serialNumber++
    return Buffer.concat([headerBuffer, bodyBuffer])
  }

  /**
   * 解码数据包
   * @param {Buffer} buffer 包含编码数据包的 Buffer 对象
   * @returns  解码后的数据
   */
  decode(buffer: Buffer): DecodeData {
    const decodeData: DecodeData = {
      serialNumber: 0,
      bodyLen: 0,
      body: '',
    }
    if (buffer.length >= this.packageHeaderLen) {
      // 获取消息头的二进制数据
      const headerBuffer = buffer.subarray (0, this.packageHeaderLen)
      // 获取消息体的二进制数据
      const bodyBuffer = buffer.subarray(this.packageHeaderLen)
      // 读取包序列号
      decodeData.serialNumber = headerBuffer.readInt32BE()
      // 读取消息体长度,需要跳过上面设置的序列号
      decodeData.bodyLen = headerBuffer.readInt32BE(this.packageSerialNumberLen)
      // 读取消息体内容
      const regex = /quit\r\n$/
      decodeData.body = bodyBuffer.toString().replace(regex, '')
    }
    else {
      // console.log(`Buffer 太短,无法解码.bufferLength:${buffer.length}, packageHeaderLen:${this.packageHeaderLen}`)
    }
    return decodeData
  }

  /**
   * 获取数据包总长度
   * @param {Buffer} buffer 包含部分或完整数据包的 Buffer 对象
   * @returns {number} 包的总长度(字节数),如果数据不完整返回 0
   */
  getPackageLength(buffer: Buffer): number {
    // 如果当前 buffer 长度小于包头长度, 返回 0
    if (buffer.length < this.packageHeaderLen)
      return 0
    // 获取消息体长度
    const bodyLength = buffer.readInt32BE(this.packageSerialNumberLen)
    const totalLength = this.packageHeaderLen + bodyLength
    // 检查缓冲区末尾是否有 '\r\n'
    const newlineBuffer = Buffer.from('quit\r\n')
    const endBuffer = buffer.subarray(totalLength, totalLength + newlineBuffer.length)
    // 如果存在 '\r\n',加上其长度
    if (endBuffer.equals(newlineBuffer)) {
      return totalLength + newlineBuffer.length
    }
    return totalLength
  }
}

export default Pipe

// import Pipe from './Pipe'
// const pipe = new Pipe()
// // 用于缓存接收到的数据中第一个包的字节长度
// this.packageLength = this.pipe.getPackageLength(chunk)
// // console.log(this.packageLength, buffer.length)
// const endLength = Buffer.from('quit\r\n').length
// // 截取接收到的数据的第一个数据包的数据
// const packageContent = chunk.subarray(0, this.packageLength)
// // 截取除第一个数据包剩余的数据,用于下一轮循环或下一次data事件处理
// // 删除已经取出的数据包,这里采用的方法是把缓冲区(buffer)已取出的包给截取掉
// chunk = chunk.subarray(this.packageLength)
// // 解码当前数据中第一个数据包
// const result = this.pipe.decode(packageContent)
// this.log('客户端解码数据:', result)
// const encode = this.pipe.encode(data, 33)
// const encodeLength = this.pipe.getPackageLength(encode)
// const decode: { body?: any } = this.pipe.decode(encode)
// delete decode.body
// this.log('原始数据长度:', data.length, '解码数据:', decode, '编码长度:', encodeLength)
