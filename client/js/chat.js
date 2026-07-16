// client/js/chat.js


const messagesBox =
document.getElementById("messages");


const messageInput =
document.getElementById("message-input");


const sendBtn =
document.getElementById("send-btn");


const publicBtn =
document.getElementById("public-chat-btn");


const privateBtn =
document.getElementById("private-chat-btn");


const usersList =
document.getElementById("users-list");


const privateUsers =
document.getElementById("private-users");


const chatTitle =
document.getElementById("chat-title");


const replyBox =
document.getElementById("reply-box");


const replyText =
document.getElementById("reply-text");


const cancelReply =
document.getElementById("cancel-reply");





let currentUser =
JSON.parse(
    localStorage.getItem("user")
);



let chatMode = "public";


let privateUser = null;


let replyTo = null;







// =============================
// BOTON CHAT PUBLICO
// =============================


publicBtn.onclick = ()=>{


    chatMode = "public";


    privateUser = null;


    chatTitle.textContent =
    "🌎 Chat Público";


    loadPublicMessages();


};









// =============================
// BOTON CHAT PRIVADO
// =============================


privateBtn.onclick = ()=>{


    chatMode = "private";


    chatTitle.textContent =
    "🔒 Chat Privado";


    privateUsers.style.display =
    "block";


};









// =============================
// USUARIOS ONLINE
// =============================


socket.on(
"usersOnline",
(users)=>{


    usersList.innerHTML = "";



    users.forEach(
    user=>{


        if(
            currentUser &&
            user.id === currentUser.id
        )
        return;





        const li =
        document.createElement("li");



        li.textContent =
        "🟢 " + user.username;





        li.onclick = ()=>{


            privateUser = user;


            chatMode = "private";



            chatTitle.textContent =

            "🔒 Chat con "
            +
            user.username;




            loadPrivateMessages();



        };




        usersList.appendChild(li);



    });


});









// =============================
// MENSAJE PUBLICO RECIBIDO
// =============================


socket.on(
"newMessage",
(message)=>{


    console.log(
        "Mensaje recibido:",
        message
    );



    addMessage(message);



});









// =============================
// MENSAJE PRIVADO RECIBIDO
// =============================


socket.on(
"privateMessage",
(message)=>{


    addMessage({

        username:
        message.sender,


        message:
        message.message,


        replyTo:
        message.replyTo


    });



});









// =============================
// ENVIAR MENSAJE
// =============================


async function sendMessage(){



    const text =
    messageInput.value.trim();




    if(!text)
    return;






    if(!currentUser){

        alert(
            "No hay usuario conectado"
        );

        return;

    }








    // PUBLICO


    if(chatMode === "public"){



        const data = {


            username:
            currentUser.username,


            message:
            text,


            replyTo:
            replyTo



        };





        socket.emit(

            "sendMessage",

            data

        );




  await fetch(

    "http://localhost:3000/api/messages",

    {

        method:"POST",

        headers:{

            "Content-Type":"application/json"

        },

        body: JSON.stringify(data)

    }

);




    }








    // PRIVADO


    else{



        if(!privateUser){


            alert(
                "Selecciona un usuario"
            );


            return;


        }






        const data = {


            sender:
            currentUser.username,


            senderId:
            currentUser.id,


            receiverId:
            privateUser.id,


            message:
            text,


            replyTo:
            replyTo



        };





        socket.emit(

            "privateMessage",

            data

        );



    }







    messageInput.value = "";


    clearReply();



}









// =============================
// BOTON ENVIAR
// =============================


sendBtn.onclick =
sendMessage;









// =============================
// ENTER
// =============================


messageInput.addEventListener(
"keydown",
(e)=>{


    if(
        e.key === "Enter"
        &&
        !e.shiftKey
    ){


        e.preventDefault();


        sendMessage();


    }


});









// =============================
// CREAR MENSAJE
// =============================


function addMessage(data){



    const div =
    document.createElement("div");



    div.className =
    "message";







    if(
        data.username ===
        currentUser.username
    ){

        div.classList.add(
            "own"
        );


    }
    else{


        div.classList.add(
            "other"
        );


    }







    let replyHTML = "";



    if(data.replyTo){


        replyHTML = `

        <div class="reply-message">

        ↩ ${data.replyTo.username}

        <br>

        ${data.replyTo.message}

        </div>

        `;


    }







    div.innerHTML = `

    <div class="message-user">

    ${data.username}

    </div>


    ${replyHTML}


    <div class="message-text">

    ${data.message}

    </div>


    <button class="reply-btn">

    ↩ Responder

    </button>


    `;









    div.querySelector(
        ".reply-btn"
    )
    .onclick = ()=>{


        replyTo = {


            username:
            data.username,


            message:
            data.message


        };



        replyBox.style.display =
        "flex";



        replyText.textContent =

        "Respondiendo a "
        +
        data.username;



    };






    messagesBox.appendChild(div);



    messagesBox.scrollTop =
    messagesBox.scrollHeight;



}









// =============================
// CARGAR MENSAJES PUBLICOS
// =============================


async function loadPublicMessages(){



    messagesBox.innerHTML = "";



    const res =
    await fetch(
        "/api/messages"
    );



    const data =
    await res.json();



    data.forEach(
        addMessage
    );


}









// =============================
// CARGAR PRIVADOS
// =============================


async function loadPrivateMessages(){


    if(!privateUser)
    return;



    messagesBox.innerHTML = "";



    const res =
    await fetch(

    `/api/private/${currentUser.id}/${privateUser.id}`

    );



    const data =
    await res.json();



    data.forEach(
    msg=>{


        addMessage({

            username:
            msg.sender,


            message:
            msg.message,


            replyTo:
            msg.replyTo


        });


    });


}









// =============================
// CANCELAR RESPUESTA
// =============================


cancelReply.onclick =
clearReply;



function clearReply(){


    replyTo = null;


    replyBox.style.display =
    "none";


    replyText.textContent =
    "";


}









// =============================
// INICIO
// =============================


window.addEventListener(
"load",
()=>{


    privateUsers.style.display =
    "none";


    loadPublicMessages();


});