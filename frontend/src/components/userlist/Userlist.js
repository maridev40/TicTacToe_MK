import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import package_json from '../../../package.json';

const Userlist = () => {
    const user = useSelector((state) => state.user.user);
    const [users, setUsers] = useState({});

    useEffect(() => {
        handleRefreshUsers();
    }, []);

    const handleRefreshUsers = (e) => {
        fetch(
            package_json.proxy + "api/users",
            { method: 'GET' })
            .then(response => response.json())
            .then(data => setUsers(data));
    };

    return (
        <div className={!user.userName ? "Userlist visibledModule" : "Userlist"}>
            <h3>Список пользователей</h3>
            <button onClick={(e) => handleRefreshUsers(e)}>Обновить</button>
            <div className="user-list-box">
                <div className="user-list-title">
                    <p className="user-list-title__cell">Пользователь</p>
                </div>
                {Object.keys(users).map((item, index) =>
                    <div className="user-list-row" key={index}>
                        <p className="user-list-row__cell" key={index}>{item}</p>
                    </div>
                )}
            </div>
        </div>
    )
};

export default Userlist;