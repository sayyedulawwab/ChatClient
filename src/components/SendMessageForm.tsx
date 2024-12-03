import { useEffect, useState } from "react";

const SendMessageForm = ({ sendMessage, onTyping }) => {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (!isTyping) return;

        const timer = setTimeout(() => {
            setIsTyping(false); // Reset typing state after a delay
        }, 3000);

        return () => clearTimeout(timer); // Clear timer on component unmount
    }, [isTyping]);


    const handleTyping = () => {
        if (!isTyping) {
            onTyping(); // Call the typing event only once per burst of typing
            setIsTyping(true);
        }
    };

    return <form onSubmit={ e => {
        e.preventDefault();
        sendMessage(message); 
        setMessage('');
    
    }}>
        <label htmlFor="chat">chat</label>
        <input type="text" id="chat" onChange={e => {setMessage(e.target.value); handleTyping();}} value={message} />
        <button type="submit" disabled={!message}>Send</button>
    </form>
}

export default SendMessageForm