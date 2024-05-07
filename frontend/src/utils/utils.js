const readyToPlay1 = (broadUserName1, userUserName) => {
    if ((broadUserName1) && (userUserName)
        && (broadUserName1 === userUserName)) {
        return true;
    }
    else {
        return false;
    }
};

const readyToPlay2 = (broadUserName1, userUserName, broadUserName2) => {
    if ((broadUserName1) && (userUserName)
        && (broadUserName2 === undefined || broadUserName2 === "")) {
        return true;
    }
    else {
        return false;
    }
};

module.exports = {
    readyToPlay1,
    readyToPlay2
  };