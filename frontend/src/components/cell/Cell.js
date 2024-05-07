import { useState, useContext, useEffect } from "react";
import { SocketContext } from "../../socket/socket";

const Cell = ({ broadID, row, col, initVal, stepVal, win }) => {
    const socket = useContext(SocketContext);
    const [cell, setCell] = useState({});

    useEffect(() => {
        setCell({ "socketID": socket.id, "broadID": broadID, "row": row, "col": col, "val": initVal, "win": win });
        socket.on('3t-step', (msg) => {
            const mess = JSON.parse(msg);
            if ((mess.broadID === broadID) && (mess.row === row) && (mess.col === col)) {
                setCell({ "socketID": socket.id, "broadID": broadID, "row": row, "col": col, "val": mess.val, "win": win });
            }
        });
    }, [socket, broadID, row, col, initVal, stepVal, win]);

    const handleMessageSend = (e) => {
        socket.emit('3t-step', JSON.stringify({ ...cell, "val": stepVal }));
    };

    const getClassesCell = () => {
        if (cell.win) {
            return "Cell winCell";
        }
        else {
            return "Cell";
        }
    };

    return (
        <div className={getClassesCell()} onClick={(e) => handleMessageSend(e)}>
            {cell.val}
        </div>
    )
};

export default Cell;