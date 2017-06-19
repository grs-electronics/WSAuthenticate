'use strict';

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// The refresh tokens.
// You will use these to get access tokens to access your end point data through the means outlined
// in the RFC The OAuth 2.0 Authorization Framework: Bearer Token Usage
// (http://tools.ietf.org/html/rfc6750)

/**
 * Tokens in-memory data structure which stores all of the refresh tokens
 */

 let TokenSchema   = new mongoose.Schema({
    jti: {type:String,require:false},
    expirationDate: { type: String, required: false },
    userID: { type: String, required: false },
    clientID: { type: String, required: false },
    scope: { type: String, required: false }
 });

let Tokens=mongoose.model('tokens', TokenSchema);

/**
 * Returns a refresh token if it finds one, otherwise returns null if one is not found.
 * @param   {String}  token - The token to decode to get the id of the refresh token to find.
 * @returns {Promise} resolved with the token
 */
 exports.find = (_token) => {
   try{
 		const _jti=jwt.decode(_token).jti;
 		return Tokens.findOne({jti:_jti});
 	}catch(error){
 		return Promise.resolve(undefined);
 	}
 };


/**
 * Saves a refresh token, user id, client id, and scope. Note: The actual full refresh token is
 * never saved.  Instead just the ID of the token is saved.  In case of a database breach this
 * prevents anyone from stealing the live tokens.
 * @param   {Object}  token    - The refresh token (required)
 * @param   {String}  userID   - The user ID (required)
 * @param   {String}  clientID - The client ID (required)
 * @param   {String}  scope    - The scope (optional)
 * @returns {Promise} resolved with the saved token
 */
 exports.save = (token, userID, clientID, scope) => {
   let miToken = new Tokens({
 	  jti: jwt.decode(token).jti,
 	  userID: userID,
 	  clientID:clientID,
 	  scope: scope
   });
   miToken.save();
   return Promise.resolve(miToken);
 };


/**
 * Deletes a refresh token
 * @param   {String}  token - The token to decode to get the id of the refresh token to delete.
 * @returns {Promise} resolved with the deleted token
 */
 exports.delete = (token) => {
   try {
     const _jti= jwt.decode(token).jti;
 	  return Tokens.remove({jti:_jti});
   } catch (error) {
     return Promise.resolve(undefined);
   }
 };


/**
 * Removes all refresh tokens.
 * @returns {Promise} resolved with all removed tokens returned
 */
 exports.removeAll = () => {
   return Tokens.remove({}, callback);
 };
