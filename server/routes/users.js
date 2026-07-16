// server/routes/users.js

const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();


// Archivo de usuarios

const usersFile = path.join(
    __dirname,
    "../data/users.json"
);




// Obtener lista de usuarios

router.get(
    "/",
    (req,res)=>{


        try{


            const users = JSON.parse(

                fs.readFileSync(
                    usersFile,
                    "utf8"
                )

            );





            const usersList = users.map(
                user => ({

                    id: user.id,

                    username: user.username,

                    email: user.email,

                    createdAt: user.createdAt

                })
            );






            res.json(usersList);





        }catch(error){


            console.error(error);


            res.status(500).json({

                message:
                "Error obteniendo usuarios"

            });


        }


    }

);






module.exports = router;