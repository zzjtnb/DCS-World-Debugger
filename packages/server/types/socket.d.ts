/**
 * Socket 连接的基本选项，适用于服务器和客户端。
 */
export interface OptionsBase {
  /**
   * Socket 服务器的主机地址。
   * 对于服务器来说是可选的，对于客户端来说是必需的。
   */
  host?: string

  /**
   * Socket 连接的端口号。
   * 这是一个必填字段。
   */
  port: number

  /**
   * 是否启用日志记录的标志。
   * 可选字段，如果未提供，默认为 false。
   */
  isLog?: boolean
}

/**
 * 特定于 Socket 服务器的选项。
 * 继承自 OptionsBase。
 */
export interface ServerOptions extends OptionsBase {

}

/**
 * 特定于 Socket 客户端的选项。
 * 继承自 OptionsBase，并要求提供 host 字段。
 */
export interface ClientOptions extends Omit<OptionsBase, 'host'> {
  /**
   * Socket 服务器的主机地址。
   * 对于客户端来说是必需的字段。
   */
  host: string
}
/**
 * 表示数据打包选项的接口。
 *
 * @interface
 */
export interface PackageOptions {
  /**
   * 包头的长度（以字节为单位）。
   * @type {number}
   */
  headerLen: number

  /**
   * 初始包序列号。
   * @type {number}
   */
  serialNum: number

  /**
   * 包序列号所占用的字节长度。
   * @type {number}
   */
  serialLen: number
}

export interface DecodeData {
  serialNumber: number
  bodyLen: number
  body: string
}
