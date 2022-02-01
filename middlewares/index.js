const  validar_campos  = require('../middlewares/validar-campos');
const   db_validators = require('../middlewares/db-validators');
const  validar_jwt  = require('../middlewares/validar-jwt');

module.exports = {
    ...validar_campos,
    ...db_validators,
    ...validar_jwt
}