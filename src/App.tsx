import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useEffect, useState } from 'react';
import './App.css';
import ChatRoom from './components/ChatRoom';
import WaitingRoom from './components/WaitingRoom';

function App() {

  const [connection, setConnection] = useState();
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState('6756e7f5c91b4f3d6f5865ca');
  const [room, setRoom] = useState('');
  const [typingIndicator, setTypingIndicator] = useState('');

  const [username, setUsername] = useState('');

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    const savedRoom = localStorage.getItem("room");

    if (savedUsername && savedRoom) {
      const fetchChatHistory = async () => {
        try {
          const response = await fetch(`https://localhost:7000/api/conversations/${savedRoom}?page=1&pageSize=10`);
          if (!response.ok) {
            throw new Error(`Failed to fetch chat history: ${response.statusText}`);
          }
          const conversation = await response.json();

          const processedMessages = conversation.messages.map(message => ({
            username: message.senderName,
            message: message.content,
            timestamp: new Date(message.Timestamp), // Format if needed
          }));

          setMessages(() => [...processedMessages]);
        } catch (error) {
          console.error(error);
          localStorage.clear();
        }
      };

      fetchChatHistory().then(() => {
        const newConnection = new HubConnectionBuilder()
          .withUrl("http://localhost:5223/chat")
          .configureLogging(LogLevel.Information)
          .build();

        newConnection.on("UserReconnected", (username, message) => {
          setMessages((messages) => [...messages, { username, message }]);
        });

        newConnection.on("ReceiveMessage", (username, message) => {
          setMessages((messages) => [...messages, { username, message }]);
        });

        newConnection
          .start()
          .then(() => {
            newConnection.invoke("Reconnect", newConnection.connectionId);
            setRoom(savedRoom);
          })
          .catch((e) => {
            console.error("Reconnection failed", e);
            localStorage.clear();
          });

        setConnection(newConnection);
      });
    }
  }, []);

  const joinChatRoom = async (username, roomId) => {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl("http://localhost:5223/chat")
        .configureLogging(LogLevel.Information)
        .build();

      setRoom(roomId);
      setUsername(username);

      localStorage.setItem("username", username);
      localStorage.setItem("room", roomId);

      connection.on("UserJoined", (username, message) => {
        setMessages(messages => [...messages, { username, message }]);
      });

      connection.on("ReceiveMessage", (username, message) => {
        setMessages(messages => [...messages, { username, message }]);
      });

      connection.on("UserTyping", (typingUsername) => {
        if (typingUsername !== username) {
          setTypingIndicator(`${typingUsername} is typing...`);
          setTimeout(() => setTypingIndicator(''), 3000);
        } else {
          setTypingIndicator('');
        }
      });

      await connection.start();

      await connection.invoke("JoinSpecificChatRoom", { username, roomId });

      setConnection(connection);

    } catch (e) {
      console.error(e);
    }
  };

  const sendMessage = async (conversationId, senderId, content) => { 
    try {
      await connection.invoke("SendMessage", conversationId, senderId, content);
    } catch (e) {
      console.error(e);
    }
  };

  const typing = async () => {
    if (connection) {
      try {
        await connection.invoke("Typing", room, username);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <>
      <main>
        <h1>Welcome to Chat the app</h1>
        { !connection 
          ? <WaitingRoom joinChatRoom={joinChatRoom} /> 
          : <ChatRoom 
              conversationId={conversationId} 
              room={room} 
              messages={messages} 
              sendMessage={sendMessage} 
              typingIndicator={typingIndicator} 
              typing={typing} 
            />
        }
      </main>
    </>
  );
}

export default App;