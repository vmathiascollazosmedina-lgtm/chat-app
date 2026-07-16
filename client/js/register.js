// client/js/register.js


const registerBtn = document.getElementById(
    "register-btn"
);



registerBtn.addEventListener(
    "click",
    async()=>{


        const username =
        document.getElementById(
            "register-username"
        ).value.trim();



        const email =
        document.getElementById(
            "register-email"
        ).value.trim();



        const password =
        document.getElementById(
            "register-password"
        ).value.trim();







        if(
            !username ||
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
                "http://localhost:3000/api/auth/register",
                {

                    method:"POST",


                    headers:{

                        "Content-Type":
                        "application/json"

                    },


                    body:JSON.stringify({

                        username,

                        email,

                        password

                    })

                }
            );







            const data =
            await response.json();








            if(response.ok){


                alert(
                    "✅ Cuenta creada correctamente"
                );




                // Limpiar campos


                document.getElementById(
                    "register-username"
                ).value="";



                document.getElementById(
                    "register-email"
                ).value="";



                document.getElementById(
                    "register-password"
                ).value="";







                // Cambiar a login


                document.getElementById(
                    "register-section"
                ).style.display="none";



                document.getElementById(
                    "login-section"
                ).style.display="block";






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











// Botón para ir al login


const showLogin =
document.getElementById(
    "show-login"
);



showLogin.addEventListener(
    "click",
    ()=>{


        document.getElementById(
            "register-section"
        ).style.display="none";



        document.getElementById(
            "login-section"
        ).style.display="block";



    }
);