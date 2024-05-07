const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const { addUser, setUser, getUsers } = require('./src/store/users.js');
const { getBroads, getBroad, addBroad, setBroadData, setBroadUserName2, setBroadWin } = require('./src/store/broads.js');

const app = express();

app.use(express.json());

// Разрешить CORS для api
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

const server = createServer(app);
const io = new Server(server, {
    // Разрешить CORS для сокетов
    cors: {
        origin: '*',
    }
});

const appUsers = {};
const broadsData = {};

// End point - Корневой адрес
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

// End point - Получить всех пользователей
app.get('/api/users', (req, res) => {
    res.send(JSON.stringify(getUsers()));
});

// End point - Добавить пользователя
app.post('/api/user', (req, res) => {  
    const result = addUser(req.body);
    if (result) {
        res.status(500);
        res.send({ error: result })
    } else {
        res.status(200);
        res.send(JSON.stringify({ userName: req.body.userName, userPassword: req.body.userPassword }));
    }
});

// End point - Зарегистрировать пользователя
app.post('/api/reguser', (req, res) => {
    const result = setUser(req.body);
    if (result) {
        res.status(500);
        res.send({ error: result })
    } else {
        res.status(200);
        res.send(JSON.stringify({ userName: req.body.userName, userPassword: req.body.userPassword }));
    }
});

// Tic Tac Toe (3t)

// End point - Получить все игровые поля
app.get('/api/3t/broads', (req, res) => {
    res.send(JSON.stringify(getBroads()));
});

// End point - Получить заданное игровое поле
app.get('/api/3t/broad', (req, res) => {
    res.send(JSON.stringify(getBroad(req.query.id)));
});

// End point - Добавить игровое поле
app.post('/api/3t/broad', (req, res) => {
    try {
        if (req.body.userName == undefined || req.body.userName.trim() == "") {
            res.status(500);
            res.send(JSON.stringify({ "error": "Пользователь должен быть установлен." }));
        } else if (req.body.rows == undefined || req.body.rows < 1) {
            res.status(500);
            res.send(JSON.stringify({ "error": "Количество строк должно быть больше нуля." }));
        } else if (req.body.cols == undefined || req.body.cols < 1) {
            res.status(500);
            res.send(JSON.stringify({ "error": "Количество столбцов должно быть больше нуля." }));
        } else if (req.body.leng == undefined || req.body.leng < 1) {
            res.status(500);
            res.send(JSON.stringify({ "error": "Длина фигуры для победы должна быть больше нуля." }));
        } else if ((req.body.leng > req.body.rows) || (req.body.leng > req.body.cols)) {
            res.status(500);
            res.send(JSON.stringify({ "error": "Длина фигуры для победы не должна превышать сторону игрового поля." }));
        } else {
            const result = addBroad(req.body);
            broadsData[result] = "";
            res.status(200);
            res.send(JSON.stringify({ "id": result }));
        }
    } catch (error) {
        res.status(500);
        res.send({ "error": error })
    }
});

