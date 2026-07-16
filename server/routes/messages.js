// server/routes/messages.js

const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();


// Archivo de mensajes

const messagesFile = path.join(
    __dirname,
    "../data/messages.json"
);




// Leer mensajes

function getMessages(){

    const data = fs.readFileSync(
        messagesFile,
        "utf8"
    );


    return JSON.parse(data);

}






// Guardar mensajes

function saveMessages(messages){


    fs.writeFileSync(

        messagesFile,

        JSON.stringify(
            messages,
            null,
            2
        )

    );


}









// =======================
// OBTENER MENSAJES
// =======================


router.get(
    "/",
    (req,res)=>{


        try{


            const messages = getMessages();


            res.json(messages);




        }catch(error){


            console.error(error);


            res.status(500).json({

                message:
                "Error obteniendo mensajes"

            });


        }


    }

);









// =======================
// CREAR MENSAJE
// =======================


router.post(
    "/",
    (req,res)=>{


        try{


            const {
                username,
                message
            } = req.body;






            if(
                !username ||
                !message
            ){

                return res.status(400).json({

                    message:
                    "Mensaje incompleto"

                });


            }







            let messages = getMessages();






            const newMessage = {


                id:
                Date.now(),


                username,


                message,



                date:
                new Date()


            };







            messages.push(newMessage);






            saveMessages(messages);






            res.json({

                message:
                "Mensaje guardado",


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