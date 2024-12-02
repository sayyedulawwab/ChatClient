import { useState } from "react";

function WaitingRoom({ joinChatRoom }) {
  
    const [username, setUsername] = useState();
    const [chatroom, setChatroom] = useState();
  
    return (
        <form onSubmit={ e => {
            e.preventDefault();
            joinChatRoom(username, chatroom);

        }}>

            <div>
                <div>
                    <div>
                        <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
                        <input type="text" placeholder="ChatRoom" onChange={e => setChatroom(e.target.value)} />
                        
                    </div>
                    <div>
                        <button type="submit">Join</button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default WaitingRoom