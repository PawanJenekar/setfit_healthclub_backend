const authModel = require('../models/auth_model');
const Joi = require('joi');
const logger = require('../services/logger');
const [ReS, ReE] = require('../services/utils');

const registerUser = async (req, res) => {
    try {
        const schema = Joi.object({
            name : Joi.string().required(),
            email : Joi.string().email().required(),
            mobile : Joi.number().max(10).allow(null,''),
            password : Joi.string().min(5).max(12).required(),
            role : Joi.string().valid('user','trainer', 'admin').required(),
            gender : Joi.string().valid('male', 'female', 'other').required(),
            age : Joi.number().integer().min(12).required(),
            height : Joi.number().integer().allow(null,''),
            weight : Joi.number().integer().allow(null,''),
            isactive : Joi.interger().valid(0,1),
        })

        const result = schema.validate(req.body);

        if(result.error){
            return ReE(res, result.error.details[0].message, 400);
        }
        const requestData = result.value;
        const [resFlg, resMsg] = await authModel.registerUser(requestData);
        if(resFlg){
            return ReS(res, {message: resMsg}, 200);
        }
        return ReE(res, resMsg, 500);
    }
    catch(e){
        logger.error({
            file: 'controllers/auth.js',
            method: 'registerUser',
            message: e.message
        })
    }
}
exports.registerUser = registerUser;