// server/routes/private.js


const express = require("express");
const fs = require("fs");
const path = require("path");


const router = express.Router();



// Archivo de mensajes privados

const privateFile = path.join(
    __dirname,
    "../data/privateMessages.json"
);





// Leer mensajes

function getPrivateMessages(){


    const data =
    fs.readFileSync(
        privateFile,
        "utf8"
    );


    return JSON.parse(data);


}






// Guardar mensajes

function savePrivateMessages(messages){


    fs.writeFileSync(

        privateFile,

        JSON.stringify(
            messages,
            null,
            2
        )

    );


}









// =================================
// OBTENER CONVERSACION PRIVADA
// =================================


router.get(
    "/:user1/:user2",
    (req,res)=>{


        try{


            const {
                user1,
                user2
            } = req.params;





            const messages =
            getPrivateMessages();







            const chat =
            messages.filter(

                msg =>

                (
                    msg.senderId == user1 &&
                    msg.receiverId == user2
                )

                ||

                (
                    msg.senderId == user2 &&
                    msg.receiverId == user1
                )

            );






            res.json(chat);




        }catch(error){


            console.error(error);


            res.status(500).json({

                message:
                "Error obteniendo conversación"

            });


        }



    }

);











// =================================
// GUARDAR MENSAJE PRIVADO
// =================================


router.post(
    "/",
    (req,res)=>{


        try{


            const {

                senderId,

                receiverId,

                sender,

                message


            } = req.body;






            if(

                !senderId ||

                !receiverId ||

                !message

            ){


                return res.status(400).json({

                    message:
                    "Datos incompletos"

                });


            }








            let messages =
            getPrivateMessages();







            const newMessage = {


                id:
                Date.now(),


                senderId,


                receiverId,


                sender,


                message,



                date:
                new Date()



            };








            messages.push(
                newMessage
            );






            savePrivateMessages(
                messages
            );






            res.json({

                message:
                "Mensaje privado guardado",


                data:
                newMessage


            });





        }catch(error){


            console.error(error);


            res.status(500).json({

                message:
                "Error guardando mensaje"

            });


        }


    }

);






module.exports = router;