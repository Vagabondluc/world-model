import { websocketService } from './websocketService';

describe('websocketService', () => {
    it('connect logs message', () => {
        const spy = vi.spyOn(console, 'log');
        websocketService.connect();
        expect(spy).toHaveBeenCalledWith('Connecting to websocket...');
        spy.mockRestore(); // Restore immediately
    });

    it('disconnect logs message', () => {
        const spy = vi.spyOn(console, 'log');
        websocketService.disconnect();
        expect(spy).toHaveBeenCalledWith('Disconnecting websocket...');
        spy.mockRestore();
    });

    it('sendMessage logs message', () => {
        const spy = vi.spyOn(console, 'log');
        websocketService.sendMessage('hello');
        expect(spy).toHaveBeenCalledWith('Sending message:', 'hello');
        spy.mockRestore();
    });
});
