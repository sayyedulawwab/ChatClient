import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRoomMessages } from '../../api/rooms';
import { useAuth } from '../../contexts/AuthContext';

const ChatRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { username, token } = useAuth(); // Retrieve username from context
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connect = new HubConnectionBuilder()
      .withUrl('http://localhost:5223/chat', {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in header
        },
      })
      .withAutomaticReconnect()
      .build();

    connect.on('ReceiveMessage', (senderName, content) => {
      setMessages((prev) => [...prev, { senderName, content }]);
    });

    connect.on('UserJoined', (admin, message) => {
      console.log(message);
    });

    connect.start().then(() => {
      if (username && roomId) {
        // Join the specific chat room after connection
        connect.invoke('JoinSpecificChatRoom', {
          username,
          roomId,
        });
      }
    });

    setConnection(connect);

    return () => {
      connect.stop();
    };
  }, [roomId, username, token]);

  useEffect(() => {
    if (roomId) {
      const loadMessages = async () => {
        const roomMessages = await getRoomMessages(roomId, 1, 50);
        setMessages(roomMessages.messages);
      };

      loadMessages();
    }
  }, [roomId]);

  const sendMessage = async () => {
    if (connection && roomId && message) {
      connection.invoke('SendMessage', roomId, username, message);
      setMessage('');
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, idx) => (
          <p key={idx}>
            <strong>{msg.senderName}: </strong>
            {msg.content}
          </p>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatRoom;
