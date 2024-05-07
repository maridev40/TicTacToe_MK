// Хранилище "Пользователи"
const users = {};

// Добавить пользователя
const addUser = ({userName, userPassword}) => {
    if (!userName) {
        return "Имя пользователя должно быть заполнено.";
    } 
    if (!userPassword) {
        return "Пароль пользователя должен быть заполнен.";
    }
    if (users[userName]) {
        return "Имя пользователя " + userName + " уже существует.";
    } 
    users[userName] = userPassword;
    return "";

};

// Проверить пользователя на корректность
const setUser = ({userName, userPassword}) => {
    if (!userName) {
        return "Имя пользователя должно быть заполнено.";
    } 
    if (!userPassword) {
        return "Пароль пользователя должен быть заполнен.";
    } 
    if (!users[userName]) {
        return "Имя пользователя " + userName + " не обнаружено.";
    } 
    if (users[userName] !== userPassword) {
        return "Пароль пользователя " + userName + " неправильный.";
    } 
    return "";

};

// Получить пользователя
const getUser = (userName) => {
    return users[userName];
};

// Получить всех пользователей
const getUsers = () => {
    return users;
};

module.exports = {
    addUser,
    setUser,
    getUser,
    getUsers
  };