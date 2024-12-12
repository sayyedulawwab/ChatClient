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
  const [typingTimeout, setTypingTimeout] = useState(null);
  const connectionRef = useRef<HubConnection | null>(null);

  // Establish the connection only once
  useEffect(() => {
    const connect = new HubConnectionBuilder()
      .withUrl('http://localhost:5223/chat', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connect;

    // Setup event listeners for receiving messages and typing notifications
    connect.on('ReceiveMessage', (senderName, content) => {
      setMessages((prev) => [...prev, { senderName, content }]);
      setTypingUser(null); // Clear typing notification when a message is received
    });

    connect.on('UserTyping', (typingUsername) => {
      if (typingUsername !== username) {
        setTypingUser(typingUsername);

        // Clear previous timeout
        if (typingTimeout) {
          clearTimeout(typingTimeout);
        }

        // Set new timeout to clear typing status after 3 seconds
        const timeout = setTimeout(() => {
          setTypingUser(null);
        }, 1000);

        setTypingTimeout(timeout);
      }
    });

    // Start the connection
    let isMounted = true;
    connect.start()
      .then(() => {
        if (isMounted && username && roomId) {
          connect.invoke('JoinSpecificChatRoom', { username, roomId });
          console.log('SignalR Connection established');
        }
      })
      .catch((error) => {
        console.error('Error starting SignalR connection:', error);
      });

    return () => {
      isMounted = false;
      if (connectionRef.current) {
        connectionRef.current.stop().then(() => {
          console.log('SignalR Connection stopped');
        });
      }
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [token, username, roomId]); // Dependencies for the initial connection

  // Load messages for the room when roomId changes
  useEffect(() => {
    const initRoom = async () => {
      if (roomId) {
        try {

          const conversation = await getConversation(roomId);

          console.log(conversation)

          // Check if the conversation exists
        if (!conversation || !conversation.id) {
          // If no conversation exists, create a new one
          await createConversation(roomId, []);
        }
  
          const roomMessages = await getRoomMessages(roomId, 1, 50); // Then load messages
          setMessages(roomMessages.messages);
        } catch (error) {
          console.error("Error during room initialization:", error);
        }
      }
    };
  
    initRoom();
  }, [roomId]); // Trigger message load when roomId changes

  const sendMessage = async () => {
    if (connectionRef.current && roomId && message && userId) {
      try {
        await connectionRef.current.invoke('SendMessage', roomId, userId, message);
        setMessage(''); // Reset message input after sending
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleTyping = () => {
    if (connectionRef.current && roomId && username) {
      connectionRef.current.invoke('Typing', roomId, username).catch((error) => {
        console.error('Error sending typing event:', error);
      });
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
