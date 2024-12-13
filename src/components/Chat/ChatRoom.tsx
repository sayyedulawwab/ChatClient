import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createConversation, getConversation, getRoomMessages } from '../../api/rooms';
import { useAuth } from '../../contexts/AuthContext';

const ChatRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { userId, token, username } = useAuth();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const connectionRef = useRef<HubConnection | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize SignalR connection
  useEffect(() => {
    const initializeConnection = async () => {
      if (connectionRef.current || !token || !username || !roomId) return;

      const connection = new HubConnectionBuilder()
        .withUrl('http://localhost:5223/chat', {
          accessTokenFactory: () => token,
        })
        .withAutomaticReconnect()
        .build();

      connectionRef.current = connection;

      try {
        await connection.start();
        console.log('SignalR connection established');

        // Join the specific chat room
        await connection.invoke('JoinSpecificChatRoom', { username, roomId });

        // Handle incoming messages
        connection.on('ReceiveMessage', (senderName, content) => {
          setMessages((prev) => [...prev, { senderName, content }]);
          setTypingUser(null);
        });

        // Handle typing notifications
        connection.on('UserTyping', (typingUsername) => {
          if (typingUsername !== username) {
            setTypingUser(typingUsername);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

            typingTimeoutRef.current = setTimeout(() => {
              setTypingUser(null);
            }, 1000);
          }
        });

      } catch (error) {
        console.error('Error starting SignalR connection:', error);
      }
    };

    initializeConnection();

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop().then(() => {
          console.log('SignalR connection stopped');
        });
      }

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [token, username, roomId]);

  // Initialize room data
  useEffect(() => {
    const initializeRoom = async () => {
      if (!roomId) return;

      try {
        const conversation = await getConversation(roomId);
        if (!conversation || !conversation.id) {
          await createConversation(roomId, []);
        }

        const roomMessages = await getRoomMessages(roomId, 1, 50);
        setMessages(roomMessages.messages);
      } catch (error) {
        console.error('Error initializing room:', error);
      }
    };

    initializeRoom();
  }, [roomId]);

  // Send a message
  const sendMessage = async () => {
    if (!connectionRef.current || !roomId || !message.trim() || !userId) return;

    try {
      await connectionRef.current.invoke('SendMessage', roomId, userId, message);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Notify typing
  const handleTyping = () => {
    if (!connectionRef.current || !roomId || !username) return;

    connectionRef.current.invoke('Typing', roomId, username).catch((error) => {
      console.error('Error sending typing event:', error);
    });
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
        {typingUser && <p><em>{typingUser} is typing...</em></p>}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyUp={handleTyping}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatRoom;