require('dotenv').config();
require('../config/db')
const express=require('express')
const passport=require('../config/passport')
const authRouter=require('../routes/authRoute')
const profileRoute=require('../routes/profileRoute')
const announcements=require('../routes/announcementsRoute')
const searchRoute=require('../routes/searchRoute')
const eventRoute=require('../routes/eventRoute')
const resourcesRoutes=require('../routes/resourcesRoutes');
const voiceInteration=require('../routes/voiceInteraction')
const session=require('express-session')
const cors=require('cors')
const port=process.env.PORT;
const app=express()
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);
app.use(express.json())
app.use(
    session({
        secret:process.env.SESSION_SECRET,
        resave:false,
        saveUninitialized:true
    })
)
app.use(passport.initialize())
app.use(passport.session())

app.use('/auth',authRouter)
app.use('/profile',profileRoute)
app.use('/announcements',announcements)
app.use('/search',searchRoute)
app.use('/events',eventRoute)
app.use('/resources',resourcesRoutes)
app.use('/voice',voiceInteration)

app.listen(port, ()=>{
})
console.log(`Your app is listening at port ${port}`)