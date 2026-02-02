import { useEffect, useRef } from 'react'
import { connectRealtimeWS } from '../api/realtime.ws'

export const useWebSocket = (onMessage: (data: any) => void) => {
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    wsRef.current = connectRealtimeWS(onMessage)

    return () => {
      wsRef.current?.close()
    }
  }, [onMessage])
}
