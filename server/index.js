import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import transactionsRoutes from './routes/transactionsRoutes.js';

const app = express();

app.use(express.json());
app.use(cors({
    origin:"*",
    credentials:true,
}))
dotenv.config();




// API's


app.use("/api/v1/transactions",transactionsRoutes);



mongoose.connect(process.env.MONGO_URI)
.then(() => {console.log("connected to mongodb...")})
.catch((error) => {console.log("error in connecting : ",error)})

const Port = process.env.PORT || 5000;


app.use((err, req, res, next)=> {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'something went wrong try again later';
    res.status(statusCode).json({ msg: message });
  });


app.listen(Port,() => console.log(`server is running on port ${Port}`))
