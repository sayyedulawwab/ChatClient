import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useState } from 'react';
import './App.css';
import ChatRoom from './components/ChatRoom';
import WaitingRoom from './components/WaitingRoom';

function App() {

  const [connection, setConnection] = useState();
  const [messages, setMessages] = useState([]);

  const joinChatRoom = async (username, chatroom) => {
    try {
      const connection = new HubConnectionBuilder()
                              .withUrl("http://localhost:5230/chat")
                              .configureLogging(LogLevel.Information)
                              .build();

      connection.on("JoinSpecificChatRoom", (username, message) => {
        console.log("message: ", message)
      })

      connection.on("ReceiveSpecificMessage", (username, message) => {
        console.log("ReceiveSpecificMessage")
        setMessages(messages => [...messages, {username, message}]);
      })
      

      await connection.start();

      await connection.invoke("JoinSpecificChatRoom", {username, chatroom})

      setConnection(connection);

    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
     <main>
      <h1>Welcome to Chat the app</h1>
      { !connection ? <WaitingRoom joinChatRoom={joinChatRoom}/> : <ChatRoom messages={messages}></ChatRoom>}
     </main>
    </>
  )
}

export default App
