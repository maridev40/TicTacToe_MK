import { useContext, useEffect } from "react";
import { SocketContext } from "../../socket/socket";

const Messager = () => {
    const socket = useContext(SocketContext);

    const handleMessageSend = (e) => {
        const input = document.getElementById('input');
        if (input.value) {
            socket.emit('chat message', input.value);
        }
    };

    useEffect(() => {
        socket.on('chat message', (msg) => {
            if ((msg) && (msg !== "")) {
                const messages = document.getElementById('messages');
                const item = document.createElement('li');
                item.textContent = msg;
                messages.insertBefore(item, messages.firstChild);
                const input = document.getElementById('input');
                input.value = '';
            }
        });
    }, [socket]);

    return (
        <div className="Messager">
            <div className="messager-row">
                <input id="input" />
                <button onClick={(e) => handleMessageSend(e)}>Send</button>
            </div>
            <ul className="center" id="messages"></ul>
        </div>
    )
};

export default Messager;