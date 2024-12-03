
const MessageContainer = ({messages}) => {
  return (
    <div>
      <table>
        <tbody>
        {
            messages.map((message, index) => <tr key={index}>
                    <td>{message.message} - {message.username}</td>
                </tr>
             )
        }</tbody>
        </table>
    </div>
  )
}

export default MessageContainer