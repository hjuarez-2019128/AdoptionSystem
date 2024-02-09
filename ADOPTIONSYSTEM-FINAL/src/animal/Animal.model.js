import mongoose from "mongoose"

const AnimalSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    race: {
        type: String,
        required: true
    },

    nickname:{
        type: String,
        required: true
    },
    age:{
        type: String,
        required: true
    },
    sex:{
        type: String,
        required: true
    },

    keeper:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    
})

//pre mongoose
 //pluralizar
export default mongoose.model('Animal', AnimalSchema)