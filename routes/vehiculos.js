
const { Router } = require('express');
const { check } = require('express-validator');
const {
    validarCampos,
    validarJWT,
    existeVehiculoConPatente,
    existeVehiculoConId
} = require('../middlewares')
const { crearVehiculo, 
        borrarVehiculo, 
        obtenerVehiculos, 
        obtenerVehiculo, 
        obtenerVehiculosUser,
        editarVehiculo
} = require('../controllers/vehiculos')

const router = Router();


// OBTIENE TODOS LOS VEHICULOS 
router.get('/', obtenerVehiculos)

// OBTENER VEHICULOS X USUARIO
router.get('/user', validarJWT, obtenerVehiculosUser)

// OBTENER VEHICULOS POR ID
router.get('/:id',
    [   
        validarJWT,
        check('id', 'No corresponde a un id valido').isMongoId(),
        check('id').custom( existeVehiculoConId ),
        validarCampos
    ]
,obtenerVehiculo)

// CREAR VEHICULOS
router.post('/',
[
    validarJWT,
    
    check('clase','El vehículo es obligatorio').not().isEmpty(),
    check('patente', 'La patente es obligatoria').not().isEmpty(),
    check('patente').custom( existeVehiculoConPatente ),
    check('seguro', 'El seguro es mandatorio').not().isEmpty(),
    validarCampos
]
,crearVehiculo )

//EDITAR VEHICULO

router.put('/:id',
[
    validarJWT,
    check('id','No es un id valido de mongo').isMongoId(),
    check('id').custom( existeVehiculoConId ),
    check('patente','El campo patente es obligatorio').not().isEmpty(),
    check('clase','El campo clase es obligatorio').not().isEmpty(),// validar contra una categoria de la bd
    check('seguro','El campo seguro es obligatorio').not().isEmpty(),
    validarCampos
]
,editarVehiculo )

// BORRAR VEHICULOS
router.delete('/:id',
    [   
        validarJWT,
        check('id', 'No corresponde a un id valido').isMongoId(),
        check('id').custom( existeVehiculoConId ),
        validarCampos
    ]
,borrarVehiculo )


module.exports = router;