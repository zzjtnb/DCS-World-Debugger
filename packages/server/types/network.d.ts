import type { AddressInfo } from 'net'
declare global {
   type NetworkOnError = (err: Error) => void
   type NetworkOnMessage = (payload: Message, rinfo: AddressInfo) => void
   type NetWorkOnListen = () => Promise<void>
   type NetworkSend = (payload: string) => Promise<void>
}
