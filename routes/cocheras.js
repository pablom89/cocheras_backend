const { Router } = require('express');
const { check } = require( 'express-validator');
const Cochera = require('../models/Cochera');
const {
    validarCampos,
    existeNombre,
    existeCocheraConId,
    existeCocheraConDir,
    validarJWT
} = require('../middlewares')
const { 
    crearCochera, 
    editarCochera, 
    obtenerCocheras,
    obtenerCocheraxId, 
    eliminarCochera, 
    obtenerCocherasUser,
    obtenerCocherasFiltradas
} = require('../controllers/cocheras');
const router = Router();

// OBTENER COCHERAS

router.get('/', obtenerCocheras)

// OBTENER COCHERAS POR GEOLOCALIZACION

router.get('/cercanas', obtenerCocherasFiltradas)

// OBTENER COCHERAS POR USUARIO
router.get('/user/', validarJWT, obtenerCocherasUser )

// OBTENER COCHERAS POR ID
router.get('/:id',
[
    validarJWT,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom( existeCocheraConId ),
    validarCampos
]
,obtenerCocheraxId)


//A los siguientes endpoints se les requiere el token


// CREAR COCHERAS 
router.post('/',
    [   
        validarJWT,
        check('nombre' , 'El campo nombre no puede estar vacio').not().isEmpty(),
        check('nombre').custom( existeNombre ),
        check('direccion','El campo direccion es obligatorio').not().isEmpty(),
        check('direccion').custom( existeCocheraConDir ),
        validarCampos
    ]
,crearCochera )

//ELIMINAR COCHERA
router.delete('/:id',
    [   
        validarJWT,
        check('id', 'No es un id válido').isMongoId(),
        check('id').custom( existeCocheraConId ),
        validarCampos
    ]
, eliminarCochera)


// EDITAR COCHERA

router.put('/:id',
// requerir JWT y validar que la cochera pertenezca a quien la quiere modificar, si no, un usuario seria capaz de modificar la cochera de otra persona
[   
    validarJWT,
    check('id', 'No es un id válido').isMongoId(),
    check('nombre','El campo nombre no puede estar vacío').not().isEmpty(),
    check('id').custom( existeCocheraConId ),
    validarCampos
] 
,editarCochera)
 

module.exports = router;