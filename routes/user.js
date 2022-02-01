const { Router } = require('express');
const { check } = require('express-validator');

const {
  validarCampos,
  validarJWT,
  existeUserConNombre,
  existeUserConCorreo,
  existeUserConId,
} = require('../middlewares')
const { crearUsuario, obtenerUsuarios, borrarUsuario, obtenerUsuario, editarUsuario } = require('../controllers/user');
const router = Router();


// OBTENER USUARIOS DE FORMA PAGINADA

router.get('/', obtenerUsuarios) 

// OBTENER USUARIOS POR ID

router.get('/:id',
     [
        check('id', 'No es un id válido').isMongoId(),
        check('id').custom( existeUserConId ),
        validarCampos
     ]   

, obtenerUsuario)

// REGISTRAR USUARIOS

router.post('/registro',
  [   
    check('nombre', 'El campo nombre es obligatorio').not().isEmpty(),
    check('nombre').custom( existeUserConNombre ),
    check('correo', 'El campo correo es obligatorio').not().isEmpty(),
    check('correo', 'Debes ingresar un correo valido').isEmail(),
    check('correo').custom( existeUserConCorreo ),
    check('password', 'El campo password es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe de ser entre 4 a 12 caracteres').isLength( { min: 4, max: 12 }),
    validarCampos   
  ]
,crearUsuario )

// EDITAR USUARIO

router.put('/:id', [

    validarJWT,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom( existeUserConId ),
    check('id').custom( ( id, { req } ) => {
      const uid = req.usuario._id.toString();
      if( id !== uid){
        throw new Error('No puedes realizar esta acción')
      }
      return true
    }),
    check('password', 'El campo password es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe de ser entre 4 a 12 caracteres').isLength( { min: 4, max: 12 }),
    validarCampos

], editarUsuario)

// "ELIMINAR" USUARIO ( ACTUALIZA LA PROP DEL USUARIO "ESTADO": FALSE )

router.delete('/:id',
  [ 
      validarJWT,
      check('id', 'No es un id válido').isMongoId(),
      check('id').custom( existeUserConId ),
      check('id').custom( ( id, { req } ) => {
        const uid = req.usuario._id.toString();
        if( id !== uid){
          throw new Error('No puedes realizar esta acción')
        }
        return true
      }),
      validarCampos
  ],
  borrarUsuario
)

module.exports = router;