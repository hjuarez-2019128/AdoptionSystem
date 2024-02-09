
'use strict' //Modo estricto
 
import User from './user.model.js'
import { encrypt, checkPassword, checkUpdate} from '../utils/validator.js'
 
export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}
 
export const register = async(req, res)=>{
    try{
        //Capturar el formulario (body)
        let data = req.body
        console.log(data)
        //Encriptar la contraseña
        data.password = await encrypt(data.password)
        //Asignar el rol por defecto
        data.role = 'CLIENT'
        //Guardar la información en la BD
        let user = new User(data)
        await user.save()
        //Responder al usuario
        return res.send({message: `Registered successfully, can be logged with email use ${user.username}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering user', err: err})
    }
}
 
 
export const login = async(req, res)=>{
    try {
        //Capturar los datos (body)
        let{ username, password } = req.body
 
        //Validar que el usuario existe
        let user = await User.findOne({username}) //buscar un solo registro. username: 'bmmaroquin'
 
        //verificar que la contraseña coincida
        if (user && await checkPassword(password, user.password)){
            let loggedUser ={
                username: user.username,
                name:user.name,
                role: user.role
            }
 
            //Respnda al usuario
            return res.send({message: `Welcome, ${loggedUser.name}`, loggedUser})  
        }
        return res.status(404).send({message: 'Invalid credentials'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to login'})
    }    
}

export const update = async(req, res)=>{
    try{
        //Obtener el id del usuario a actualizar
        let {id }  = req.params
        // Obtener los datos a actualizar
        let data = req.body
        //va;odadpr si data trae datos
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message: 'Have summitted some data that cannot be updated'})
        
        //Validar si tiene permisos (Tokenización)
        //Actualizar (BD)
        let updatedUser = await User.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        //Validar la actualización
        if(!updatedUser) return res.status(401).send({message: 'User not found and not updated'})
        //Respondo al usuario
            return res.send({message: 'update user', updatedUser})
    }catch(err){
        console.error(err)
        if(err.keyValue.username) return res.status(400).send({message: `Username ${err.keyValue.username} is already taken`})
        return res.status(500).send({message: 'Error update'})
    }    
}

export const deleteU = async(req, res)=>{
    try{
        //obtener id
        let {id} = req.params
        //validador si esta logrado y es el mismo x no lo vemos hoy x
        //Eliminar {deleteOne / FindOneAndDelete}
        let deletedUser = await User.findOneAndDelete({_id: id})
        // verificar que se elimino
        if(!deletedUser) return res.status(404).send({message: 'Account not found and not deleted'})
        //Responder
        return res.send({message: `Account with usernmae ${deletedUser.username} deleted successfully`})

    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error deleting account'})

    }
}