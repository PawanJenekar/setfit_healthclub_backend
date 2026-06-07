const express = require('express');

module.exports.ReE = function ReE(res, err, code) {
    if(res != ''){
        if(typeof err == 'object' && typeof err.message != 'undefined'){
            err = err.message;
        }
    }
    res.statusCode = 400;
    if(typeof code !== 'undefined'){
        res.statusCode = code;
        return res.json({message:err, statusCode: res.statusCode});
    }
    return {message:err, status: "failure"};
}

module.exports.ReS = function ReS(res,data,code){
    let sendData = {message : "success", status: "failure", statusCode : code};
    if(typeof data == 'object'){
        sendData = Object.assign(data, sendData);
    }
    if(typeof code !== 'undefined' && parseInt(code) == 200){
        sendData.status = "success";
    }
    if(res != ''){
        if(typeof code !== 'undefined'){
            sendData.statusCode = code;
        }
        return res.json(sendData);
    }
    return sendData;
};