import { io, type Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;

  connect(authToken?: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.token = authToken || null;

    const socketConfig: any = {
      withCredentials: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    };

    // Only add auth token if provided
    if (authToken) {
      socketConfig.auth = { token: authToken };
    }

    this.socket = io(SOCKET_URL, socketConfig);

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.token = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  joinRoom(roomType: string, roomId: string): Promise<{ success: boolean; room?: string; error?: string }> {
    return new Promise((resolve) => {
      if (!this.socket?.connected) {
        resolve({ success: false, error: 'Socket not connected' });
        return;
      }

      this.socket.emit('join:room', { type: roomType, id: roomId }, (response: any) => {
        resolve(response);
      });
    });
  }

  leaveRoom(roomType: string, roomId: string): Promise<{ success: boolean; room?: string; error?: string }> {
    return new Promise((resolve) => {
      if (!this.socket?.connected) {
        resolve({ success: false, error: 'Socket not connected' });
        return;
      }

      this.socket.emit('leave:room', { type: roomType, id: roomId }, (response: any) => {
        resolve(response);
      });
    });
  }

  on(event: string, callback: (...args: any[]) => void): void {
    this.socket?.on(event, callback);
  }

  off(event: string, callback?: (...args: any[]) => void): void {
    if (callback) {
      this.socket?.off(event, callback);
    } else {
      this.socket?.off(event);
    }
  }

  emit(event: string, ...args: any[]): void {
    this.socket?.emit(event, ...args);
  }
}

export const socketService = new SocketService();
