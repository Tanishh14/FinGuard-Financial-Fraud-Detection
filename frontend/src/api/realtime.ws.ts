export const connectRealtimeWS = (onMsg: (d: any) => void) => {
  const ws = new WebSocket('ws://localhost:8000/ws/transactions')
  ws.onmessage = (e) => onMsg(JSON.parse(e.data))
  return ws
}
