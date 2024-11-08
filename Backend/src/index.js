require('dotenv').config();
require('../config/db')
const express=require('express')
const authRouter=require('../routes/authRoute')
const profileRoute=require('../routes/profileRoute')
const announcements=require('../routes/announcementsRoute')
const searchRoute=require('../routes/searchRoute')
const eventRoute=require('../routes/eventRoute')
const resourcesRoutes=require('../routes/resourcesRoutes')

const port=process.env.PORT;
const app=express()
app.use(express.json())
app.use('/auth',authRouter)
app.use('/profile',profileRoute)
app.use('/announcements',announcements)
app.use('/search',searchRoute)
app.use('/events',eventRoute)
app.use('/resources',resourcesRoutes)
app.get('/',(req,res)=>{
    res.send("HELLO")
})
app.listen(port, ()=>{
    console.log(`Your app is listening at port ${port}`)
})