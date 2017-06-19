'use strict';

const mongoose = require('mongoose');
const jwt      = require('jsonwebtoken');

// The access tokens.
// You will use these to access your end point data through the means outlined
// in the RFC The OAuth 2.0 Authorization Framework: Bearer Token Usage
// (http://tools.ietf.org/html/rfc6750)

/**
 * Tokens in-memory data structure which stores all of the access tokens
 */
let TokenSchema   = new mongoose.Schema({
   jti: {type:String,require:true},
   expirationDate: { type: String, required: false },
   userID: { type: String, required: false },
   clientID: { type: String, required: false },
   scope: { type: String, required: false }
});

let Tokens=mongoose.model('Token', TokenSchema);


/**
 * Returns an access token if it finds one, otherwise returns null if one is not found.
 * @param   {String}  token - The token to decode to get the id of the access token to find.
 * @returns {Promise} resolved with the token if found, otherwise resolved with undefined
 */
exports.find = (_token) => {
  try{
		const _jti=jwt.decode(_token).jti;
		return Tokens.findOne({jti:_jti});
	}catch(error){
		console.log(error);
	}
};

/**
 * Saves a access token, expiration date, user id, client id, and scope. Note: The actual full
 * access token is never saved.  Instead just the ID of the token is saved.  In case of a database
 * breach this prevents anyone from stealing the live tokens.
 * @param   {Object}  token          - The access token (required)
 * @param   {Date}    expirationDate - The expiration of the access token (required)
 * @param   {String}  userID         - The user ID (required)
 * @param   {String}  clientID       - The client ID (required)
 * @param   {String}  scope          - The scope (optional)
 * @returns {Promise} resolved with the saved token
 */
exports.save = (token, expirationDate, userID, clientID, scope) => {
  let miToken = new Tokens({
	  jti: jwt.decode(token).jti,
	  expirationDate: expirationDate,
	  userID: userID,
	  clientID:clientID,
	  scope: scope
  });
  miToken.save();
  return Promise.resolve(miToken);
};

/**
 * Deletes/Revokes an access token by getting the ID and removing it from the storage.
 * @param   {String}  token - The token to decode to get the id of the access token to delete.
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
 * Removes expired access tokens. It does this by looping through them all and then removing the
 * expired ones it finds.
 * @returns {Promise} resolved with an associative of tokens that were expired
 */
exports.removeExpired = () => {
  return Tokens.find(function(err,result){
		for(let token in result){
			if(new Date()>token.expirationDate){
				return Tokens.remove({jti:token.jti});
			}
		}
	});
};

/**
 * Removes all access tokens.
 * @returns {Promise} resolved with all removed tokens returned
 */
exports.removeAll = () => {
  return Tokens.remove({}, callback);
};
