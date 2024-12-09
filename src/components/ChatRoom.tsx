import MessageContainer from "./MessageContainer"
import SendMessageForm from "./SendMessageForm"

const ChatRoom = ({conversationId, room, user, messages, sendMessage, typingIndicator, typing }) => {
  return (
    <>
        <h2>Chat Room: {room}</h2>
        
        <div>
            <MessageContainer messages={messages} />
        </div>
        {typingIndicator && <p>{typingIndicator}</p>}
        <div>
            <SendMessageForm conversationId={conversationId} user={user} sendMessage={sendMessage} onTyping={() => typing()} />
        </div>
    </>
  )
}

export default ChatRoom