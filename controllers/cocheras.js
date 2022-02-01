
const Cochera = require('../models/Cochera');
const { esElMismo } = require('../helpers/chequeoUsuario');

const obtenerCocheras = async ( req, res ) => {

    const { 
            limite = 5, 
            desde = 0, 
            techada = false ,
            seguro = false 
            } = req.query;
   
    try {
        const [ total, cocheras] = await Promise.all([
            Cochera.countDocuments({ estado: true }),
            Cochera.find({ estado: true , techada: techada , seguro: seguro })
                .limit(Number(limite))
                .skip(Number(desde))
        ])
        
        res.status(201).json({
            total,
            cocheras
        })

    } catch (error) {
        console.log( error )
        res.status(500).json({
            msg: 'comunicarse con el adm de bd'
        })
    }

}

const obtenerCocherasFiltradas = async ( req, res ) =>{

    const { 
            lng,
            lat, 
            mts
           } = req.query;

            const cocheras = await Cochera.aggregate().near({
            near:{type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
            spherical: true,
            distanceField: "dist.calculated",
            distanceMultiplier: 0.001,
            maxDistance: parseFloat(mts),
            query: { estado: true },
            }).project( { '_id': 0, "location":0  , '__v': 0, 'createdAt': 0, 'updatedAt': 0})
            .addFields({'dist_kms': '$dist.calculated'})
            
            

          /****** I was trying to do something like this, but didn't work, I left it here as a reminder, to solve it someday with more time 

            // Moongose docs i.e :
            query.where('loc').near({ center: [10, 10], maxDistance: 5, spherical: true });

            It appears that radius value is in radiands :/, need to check that

            const area = { center: [ parseFloat(lng), parseFloat(lat)] , radius: 0.5, unique: true, spherical: true };

            const cocheras = await Cochera.find().where('location').within().circle(area) */

        /******************************************************************************************************** */
        

          
       /*  This works fine.. */

            /* const cocheras = await Cochera.find()
            .where({ estado: true })
            .where('location').near({
            center: { type: 'Point', coordinates: [ parseFloat(lng), parseFloat(lat) ]},
            maxDistance: parseFloat(mts),
            spherical: true
            }) */
        

        /* This also works fine..

           const cocheras = await Cochera.find().where( {location: {
           $nearSphere:{
           $geometry:{ type: 'Point', coordinates: [ parseFloat(lng), parseFloat(lat) ]},
           $maxDistance: parseFloat(mts)
           }
        } }) */ 

   res.status(200).json({
       
       resultados: (cocheras) ? cocheras : []
   })

}

// Obtiene las cocheras de un cierto usuario
const obtenerCocherasUser = async ( req, res ) =>{

    const { _id : idUser } = req.usuario;
    const query = { usuario: idUser, estado: true }

    try {
        const [ total, cocheras ] = await Promise.all([
            Cochera.find(query).countDocuments(),
            Cochera.find(query)
        ])

        res.status(200).json({
            total,
            cocheras
        })
    } catch (error) {
        console.log( error )
        return res.status(500).json({
            msg: 'Comunicarse con el adm'
        })
    }
    
}

const obtenerCocheraxId = async( req, res ) => {

    const { id } = req.params;

    try {
        
        const cocheraID = await Cochera.findById( id )

        return res.status(201).json({
            cocheraID
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Comunicarse con el adm'
        })
    }


}

const eliminarCochera = async( req, res ) => {

    const { id } = req.params;
    
    const verificar = await esElMismo( req )

    if( !verificar ){
        return res.status(401).json({
            msg: 'No puedes realizar esta accion'
        })
    }
    
  
    const cochera = await Cochera.findByIdAndUpdate( id , { estado : false }, { new: true })
    res.status(200).json({
        msg: 'La cochera ha sido eliminada',
        cochera
    })
    
}

const crearCochera = async ( req, res ) => {

    const body = req.body;
    const { _id : idUSer } = req.usuario;
    body.usuario = idUSer;


    const cochera = await new Cochera( body )
    
    await cochera.save()
    return res.status(201).json({
        msg: 'Cochera creada exitosamente',
        cochera
    })
    
}

const editarCochera = async ( req, res ) => {

    // Ver como modificar la dirección, xq debe concordar con las coords
    const { id } = req.params;
    const { nombre, 
            techada,
            location } = req.body;
    
    const verificar = await esElMismo( req )

    if( !verificar ){
        return res.status(401).json({
            msg: 'No puedes realizar esta accion'
        })
    }
    
    const regex = new RegExp( nombre, 'i');
   
    const cocheradb = await Cochera.find().where('_id').ne( id ).where({ nombre: regex })
                                      
    if( cocheradb.length > 0 ){
        return res.status(400).json({
            msg: `El nombre -${nombre}- no está disponible`
        })
    }

   const cochera = await Cochera.findByIdAndUpdate( id, { nombre: nombre , techada: techada, location: location }, { new: true })
    
    res.status(200).json({
        msg: 'Los datos han sido modificados',
        cochera
    })
 
}

module.exports = {

    crearCochera,
    editarCochera,
    obtenerCocheras,
    obtenerCocheraxId,
    eliminarCochera,
    obtenerCocherasUser,
    obtenerCocherasFiltradas

}