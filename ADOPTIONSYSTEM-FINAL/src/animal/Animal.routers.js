import express from 'express';
import { testAnimal, createAnimal, getAllAnimalsDB, searchAnimal, updateAnimal, deleteAnimal} from './Animal.Controller.js';

const animal = express.Router();

animal.get('/testAnimal', testAnimal)
animal.post('/animal', createAnimal);
animal.get('/listAnimals', getAllAnimalsDB);
animal.get('/search', searchAnimal);
animal.put('/updateAnimal/:id', updateAnimal);
animal.delete('/deleteAnimal/:id', deleteAnimal)

export default animal;

