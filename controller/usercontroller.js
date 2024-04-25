const chats = require('../model/chats')

async function savechat(res, req){
    try{
        const {mobile, chat} = req.body
        if(!mobile || !chat){
            res.return.status(200).json({
                status : false,
                message: "chat is blank"
            })
        }
    const ischat = await chats.findOne({ mobile : mobile})
    let chati = {
        chat
    }
    if(!ischat){
    await chats.create({ mobile : mobile , chat : chati})
    } else {
    await chats.findOne({ mobile : mobile },{ $set : { chat : chati}})
    }
    
    } catch(error){

    }
}

module.exports = {
    savechat
}