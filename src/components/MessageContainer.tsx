
const MessageContainer = ({messages}) => {
  return (
    <div>
      <table>
        {
            messages.map((message, index) => <tr key={index}>
                    <td>{message.message} - {message.username}</td>
                </tr>
             )
        }
        </table>
    </div>
  )
}

export default MessageContainer