// server/routes/auth.js

const express = require("express");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

const router = express.Router();


// Ruta del archivo users.json

const usersFile = path.join(
    __dirname,
    "../data/users.json"
);





// Leer usuarios

function getUsers(){

    const data = fs.readFileSync(
        usersFile,
        "utf8"
    );


    return JSON.parse(data);

}






// Guardar usuarios

function saveUsers(users){


    fs.writeFileSync(

        usersFile,

        JSON.stringify(
            users,
            null,
            2
        )

    );


}








// =======================
// REGISTRO
// =======================


router.post(
    "/register",
    async(req,res)=>{


        try{


            const {
                username,
                email,
                password
            } = req.body;





            if(
                !username ||
                !email ||
                !password
            ){

                return res.status(400).json({

                    message:
                    "Completa todos los campos"

                });

            }






            let users = getUsers();





            const exists = users.find(

                user =>
                user.email === email

            );





            if(exists){


                return res.status(400).json({

                    message:
                    "El correo ya está registrado"

                });


            }







            const passwordHash =
            await bcrypt.hash(
                password,
                10
            );







            const newUser = {


                id: Date.now(),


                username,


                email,


                password:
                passwordHash,


                createdAt:
                new Date()


            };







            users.push(newUser);





            saveUsers(users);






            res.json({

                message:
                "Usuario registrado correctamente"

            });





        }catch(error){


            console.error(error);


            res.status(500).json({

                message:
                "Error en el servidor"

            });


        }


    }

);









// =======================
// LOGIN
// =======================


router.post(
    "/login",
    async(req,res)=>{


        try{


            const {
                email,
                password
            } = req.body;





            let users = getUsers();





            const user = users.find(

                user =>
                user.email === email

            );






            if(!user){


                return res.status(404).json({

                    message:
                    "Usuario no encontrado"

                });


            }







            const passwordCorrect =
            await bcrypt.compare(

                password,

                user.password

            );







            if(!passwordCorrect){


                return res.status(401).json({

                    message:
                    "Contraseña incorrecta"

                });


            }







            res.json({


                token:
                "token_" + user.id,



                user:{


                    id:
                    user.id,


                    username:
                    user.username,


                    email:
                    user.email


                }


            });






        }catch(error){


            console.error(error);


            res.status(500).json({

                message:
                "Error en el servidor"

            });


        }


    }

);






module.exports = router;