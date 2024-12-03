import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useState } from 'react';
import './App.css';
import ChatRoom from './components/ChatRoom';
import WaitingRoom from './components/WaitingRoom';

function App() {

  const [connection, setConnection] = useState();
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState();
  const [typingIndicator, setTypingIndicator] = useState('');

  const [username, setUsername] = useState();

  const joinChatRoom = async (username, chatroom) => {
    try {
      const connection = new HubConnectionBuilder()
                              .withUrl("http://localhost:5230/chat")
                              .configureLogging(LogLevel.Information)
                              .build();
      
      
      console.log(chatroom)
                              
      setRoom(chatroom)
      setUsername(username)

      connection.on("JoinSpecificChatRoom", (username, message) => {
        console.log("message: ", message)
        
        setMessages(messages => [...messages, {username, message}]);
      })

      connection.on("ReceiveSpecificMessage", (username, message) => {
        console.log("ReceiveSpecificMessage")
        setMessages(messages => [...messages, {username, message}]);
      })

      connection.on("UserTyping", (typingUsername) => {

        if (typingUsername !== username) {
          console.log(`${typingUsername} is typing...`);
          setTypingIndicator(`${typingUsername} is typing...`);
      
          // Clear the typing indicator after a delay
          setTimeout(() => setTypingIndicator(''), 3000);
        }
        else{
          setTypingIndicator('')
        }
      });
    
      

      await connection.start();

      await connection.invoke("JoinSpecificChatRoom", {username, chatroom})

      setConnection(connection);

    } catch (e) {
      console.log(e);
    }
  }
  
  const sendMessage = async (message) => { 
    try {
      await connection.invoke("SendMessage", message);
    } catch (e) {
      console.log(e)
    }
   }

   const typing = async () => {
      if (connection) {
          try {
              await connection.invoke("Typing", room, username); // Replace "YourUsername" with the actual username
          } catch (e) {
              console.log(e);
          }
      }
  };

  return (
    <>
     <main>
      <h1>Welcome to Chat the app</h1>
      { !connection ? <WaitingRoom joinChatRoom={joinChatRoom}/> : <ChatRoom room={room} messages={messages} sendMessage={sendMessage} typingIndicator={typingIndicator}  typing={typing}/>}
     </main>
    </>
  )
}

export default App
