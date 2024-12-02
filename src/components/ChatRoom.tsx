import MessageContainer from "./MessageContainer"

const ChatRoom = ({messages}) => {
  return (
    <>
        <h2>Chat Room</h2>
        <div>
            <MessageContainer messages={messages} />
        </div>
    </>
  )
}

export default ChatRoom