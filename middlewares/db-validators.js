const Cochera = require('../models/Cochera');
const Vehiculo = require('../models/Vehiculo');
const User = require('../models/user');

// *********** USUARIO ****************//

const existeUserConNombre = async( nombre ) =>{

    const existeElNombre = await User.findOne({ nombre })
    if( existeElNombre ) {
        throw new Error( `El correo ${ nombre } ya se encuentra registrado`)
    }
}

const existeUserConCorreo = async( correo ) =>{

    const existeElCorreo = await User.findOne({ correo })
    if( existeElCorreo ) {
        throw new Error( `El correo ${ correo } ya se encuentra registrado`)
    }
}

const existeUserConId = async( id ) => {

    const existeElUser = await User.findById( id )
    if( !existeElUser ){
        throw new Error( `No existe un usuario con el id : ${ id }`)
    }
}




/************* VEHICULOS****************** */

const existeVehiculoConPatente =async ( patente ) => {

    const existePatente = await Vehiculo.findOne( { patente })
    if( existePatente ) {
       throw new Error(`La patente ${ patente } ya se encuentra registrada`)
    }

}

const existeVehiculoConId = async ( id ) => {

    const existeVehiculo = await Vehiculo.findById( id );
    if( !existeVehiculo ){
        throw new Error(`El vehiculo con el id ${ id } no existe`)
    }

}

/// ****** COCHERAS *********

const existeNombre = async ( nombre ) =>{

    const regex = new RegExp( nombre, 'i')
    const existeElNombre = await Cochera.findOne({ nombre: regex })
        if( existeElNombre ){
            throw new Error( `El nombre ${ nombre } ya está en uso`)
        }
}

const existeCocheraConDir = async ( direccion ) => {

    const regex = new RegExp( direccion, 'i')
    const existeDir = await Cochera.findOne({ direccion: regex }) 
    if( existeDir ){
        throw new Error(`La direccion: ${ direccion } ya se encuentra en uso`)
    }
}

const existeCocheraConId = async ( id ) =>{
    const existeLaCocheraXId = await Cochera.findById( id )
        if( !existeLaCocheraXId){
            throw new Error( `No existe una cochera con el id ${ id }`)
        }
}




module.exports = {
    existeUserConCorreo,
    existeUserConNombre,
    existeUserConId,
    existeVehiculoConPatente,
    existeVehiculoConId,
    existeNombre,
    existeCocheraConId,
    existeCocheraConDir
}