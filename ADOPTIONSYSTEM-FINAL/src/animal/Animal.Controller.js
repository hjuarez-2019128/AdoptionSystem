import Animal from './Animal.model.js';
import User from '../user/user.model.js'; // Ensure to import your User model
import { checkUpdate } from '../util/validator.js'

export const testAnimal = (req, res)=>{
    console.log('test is running')
    return res.send({message: 'Test is running in animal'})
}

// Crear animal
export const createAnimal = async (req, res) => {
    try {
        const { name, race, nickname, age, sex, keeper } = req.body;
        // Verificar si el cuidador existe
        const existingKeeper = await User.findById(keeper);
        if (!existingKeeper) {
            return res.status(400).json({ message: "Caregiver not found" });
        }
        // Crear un nuevo animal
        const animal = new Animal({
            name,
            race,
            nickname,
            age,
            sex,
            keeper
        });
        await animal.save();
        res.status(201).json({ message: "Successfully created animal", animal });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating animal", error });
    }
};

// Obtener todos los animales de la DB
export const getAllAnimalsDB = async (req, res) => {
    try {
        const animals = await Animal.find();
        res.json(animals);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error getting animals", error });
    }
};

// Controlador para buscar un animal según un parámetro de búsqueda search
export const searchAnimal = async (req, res) => {
    try {
        // Obtén el parámetro de búsqueda desde la solicitud
        const searchParam = req.query.search;

        // Realiza la búsqueda de animales que coincidan con el parámetro de búsqueda
        const animals = await Animal.find({ name: { $regex: searchParam, $options: 'i' } });

        // Si no se encuentran animales que coincidan con la búsqueda, envía un mensaje de error
        if (animals.length === 0) {
            return res.status(404).send({ message: 'No animals found matching the search' });
        }

        // Si se encuentran animales que coincidan, envía la lista de animales
        return res.status(200).send(animals);
    } catch (error) {
        console.error(error);
        // Si ocurre algún error durante el proceso, envía un mensaje de error
        return res.status(500).send({ message: 'Error when searching for animals' });
    }
};



// ACTUALIZAR
export const updateAnimal = async (req, res) => {
    try {
        // Obtener el ID del animal a actualizar
        let { id } = req.params;
        // Obtener los datos a actualizar del cuerpo de la solicitud
        let data = req.body;
        // Validar si se han enviado datos para actualizar
        let update = checkUpdate(data, id);
        if (!update) {
            return res.status(400).send({ message: 'Data has been sent that cannot be updated' });
        }
        
        // Validar si el animal existe en la base de datos
        let animalActualizado = await Animal.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        );
        if (!animalActualizado) {
            return res.status(404).send({ message: 'Animal not found or not updated' });
        }
        return res.send({ message: 'Animal updated successfully', animalActualizado });
    } catch (err) {
        console.error(err);
        if (err.keyValue.name) {
            return res.status(400).send({ message: `name "${err.keyValue.name}" existen` });
        }
        return res.status(500).send({ message: 'Error updating animal' });
    }
};

// Eliminar Delete Animal

export const deleteAnimal = async (req, res) => {
    try {
        // Obtiene ID
        let { id } = req.params;
        
        let deletedAnimal = await Animal.findOneAndDelete({ _id: id });
      
        if (!deletedAnimal) return res.status(404).send({ message: 'Animal not found and not deleted' });
       
        return res.send({ message: `Animal with name ${deletedAnimal.name} deleted successfully` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting animal' });
    }
};






