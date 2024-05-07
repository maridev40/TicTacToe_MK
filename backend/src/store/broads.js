// Хранилище "Игровые поля"
const broads = {};

let broadID = 0; // Идентификатор игрового поля

// Добавить игровое поле
const addBroad = ({userName, rows, cols, leng}) => {
    broadID++;
    broads[broadID] = {"id": broadID, "userName1": userName, "userName2": "", "rows": rows, "cols": cols, "leng": leng, "dateCreate": new Date().toLocaleString("ru-RU")};
    return broadID;
};

// Изменить игровое поле в части сделанных ходов
const setBroadData = (id, data) => {
    broads[id].data = data;
};

// Изменить игровое поле в части Второго игрока
const setBroadUserName2 = (id, userName2) => {
    broads[id].userName2 = userName2;
};

// Установить победителя и победную фигуру игрового поля
const setBroadWin = (id, win, figWin) => {
    broads[id].win = win;
    broads[id].figWin = figWin;
};

// Получить игровое поле
const getBroad = (id) => {
    return broads[id] ? broads[id] : {};
};

// Удалить игровое поле
const delBroad = (id) => {
    return broads.delete[id];
};

// Получить все игровые поля
const getBroads = () => {        
    return broads;
};

module.exports = {
    addBroad,
    setBroadData,
    setBroadUserName2,
    setBroadWin,
    getBroad,
    delBroad,
    getBroads
  };