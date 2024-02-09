//Configuración a la conexión a la BD
//EsModules
'use strict'
import  express  from "express"
import morgan from "morgan"
import helmet from "helmet"
import  Cors from "cors"
import { config } from "dotenv";
import userRoutes from '../src/user/user.routes.js'
import animalRoutes from '../src/animal/Animal.routers.js'

// Configuraciones
const app = express()
config();
const port = process.env.PORT || 3056

// Configración del servidor

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(Cors())
app.use(helmet())
app.use(morgan('dev'))

//Declaración de rutas
app.use(userRoutes)
app.use(animalRoutes)

// Levantar el Servidor
export const initServer = ()=>{
    app.listen(port)
    console.log(`Server HTTP running in port ${port}`)
}


