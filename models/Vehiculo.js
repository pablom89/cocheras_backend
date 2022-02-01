const { Schema, model } = require('mongoose');

// como debe lucir un vehiculo en mi DB:

/* 

    {
        "vehículo": "auto/camioneta/camion/colectivo...etc",
        "marca": "Ford",
        "patente":"ab 123 cd"
        "seguro": true/false
    }

*/

const vehiculoSchema = Schema({

    clase: {
        type: String,
        required: true,
    },
    
    
    patente: {
        type: String,
        required: true,
        unique: true   
    },

    seguro:{
        type: Boolean,
        required: true
    },

    marca: {
        type: String,
        default: 'Otro'
    },

    modelo:{
        type: String,
        default: 'generico'
    },

    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    estado:{
        type: Boolean,
        default: true
    }

});

vehiculoSchema.methods.toJSON = function(){
  const { __v, password, _id, ...vehiculo } = this.toObject();
  vehiculo.id = _id
  return vehiculo;
}

module.exports = model( 'Vehiculo', vehiculoSchema )
