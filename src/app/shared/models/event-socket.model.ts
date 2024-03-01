export enum EventSocket {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    LOGGED = 'logged-user',
    LOGOUT = 'logout-user',
    FAILED_AUTH = 'failed-auth',
    GET_PEDIDOS_FINALIZADOS = 'pedidos-finalizados',
    SELECT_PEDIDO_FINALIZADO = 'select-pedido-finalizado',
    SEND_TO_VERIFICATION = 'send-to-verification',
    RESET_PEDIDOS = 'reset-pedidos',
}