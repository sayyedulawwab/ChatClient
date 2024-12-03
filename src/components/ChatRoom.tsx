import MessageContainer from "./MessageContainer"
import SendMessageForm from "./SendMessageForm"

const ChatRoom = ({ room, messages, sendMessage, typingIndicator, typing }) => {
  return (
    <>
        <h2>Chat Room: {room}</h2>
        
        <div>
            <MessageContainer messages={messages} />
        </div>
        {typingIndicator && <p>{typingIndicator}</p>}
        <div>
            <SendMessageForm sendMessage={sendMessage} onTyping={() => typing()} />
        </div>
    </>
  )
}

export default ChatRoom