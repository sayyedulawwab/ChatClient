import { useState } from "react";

const SendMessageForm = ({ sendMessage, onTyping }) => {
    const [message, setMessage] = useState('');
    

    const handleTyping = () => {
        onTyping();
    };

    return <form onSubmit={ e => {
        e.preventDefault();
        sendMessage(message); 
        setMessage('');
    
    }}>
        <label htmlFor="chat">chat</label>
        <input type="text" onChange={e => {setMessage(e.target.value); handleTyping();}} value={message} />
        <button type="submit" disabled={!message}>Send</button>
    </form>
}

export default SendMessageForm