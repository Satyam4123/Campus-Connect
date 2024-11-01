require('dotenv').config();
require('../config/db')
const express=require('express')
const authRouter=require('../routes/authRoute')
const profileRoute=require('../routes/profileRoute')

const port=process.env.PORT;
const app=express()
app.use(express.json())
app.use('/auth',authRouter)
app.use('/profile',profileRoute)
app.get('/',(req,res)=>{
    res.send("HELLO")
})
app.listen(port, ()=>{
    console.log(`Your app is listening at port ${port}`)
})