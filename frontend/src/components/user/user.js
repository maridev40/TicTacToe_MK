import { useContext, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { SocketContext } from "../../socket/socket";
import package_json from '../../../package.json';
import { setUser } from "../../reducers/userSlice";

const User = () => {
    const user = useSelector((state) => state.user.user);
    const socket = useContext(SocketContext);
    const [errorUser, setErrorUser] = useState("");
    const dispatch = useDispatch();

    async function addUserPost(userName, userPassword) {
        try {
            await fetch(
                package_json.proxy + "api/user",
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "userName": userName,
                        "userPassword": userPassword
                    })
                })
                .then(response => response.json())
                .then(data => {
                    setErrorUser(data.error);
                    dispatch(setUser(data.userName));
                    socket.emit('setUser', { "userName": data.userName });
                })
        } catch (error) {
            console.log("addUserPost error: ", error);
        }
    }

    async function InUserPost(userName, userPassword) {
        try {
            await fetch(
                package_json.proxy + "api/reguser",
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "userName": userName,
                        "userPassword": userPassword
                    })
                })
                .then(response => response.json())
                .then(data => {
                    setErrorUser(data.error);
                    dispatch(setUser(data.userName));
                    socket.emit('setUser', { "userName": data.userName });
                })
        } catch (error) {
            console.log("InUserPost error: ", error);
        }
    }

    const handleAddUser = (e) => {
        const inputUser = document.getElementById('inputUser');
        const passwordUser = document.getElementById('passwordUser');
        addUserPost(inputUser.value, passwordUser.value);
    };

    const handleInUser = (e) => {
        const inputUser = document.getElementById('inputUser');
        const passwordUser = document.getElementById('passwordUser');
        InUserPost(inputUser.value, passwordUser.value);
    };

    const handleOutUser = (e) => {
        dispatch(setUser(""));
        socket.emit('outUser');
    };

    return (
        <div className="User">
            <h3>Пользователь</h3>
            <div className="user-set-box">
                <div className="user-set-row">
                    <label className="user-set-row__cell" htmlFor="inputUser">Имя пользователя: </label>
                    <input className="user-set-row__cell" id="inputUser" disabled={user.userName} />
                </div>
                {!user.userName ? <div className="user-set-row">
                    <label className="user-set-row__cell" htmlFor="passwordUser">Пароль: </label>
                    <input className="user-set-row__cell" type="password" id="passwordUser" />
                </div> : ""}
            </div>
            <p className="error">{errorUser}</p>
            <div className="user-set-command">
                {user.userName ? <button onClick={(e) => handleOutUser(e)}>Выйти</button> : <button onClick={(e) => handleInUser(e)}>Войти</button>}
                {user.userName ? "" : <button onClick={(e) => handleAddUser(e)}>Зарегистрироваться</button>}
            </div>
        </div>
    )
};

export default User;