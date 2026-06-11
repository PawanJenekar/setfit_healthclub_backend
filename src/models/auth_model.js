const bcrypt = require('bcryptjs');

const logger = require('../services/logger');

const db = require('../config/db');

const _ = require('lodash');

const registerUser = async (requestData) => {

    const client = await db.pool.connect();

    try {

        /*
        |--------------------------------------------------------------------------
        | CHECK IF USER EXISTS
        |--------------------------------------------------------------------------
        */

        const validateQuery = `
            SELECT userid
            FROM setfitapp.users
            WHERE email = $1
            LIMIT 1
        `;

        const validateValues = [
            requestData.email
        ];

        const userExists = await client.query(
            validateQuery,
            validateValues
        );

        if (userExists.rowCount > 0) {

            return [
                false,
                'User already exists'
            ];

        }

        /*
        |--------------------------------------------------------------------------
        | PASSWORD VALIDATION
        |--------------------------------------------------------------------------
        */

        if (
            _.isUndefined(requestData.password) ||
            _.isEmpty(requestData.password)
        ) {

            return [
                false,
                'Password is required'
            ];

        }

        // BEGIN TRANSACTION
        await client.query('BEGIN');

        //   HASH PASSWORD

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(
            requestData.password,
            salt
        );

        // INSERT USER
        let userQuery = `
            INSERT INTO setfitapp.users (
                email,
                password_hash,
                role,
                is_active
            )
            VALUES ($1, $2, $3, $4)
            RETURNING userid
        `;

        let values = [
            requestData.email,
            hashedPassword,
            requestData.role,
            requestData.is_active
        ];

        const userResult = await client.query(
            userQuery,
            values
        );

        if (userResult.rowCount <= 0) {
            await client.query('ROLLBACK');
            return [
                false,
                'Error creating user'
            ];
        }
        // GET USERID
        const userId =
            userResult.rows[0].userid;

        // INSERT PROFILE
        userQuery = `
            INSERT INTO setfitapp.user_profiles (
                userid,
                full_name,
                mobile_no,
                dob,
                gender,
                additional_json
            )
            VALUES ($1,$2,$3,$4,$5,$6)
        `;
        values = [
            userId,
            requestData.full_name,
            requestData.mobile_no,
            requestData.dob,
            requestData.gender,
            {
                fitness_goal:
                    requestData.fitness_goal
            }
        ];
        const profileResult = await client.query(
            userQuery,
            values
        );
        if (profileResult.rowCount <= 0) {
            await client.query('ROLLBACK');
            return [
                false,
                'Error creating profile'
            ];
        }

        //commit transaction
        await client.query('COMMIT');
        return [
            true,
            'User registered successfully'
        ];
    } catch (e) {
        await client.query('ROLLBACK');
        logger.error({
            file: 'models/auth_model.js',
            method: 'registerUser',
            message: e.message
        });
        return [
            false,
            'Error registering user'
        ];
    } finally {
        client.release();
    }

};

exports.registerUser = registerUser;