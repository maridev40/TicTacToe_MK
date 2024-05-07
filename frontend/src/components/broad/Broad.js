import { useContext, useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { SocketContext } from "../../socket/socket";
import package_json from '../../../package.json';
import { readyToPlay1 } from '../../utils/utils';

import Cell from "../cell/Cell";

const Broad = ({ pid }) => {
    const socket = useContext(SocketContext);
    const [arrRow, setArrRow] = useState([]);
    const [arrCol, setArrCol] = useState([]);
    const [errorBroad, setErrorBroad] = useState("");
    const [broad, setBroad] = useState({});
    const user = useSelector((state) => state.user.user);

    const BuildBoard = useCallback((rows, cols) => {
        let arr = [];
        for (let i = 0; i < rows; i++) {
            arr.push("");
        }
        setArrRow(arr);
        arr = [];
        for (let i = 0; i < cols; i++) {
            arr.push("");
        }
        setArrCol(arr);
    }, []);

    const getBroadApi = useCallback(async (id) => {
        try {
            setErrorBroad("");
            await fetch(
                package_json.proxy + "api/3t/broad?id=" + id
            )
                .then(response => response.json())
                .then(data => {
                    setBroad(data);
                    BuildBoard(broad.rows, broad.cols);
                });
        } catch (error) {
            console.log("getBroadApi  error: ", error);
        }
    }, [BuildBoard, broad.rows, broad.cols]);

    useEffect(() => {
        getBroadApi(pid);
        socket.on('3t-step-error', (msg) => {
            const mess = JSON.parse(msg);
            if ((mess.figWin) && (mess.broadID === pid)) {
                setErrorBroad(JSON.parse(msg).error);
                setBroad((broad) => ({ ...broad, "data": mess.figWin + broad.data, "win": mess.win, "figWin": mess.figWin }));
            } else if ((mess.socketID === socket.id) && (mess.broadID === pid)) {
                setErrorBroad(JSON.parse(msg).error);
            }
        });
    }, [pid, socket, getBroadApi]);

    const readyPlay1 = () => {
        return readyToPlay1(broad.userName1, user.userName);
    };

    const getClassesBoardListRow = () => {
        if (readyPlay1()) {
            return "broad-data-box broadBoxActive";
        }
        else {
            return "broad-data-box";
        }
    };

    const getXO = () => {
        if (broad.userName1 === user.userName) {
            return "X";
        } else {
            return "O";
        }
    }

    const getInitVal = (row, col) => {
        const reg = new RegExp('([XO]+)(' + row + ':' + col + ')([XO]|$)');
        const mtc = broad.data?.match(reg);
        return mtc ? mtc[1] : "";
    }

    const getWinCell = (row, col) => {
        const reg = new RegExp('([XO]+)(' + row + ':' + col + ')([XO]|$)');
        const mtc = broad.figWin?.match(reg);
        return mtc ? true : false;
    }

    return (
        <div className={!user.userName ? "Broad visibledModule" : "Broad"}>
            <h3>Игровое поле №{broad.id}: </h3>
            <p className="error">{errorBroad}</p>
            <div className={getClassesBoardListRow()}>
                {arrRow.map((item, indRow) =>
                (
                    <div key={indRow} className="broad-data-row">
                        {arrCol.map((item, indCol) => <Cell key={indCol} broadID={broad.id} row={indRow} col={indCol} initVal={getInitVal(indRow, indCol)} stepVal={getXO()} win={getWinCell(indRow, indCol)} />)}

                    </div>
                ))
                }
            </div>
        </div>
    )
};

export default Broad;        