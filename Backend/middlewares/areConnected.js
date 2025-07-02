const Connections=require('../models/connections')

const areConnected=async (userA, userB) => {
    const connection=await Connections.findOne({
        $or:[
            {user1:userA, user2:userB},
            {user1:userB, user2:userA}
        ]
    })

    return !!connection
}

module.exports=areConnected;