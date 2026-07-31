interface User {
  id: string;
  username: string;
  readonly role: 'admin' | 'user';
}

interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

class RealtimeChatManager {
  private socket: WebSocket | null = null;
  private currentUser: User;
  public messages: ChatMessage[] = [];

  constructor(user: User) {
    this.currentUser = user;
  }

  public connect(url: string): void {
    this.socket = new WebSocket(url);

    this.socket.onmessage = (event: MessageEvent) => {
      // Parse payload from incoming WS message
      const data: ChatMessage = JSON.parse(event.data);
      this.handleIncomingMessage(data);
    };
  }

  public sendMessage(text: string): void {
    // Error 1 & Error 2 are in this method
    const payload: ChatMessage = {
      id: crypto.randomUUID(),
      senderId: this.currentUser.id,
      text: text,
      // Bug: What's missing here according to the ChatMessage interface?
    };

    // Bug: What happens if `socket` is still null when calling this?
    this.socket.send(JSON.stringify(payload));
  }

  public promoteToAdmin(targetUser: User): void {
    // Error 3: Mutating property behavior
    targetUser.role = 'admin';
  }

  public async fetchRoomHistory(roomId: string): string[] {
    // Error 4: Async function return type vs actual return value mismatch
    const response = await fetch(`/api/rooms/${roomId}/history`);
    const data = await response.json();
    return data; 
  }

  private handleIncomingMessage(msg: ChatMessage): void {
    this.messages.push(msg);
  }
}