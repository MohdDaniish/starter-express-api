// const socket = io();

// //socket.emit('message', 'Hi Danish');

// socket.on('notification', (data) => {
//     console.log("testing data ",data)
//     console.log(`New notification: ${data}`);
// })

//socket.emit('notification', 'Helllllow again')

	let socket = io(); 

	let form = document.getElementById('form'); 
	let myname = document.getElementById('myname'); 
	let friendname = document.getElementById('friendname'); 
	let message = document.getElementById('message'); 
	let messageArea = document.getElementById("messageArea"); 
	let typrea = document.getElementById("typtxt"); 
    var fileName = "";
    var originalname = "";

	form.addEventListener("submit", (e) => { 
		e.preventDefault(); 
		if (message.value || fileName) { 
            document.getElementById('savenumber').value = myname.value
            document.getElementById('friendnumber').value = friendname.value

        // for image
            console.log(fileName.name)
            if(fileName != ""){
                originalname = fileName.name
            }
        // for image


			socket.emit('sendname', myname.value+","+friendname.value+","+message.value); 
			socket.emit('sendmessage', message.value,myname.value,fileName,originalname); 
			message.value = ""; 
            if(document.getElementById('savenumber').value != ""){
                myname.style.display = "none"
            }
            if(document.getElementById('friendnumber').value != ""){
                friendname.style.display = "none"
            }
		} 
	}); 

	socket.on("sendname", (username) => { 
		let name = document.createElement("p"); 
		// name.style.backgroundColor = "grey"; 
		// name.style.width = "100%"; 
        if(myname.value != username){
		name.style.textAlign = "left"; 
        } else {
        name.style.textAlign = "right";  
        name.style.marginTop = "5px"  
        }
		//name.style.color = "white"; 
        name.style.fontStyle = "italic";
        name.style.fontStyle = "strong";
        //console.log("username ",username)
		name.textContent = username; 
		messageArea.appendChild(name); 
        
	}); 

	socket.on("sendmessage", (chat,usrname,img) => { 
		let chatContent = document.createElement("p"); 
        let imgElement = document.createElement("img");
        //console.log("clint side ",chat)
        if(myname.value != usrname){
        chatContent.style.textAlign = "left"; 
        } else {
        chatContent.style.textAlign = "right"; 
        chatContent.style.marginRight = "5px";
        imgElement.style.float = "inline-end"; 
        }
        
        message.focus();
		chatContent.textContent = chat; 
		messageArea.appendChild(chatContent);
        console.log("imgurl :: ",img)
        if(img != ""){
        let div = document.createElement("div");
        imgElement.src = "chatbg/"+img; 
        imgElement.width = 150; 
        imgElement.height = 150;
        div.appendChild(imgElement);
        messageArea.appendChild(div);
        }
        messageArea.scrollTop = messageArea.scrollHeight; 
        document.getElementById('fileInput').value = "";
        fileName = "";
        originalname = "";
        typrea.textContent = "";
	}); 

    socket.on("typing", (name) => { 
        if(name != myname.value){
        let ppp = document.createElement("p"); 
        typrea.textContent = "";
        ppp.style.fontStyle = "italic";
		ppp.textContent = name+" Typing.."; 
		typrea.appendChild(ppp);
        }
    });

    function showtypin(){
        typrea.textContent = "";
        socket.emit('typing', myname.value); 
    }

    function handleFileInputChange(event) {
      fileName = event.target.files[0];
        // const reader = new FileReader();
  
        // // Read the file as a data URL
        // reader.readAsDataURL(file);
  
        // // When file reading is complete
        // reader.onload = function() {
        //   const imageData = reader.result;
        //   // Send the image data to the server via Socket.IO
        //   socket.emit('uploadImage', { imageData });
        // };
      }

    

