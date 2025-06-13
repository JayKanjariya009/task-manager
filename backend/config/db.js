const mongoose =  require('mongoose')

const connectDb =   async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Mongo Db Connected ");
        
    } catch (error) {
        console.log("Error ocurred while connedcting db", error);
        
    }
}

module.exports =  connectDb