// Событие - Подсоединиться к сокету
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('chat message', (msg) => {
        if (appUsers[socket.id] && appUsers[socket.id] !== "") {
            io.emit('chat message', appUsers[socket.id] + ': ' + msg);
        } else {
            io.emit('chat message', "");
        }
    });

    // Событие - Вход пользователя
    socket.on('setUser', ({ userName }) => {
        appUsers[socket.id] = userName;
    });

    // Событие - Выход пользователя
    socket.on('outUser', () => {
        appUsers[socket.id] = "";
    });

    // Tic Tac Toe (3t) Игра Крестики - Нолики

    // Получить количество ячеек заполненных "X"
    // Возвращает количество ячеек заполненных "X"
    const getCountX = (broadID) => {
        return (String(broadsData[broadID]).match(/X/g) || []).length;
    }

    // Получить количество ячеек заполненных "O"
    // Возвращает количество ячеек заполненных "O"
    const getCountO = (broadID) => {
        return (String(broadsData[broadID]).match(/O/g) || []).length;
    }

    // Проверить занятость заданной ячейки
    // Возвращает 0 - ячейка не занята; 1 - ячейка занята
    const getCountVal = (broadID, row, col) => {
        const reg = new RegExp('[XO]' + row + ':' + col, 'g');
        return (String(broadsData[broadID]).match(reg) || []).length;
    }

    // Получить значение в заданной ячейке
    // Возвращает "X" или "O" или ""
    const getVal = (broadID, row, col) => {
        const reg = new RegExp('([XO]+)(' + row + ':' + col + ')([XO]|$)');
        const mtc = broadsData[broadID]?.match(reg);
        return mtc ? mtc[1] : "";
    }

    // Проверить ход на ошибки
    const check3TStep = ({ broadID, row, col, val }) => {
        const brd = getBroad(broadID);
        if (!broadID) {
            return "Отсутствует идентификатор игрового поля.";
        }
        if (brd.win) {
            return "Победили " + brd.win + " !!!";
        }
        // В данном игровом поле неустановлен Второй игрок
        if ((brd.userName1 !== appUsers[socket.id]) && ((brd.userName2 === undefined) || (brd.userName2 === ""))) {
            // Установить Второго игрока
            setBroadUserName2(broadID, appUsers[socket.id]);
        }
        if ((brd.userName1 !== appUsers[socket.id]) && (brd.userName2 !== undefined) && (brd.userName2 !== appUsers[socket.id])) {
            return "Вы не входите в число игроков данного игрового поля.";
        }
        if (row === undefined) {
            return "Отсутствует номер строки.";
        }
        if (col === undefined) {
            return "Отсутствует номер столбца.";
        }
        if (val === undefined) {
            return "Отсутствует значение ячейки.";
        }
        if ((val === "X") && (getCountX(broadID) > getCountO(broadID))) {
            return "Ходить должны нолики";
        }
        if ((val === "O") && (getCountX(broadID) <= getCountO(broadID))) {
            return "Ходить должны крестики";
        }
        if (getCountVal(broadID, String(row), String(col)) > 0) {
            return "Эта ячейка уже занята.";
        }

        return "";
    }

    // Проверить ход на победу
    const checkWinStep = (broadID, row, col, val) => {
        const brd = getBroad(broadID);
        let vfigWin = "";

        //Проверить горизонталь
        let count = 0;
        for (let i = 0; i < brd.cols; i++) {
            if (val === getVal(broadID, row, i)) {
                count++;
                vfigWin = vfigWin + val + row + ":" + i;
                if (count >= brd.leng) {
                    return vfigWin;
                }
            } else {
                count = 0;
                vfigWin = "";
            }
        }

        //Проверить вертикаль
        count = 0;
        for (let i = 0; i < brd.rows; i++) {
            if (val === getVal(broadID, i, col)) {
                count++;
                vfigWin = vfigWin + val + i + ":" + col;
                if (count >= brd.leng) {
                    return vfigWin;
                }
            } else {
                count = 0;
                vfigWin = "";
            }
        }

        // Проверить убывающую диагональ
        let x = brd.rows - 1;
        let y = 0;
        let b = row + col;
        if (b > x) {
            y = -x + b;
        } else {
            x = b;
        }
        count = 0;
        for (let i = x, j = y; i >= 0 && j < brd.cols; i--, j++) {
            if (val === getVal(broadID, i, j)) {
                count++;
                vfigWin = vfigWin + val + i + ":" + j;
                if (count >= brd.leng) {
                    return vfigWin;
                }
            } else {
                count = 0;
                vfigWin = "";
            }
        }

        // Проверить восходящую диагональ
        x = 0;
        y = 0;
        b = col - row;
        if (b > 0) {
            y = b;
        } else {
            x = Math.abs(b);
        }
        count = 0;
        for (let i = x, j = y; i < brd.rows && j < brd.cols; i++, j++) {
            brd.cols
            if (val === getVal(broadID, i, j)) {
                count++;
                vfigWin = vfigWin + val + i + ":" + j;
                if (count >= brd.leng) {
                    return vfigWin;
                }
            } else {
                count = 0;
                vfigWin = "";
            }
        }

        return "";
    }

    // Событие - сделан ход в игре Крестики - Нолики
    socket.on('3t-step', (cell) => {

        if ((appUsers[socket.id]) && (appUsers[socket.id] !== "")) {
            const pcell = JSON.parse(cell);
            const error = check3TStep(pcell);
            if (error) {
                const mess = { "socketID": pcell.socketID, "broadID": pcell.broadID, "error": error };
                io.emit('3t-step-error', JSON.stringify(mess));
            } else {
                broadsData[pcell.broadID] = broadsData[pcell.broadID] + String(pcell.val) + String(pcell.row) + ":" + String(pcell.col);
                setBroadData(pcell.broadID, broadsData[pcell.broadID]);
                const clearError = { "socketID": pcell.socketID, "broadID": pcell.broadID, "error": "" };
                const mess = { "socketID": pcell.socketID, "broadID": pcell.broadID, "row": pcell.row, "col": pcell.col, "val": pcell.val };
                const vfigWin = checkWinStep(pcell.broadID, pcell.row, pcell.col, pcell.val);
                if (vfigWin) {
                    setBroadWin(pcell.broadID, pcell.val, vfigWin);
                    mess.win = pcell.val;
                    clearError.error = "Победили " + pcell.val + " !!!";
                    clearError.win = pcell.val;
                    clearError.figWin = vfigWin;
                }
                io.emit('3t-step-error', JSON.stringify(clearError));
                io.emit('3t-step', JSON.stringify(mess));
            }
            const msg = appUsers[socket.id] + ': ' + JSON.stringify(pcell);
        }
    });
});

const port = 3005;
server.listen(port, () => {
    console.log('server running at http://localhost:' + port);
});

module.exports = {
    app
  };