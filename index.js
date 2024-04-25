require('dotenv').config();
//require('./connection');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const users = require('./controller/usercontroller')
const chats = require('./model/chats')
const fs = require("fs");
const path = require("path");
const crypto = require('crypto');


const app = express();

app.use(express.json());

app.use(cors());

app.use(express.static(path.resolve(__dirname, 'client')));

app.use('/chatbg', express.static(path.join(__dirname, "/client/assets/img")));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'index.html'));
});

//app.post('/savechat', async (req, res) => {
async function savechat(mobile, chat, chatWithMobile) {
    try {
        //const { mobile, chat, chatWithMobile } = req.body; // Destructure mobile, chat, and chatWithMobile from req.body
        if (!mobile || !chat || !chatWithMobile) {
            return
            // return res.status(400).json({
            //     status: false,
            //     message: "Mobile, chat, or chatWithMobile is missing"
            // });
        }
      
        // Find the document corresponding to the mobile number
        let existingChat = await chats.findOne({ mobile: mobile,chatWithMobile:chatWithMobile });
        //console.log(existingChat)
        if (!existingChat) {
            const djsj = await chats.findOne({ mobile: chatWithMobile,chatWithMobile:mobile })
            
            if(djsj){
            const chatObj = {
                chat,
                chatWithMobile : mobile,
                createdAt: new Date() // Add createdAt timestamp
            };

            djsj.chat.push(chatObj);
        
            // Save the updated chat record
            const hek = await djsj.save();
            
            if(hek){
               return
                // return res.status(200).json({
                //     status : true,
                //     message : "Chat sent success"
                // })
            }
           } else {
            existingChat = await chats.create({ mobile: mobile,chatWithMobile:chatWithMobile, chat: [] });
           }
           

        }
        
        // Create the new chat object
        const chatObj = {
            chat,
            mobile,
            createdAt: new Date() // Add createdAt timestamp
        };

        // Push the new chat object to the existing chat array
        existingChat.chat.push(chatObj);
        
        // Save the updated chat record
       const hio = await existingChat.save();
        if(hio){
           return
        //res.status(200).json({ status: true, message: "Chat saved successfully" });
        }
    } catch (error) {
        console.error(error);
        //res.status(500).json({ status: false, message: "Internal server error" });
    }
}

app.post('/savedchatsss', async (req, res) => {
    try {
        const { mobile, chat, chatWithMobile } = req.body; // Destructure mobile, chat, and chatWithMobile from req.body
        if (!mobile) {
            return res.status(400).json({
                status: false,
                message: "Mobile, chat, or chatWithMobile is missing"
            });
        }
        
        const io = socketio(server)
        // Find the document corresponding to the mobile number
        let existingChat = await chats.findOne({ mobile: mobile,chatWithMobile:chatWithMobile });
        //console.log(existingChat)
        if (!existingChat) {
            const djsj = await chats.findOne({ mobile: chatWithMobile,chatWithMobile:mobile })
            
            if(djsj){
            const chatObj = {
                chat,
                chatWithMobile : mobile,
                createdAt: new Date() // Add createdAt timestamp
            };

            djsj.chat.push(chatObj);
        
            // Save the updated chat record
            const hek = await djsj.save();
            
            if(hek){
                io.on('connection', (socket) => {
                    socket.emit('notification', chatObj.chat)
                    res.sendFile(path.resolve(__dirname, 'client', 'index.html'));
                }) 
                return res.status(200).json({
                    status : true,
                    message : "Chat sent success"
                })
            }
           } else {
            existingChat = await chats.create({ mobile: mobile,chatWithMobile:chatWithMobile, chat: [] });
           }
           

        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal server error" });
    }

});


const server = app.listen(1337, () => {
    console.log('Server running!')
});

const io = socketio(server)

function deleteFileWithRetry(path, maxRetries = 3, delay = 1000) {
    function attemptDeletion(retriesLeft) {
      require('fs').unlink(path, (err) => {
        if (err) {
          if (retriesLeft > 0) {
            console.error(`Error deleting ${path}. Retrying... (${retriesLeft} retries left)`);
            setTimeout(() => attemptDeletion(retriesLeft - 1), delay);
          } else {
            console.error(`Failed to delete ${path} after multiple attempts: ${err.message}`);
          }
        } else {
          console.log(`Successfully deleted ${path}`);
        }
      });
    }
  
    attemptDeletion(maxRetries);
  }

io.on('connection', (socket) => { 
    socket.on('sendname', (username) => { 
        let parts = username.split(',');
        // console.log(parts[0])
        // console.log(parts[1])
        // console.log(parts[2])
        io.emit('sendname', (parts[0])); 
        
       // saving chat history in mongo db

       // savechat(parts[0],parts[2],parts[1])
    }); 
  
    socket.on('sendmessage', (chat,usrname,filename,originalname) => { 
        // console.log("chat ",chat)
        var randomUid = "";
        if(originalname != ""){
    //console.log("filename ",filename)
    const bytes = crypto.randomBytes(Math.ceil(50 / 2));
    randomUid = bytes.toString('hex').slice(0, 50);
    const extension = path.extname(originalname).toLowerCase();
    randomUid = randomUid + extension;
    const uploadPath = path.join(__dirname, "client/assets/img", randomUid);
    require("fs").writeFileSync(uploadPath, filename);
    io.emit('sendmessage', chat,usrname,randomUid); 
        } else {
        io.emit('sendmessage', chat,usrname,'');     
        }
        

        const imagePath = path.join(
            __dirname,
            "client/assets/img",
            randomUid
          );
          //deleteFileWithRetry(imagePath);
    }); 

    socket.on('typing', (name) => { 
        io.emit('typing', name);    
    });
}); 


// const io = socketio(server)

// io.on('connection', (socket) => {
//     console.log(`New connection: ${socket.id}`);

//     socket.emit('notification', 'Thanks for connecting to Codedamn!')

//     socket.on('message', (data) => {
//         console.log(`New message from ${socket.id}: ${data}`);
//     })

//     socket.on('notification', (data) => {
//         console.log(`${data}`);
//     })
// })