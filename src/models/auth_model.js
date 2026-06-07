const bcrypt = require('bcryptjs');

const logger = require('../services/logger');

const db = require('../config/db');
const _ = require('lodash');


const registerUser = async (requestData) => {
    const client = await db.pool.connect();
    try{
        await client.query('BEGIN');
        if(!_.isUndefined(requestData.password) && !_.isEmpty(requestData.password)){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(requestData.password, salt);

            const additionalJSON = {
                mobile : requestData.mobile || null,
                height : requestData.height || null,
                weight : requestData.weight || null,
                age : requestData.age || null,
                gender : requestData.gender || null,
            }
            const userQuery = `
                INSERT INTO users (
                    email,
                    password_hash,
                    role,
                    isactive
                )
                VALUES ($1, $2, $3, $4)
            `
            const values = [
                requestData.email,
                hashedPassword,
                requestData.role,
                requestData.isactive
            ];
            const userResult = await client.query(userQuery, values);

            if(apiResp.rowCount > 0){
                return [true, 'User registered successfully'];
            }else{
                return [false, 'Error registering user'];   
            }
        }else{
            return [false, 'Password is required'];
        }
    }catch(e){
        logger.error({
            file: 'models/auth_model.js',
            method: 'registerUser',
            message: e.message
        })
        return [false, 'Error registering user'];
    }
}
exports.registerUser = registerUser;