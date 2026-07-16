// client/js/login.js


const loginBtn = document.getElementById(
    "login-btn"
);



loginBtn.addEventListener(
    "click",
    async()=>{


        const email =
        document.getElementById(
            "login-email"
        ).value.trim();



        const password =
        document.getElementById(
            "login-password"
        ).value.trim();






        if(
            !email ||
            !password
        ){

            alert(
                "Completa todos los campos"
            );

            return;

        }







        try{


            const response =
            await fetch(
                "http://localhost:3000/api/auth/login",
                {


                    method:"POST",


                    headers:{


                        "Content-Type":
                        "application/json"


                    },


                    body:JSON.stringify({

                        email,

                        password

                    })


                }
            );







            const data =
            await response.json();








            if(response.ok){



                alert(
                    "✅ Bienvenido " + data.user.username
                );





                // Guardar sesión


                localStorage.setItem(

                    "token",

                    data.token

                );




                localStorage.setItem(

                    "user",

                    JSON.stringify(
                        data.user
                    )

                );








                // Ocultar login


                document.getElementById(
                    "login-section"
                ).style.display="none";






                // Mostrar chat


                document.getElementById(
                    "chat-section"
                ).style.display="block";







                // Entrar al socket


                if(typeof joinChat === "function"){

                    joinChat();

                }







            }else{


                alert(
                    "❌ " + data.message
                );


            }







        }catch(error){


            console.error(error);


            alert(
                "Error conectando con el servidor"
            );


        }



    }

);











// Botón cambiar a registro


const showRegister =
document.getElementById(
    "show-register"
);



showRegister.addEventListener(
    "click",
    ()=>{


        document.getElementById(
            "login-section"
        ).style.display="none";



        document.getElementById(
            "register-section"
        ).style.display="block";



    }
);











// Mantener sesión al recargar


window.addEventListener(
    "load",
    ()=>{


        const user =
        localStorage.getItem(
            "user"
        );





        if(user){



            document.getElementById(
                "register-section"
            ).style.display="none";



            document.getElementById(
                "login-section"
            ).style.display="none";



            document.getElementById(
                "chat-section"
            ).style.display="block";




            if(typeof joinChat === "function"){

                joinChat();

            }



        }



    }
);