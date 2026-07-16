// client/js/socket.js


const socket = io();




// ==========================
// CONEXIÓN
// ==========================


socket.on(
"connect",
()=>{


    console.log(
        "🟢 Socket conectado:",
        socket.id
    );



    const user =
    localStorage.getItem("user");



    if(user){


        const userData =
        JSON.parse(user);



        socket.emit(
            "join",
            userData
        );



    }



});









// ==========================
// RECONEXIÓN
// ==========================


socket.on(
"reconnect",
()=>{


    console.log(
        "🔄 Socket reconectado"
    );



    const user =
    localStorage.getItem("user");



    if(user){


        socket.emit(

            "join",

            JSON.parse(user)

        );


    }



});









// ==========================
// DESCONEXIÓN
// ==========================


socket.on(
"disconnect",
(reason)=>{


    console.log(
        "🔴 Socket desconectado:",
        reason
    );


});









// ==========================
// ERROR
// ==========================


socket.on(
"connect_error",
(error)=>{


    console.error(

        "❌ Error Socket.IO:",

        error.message

    );


});