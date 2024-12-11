import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRoomMessages } from '../../api/rooms';
import { useAuth } from '../../contexts/AuthContext';

const ChatRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { userId, token, username } = useAuth(); // Retrieve username from context
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

    // Handle incoming messages
    connect.on('ReceiveMessage', (senderName, content) => {
      setMessages((prev) => [...prev, { senderName, content }]);
    });

    // Handle user joining the room
    connect.on('UserJoined', (admin, message) => {
      console.log(message);
    });

    let isConnected = false;

    // Start the connection and handle success or failure
    connect.start()
      .then(() => {
        isConnected = true;
        console.log('SignalR Connection established');
        if (username && roomId) {
          connect.invoke('JoinSpecificChatRoom', { username, roomId });
        }
      })
      .catch((error) => {
        console.error('Error starting SignalR connection:', error);
      });

    // Set the connection state
    setConnection(connect);

    // Cleanup: stop the connection when the component is unmounted
    return () => {
      if (isConnected) {
        connect.stop().then(() => console.log('SignalR Connection stopped'));
      }
    };
  }, [roomId, username, token]);

  // Load room messages when roomId changes
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
    console.log('sendMessage');
    console.log(connection);
    console.log(roomId);
    console.log(message);
    console.log(userId);

    if (connection && roomId && message && userId) {
      console.log('sendMessage in condition');
      try {
        await connection.invoke('SendMessage', roomId, userId, message); // Use userId here
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
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
