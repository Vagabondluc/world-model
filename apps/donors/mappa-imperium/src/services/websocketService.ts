export const websocketService = {
    connect: () => {
        console.log('Connecting to websocket...');
    },
    disconnect: () => {
        console.log('Disconnecting websocket...');
    },
    sendMessage: (msg: string) => {
        console.log('Sending message:', msg);
    }
};
