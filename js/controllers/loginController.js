

app.loginController = {
    validateLogin: function(_args) {

        alert("en la funcion de login.validateLogin")

//app.router.navigate('/activity');
//return;

        try {
            var isGuest = _args.isGuest;

            var user = $("#user").val();
            var password = $("#psw").val();

            var success = function(data) {

                alert("en el success de validateLogin")

                if (data.status) {
                    app.loginController.login(data.user);

//                alert("pongo usuario como logeado y en 1 segundo redirijo a activity");

                    window.setTimeout(function() {
                        app.router.navigate('/activity');
                    }, 1000);

                }
                else {
                    alert("Login incorrecto");
                    app.dataModel.currentUser.set({isLogged: false});
                }
            }

            if (!isGuest) {

                app.server.validateLogin({
                    data: {
                        user: user,
                        password: password
                    },
                    success: success
                });
            }
            else {
                alert("SI ES GUEST")
                app.loginController.login({
                    name: 'Invitado',
                    isGuest: true
                });
                app.router.navigate('/activity', true);
            }
        } catch (e) {
            alert(e)
        }







    },
    login: function(user) {
        alert("en app.login pongo al usuario como logeado")
        app.dataModel.currentUser.set(app.utils.combineJson(user, {isLogged: true}));
        alert("en app.login despues de poner al usuario como logueado")
    },
    logout: function() {
        app.dataModel.currentUser.clear();
        app.router.navigate('/login', true);
    }



}
