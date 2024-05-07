import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import package_json from '../../../package.json';
import { setBroad } from "../../reducers/broadSlice";
import { readyToPlay1} from "../../utils/utils";

const Broadlist = () => {
    const [broads, setBroads] = useState({});
    const [errorAddBroad, setErrorAddBroad] = useState("");
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();

    useEffect(() => {
        handleRefreshBroads();
    }, []);

    const handleRefreshBroads = (e) => {
        fetch(
            package_json.proxy + "api/3t/broads",
            { method: 'GET' })
            .then(response => response.json())
            .then(data => setBroads(data));
    };

    async function addBroad(userName, rows, cols, leng) {
        try {
            await fetch(
                package_json.proxy + "api/3t/broad",
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "userName": user.userName,
                        "rows": rows,
                        "cols": cols,
                        "leng": leng
                    })
                })
                .then(response => response.json())
                .then(data => {
                    setErrorAddBroad(data.error);
                })
                ;
        } catch (error) {
            console.log("addBroad error: ", error);
        }
    }

    const handleAddBroad = (e) => {
        const inputRow = document.getElementById('inputRow');
        const inputCol = document.getElementById('inputCol');
        const inputLeng = document.getElementById('inputLeng');
        addBroad(user.userName, Number(inputRow.value), Number(inputCol.value), Number(inputLeng.value));
    };

    const readyPlay1 = (broadId) => {
        return readyToPlay1(broads[broadId].userName1, user.userName);
    };

    const getClassesBoardListRow = (broadId) => {
        if (readyPlay1(broadId)) {
            return "board-list-row activeBroad";
        }
        else {
            return "board-list-row";
        }
    };
    
    return (
        <div className={!user.userName ? "Broadlist visibledModule" : "Broadlist"}>
            <div className="addBroad">
                <h3>Добавить игровое поле: </h3>
                <div className="add-board-box">
                    <div className="add-board-row">
                        <label className="add-board-row__cell" htmlFor="inputRow">Кол-во строк: </label>
                        <input className="add-board-row__cell" id="inputRow" type="Number"/>
                    </div>
                    <div className="add-board-row">
                        <label className="add-board-row__cell" htmlFor="inputCol">Кол-во столбцов: </label>
                        <input className="add-board-row__cell" id="inputCol"  type="Number"/>
                    </div>
                    <div className="add-board-row">
                        <label className="add-board-row__cell" htmlFor="inputLeng">Длина фигуры для победы: </label>
                        <input className="add-board-row__cell" id="inputLeng"  type="Number"/>
                    </div>
                </div>
                <p className="error">{errorAddBroad}</p>
                <button onClick={(e) => handleAddBroad(e)}>Добавить</button>
            </div>
            <div className="Broadlist">
                <h3>Список игровых полей:</h3>
                <button onClick={(e) => handleRefreshBroads(e)}>Обновить</button>
                <div className="board-list-box">
                    <div className="board-list-title">
                        <p className="board-list-title__cell">№</p>
                        <p className="board-list-title__cell">Кол-во строк</p>
                        <p className="board-list-title__cell">Кол-во столбцов</p>
                        <p className="board-list-title__cell">Длина фигуры для победы</p>
                        <p className="board-list-title__cell">Первый игрок</p>
                        <p className="board-list-title__cell">Второй игрок</p>
                        <p className="board-list-title__cell">Дата создания</p>
                    </div>
                    {Object.keys(broads).map((key, index) =>
                        <div className={getClassesBoardListRow(key)} key={index} onClick={() => dispatch(setBroad({ "id": Number(key) }))}>
                            <p className="board-list-row__cell">{key}</p>
                            <p className="board-list-row__cell">{broads[key].rows}</p>
                            <p className="board-list-row__cell">{broads[key].cols}</p>
                            <p className="board-list-row__cell">{broads[key].leng}</p>
                            <p className="board-list-row__cell">{broads[key].userName1}</p>
                            <p className="board-list-row__cell">{broads[key].userName2}</p>
                            <p className="board-list-row__cell">{broads[key].dateCreate}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
};

export default Broadlist;