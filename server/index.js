// server/index.js


require("dotenv").config();


const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");

const { Server } = require("socket.io");



const app = express();

const server = http.createServer(app);



const io = new Server(server, {

    cors: {

        origin: "*",

        methods: [
            "GET",
            "POST"
        ]

    }

});




// ======================
// MIDDLEWARES
// ======================


app.use(cors());


app.use(
    express.json()
);




// ======================
// ARCHIVOS FRONTEND
// ======================


app.use(

    express.static(

        path.join(
            __dirname,
            ".."
        )

    )

);




// ======================
// RUTAS
// ======================


const authRoutes =
require("./routes/auth");


const usersRoutes =
require("./routes/users");


const messagesRoutes =
require("./routes/messages");


const privateRoutes =
require("./routes/private");




app.use(
    "/api/auth",
    authRoutes
);


app.use(
    "/api/users",
    usersRoutes
);


app.use(
    "/api/messages",
    messagesRoutes
);


app.use(
    "/api/private",
    privateRoutes
);






// ======================
// USUARIOS ONLINE
// ======================


let onlineUsers = [];









// ======================
// SOCKET.IO
// ======================


io.on(
"connection",
(socket)=>{


    console.log(
        "🟢 Conectado:",
        socket.id
    );





    // ======================
    // LOGIN SOCKET
    // ======================


    socket.on(
    "join",
    (user)=>{


        if(!user)
        return;





        socket.userId =
        user.id;



        socket.username =
        user.username;





        // quitar sesiones viejas


        onlineUsers =
        onlineUsers.filter(

            u =>
            u.id !== user.id

        );





        onlineUsers.push({

            id:
            user.id,


            username:
            user.username,


            socketId:
            socket.id


        });





        console.log(
            "Usuarios online:",
            onlineUsers
        );





        io.emit(

            "usersOnline",

            onlineUsers

        );



    });









    // ======================
    // CHAT PUBLICO
    // ======================


    socket.on(
    "sendMessage",
    (data)=>{


        console.log(
            "Mensaje público:",
            data
        );





        // enviar a TODOS

        io.emit(

            "newMessage",

            data

        );



    });









    // ======================
    // CHAT PRIVADO
    // ======================


    socket.on(
    "privateMessage",
    (data)=>{


        console.log(
            "Privado:",
            data
        );





        const receiver =
        onlineUsers.find(

            u =>
            u.id === data.receiverId

        );





        if(receiver){


            io.to(
                receiver.socketId
            )
            .emit(

                "privateMessage",

                data

            );



        }




        // devolver al emisor


        socket.emit(

            "privateMessage",

            data

        );



    });









    // ======================
    // DESCONECTAR
    // ======================


    socket.on(
    "disconnect",
    ()=>{


        console.log(
            "🔴 Desconectado:",
            socket.id
        );





        onlineUsers =
        onlineUsers.filter(

            u =>
            u.socketId !== socket.id

        );





        io.emit(

            "usersOnline",

            onlineUsers

        );



    });




});









// ======================
// PAGINA PRINCIPAL
// ======================


app.get(
"/",
(req,res)=>{


    res.sendFile(

        path.join(

            __dirname,

            "../index.html"

        )

    );


});









// ======================
// INICIAR SERVIDOR
// ======================


const PORT =
process.env.PORT || 3000;



server.listen(
PORT,
()=>{


    console.log(

        `🚀 Servidor iniciado en http://localhost:${PORT}`

    );


});