

app.loginController = {
    validateLogin: function(_args) {
        var isGuest = _args.isGuest;

        var user = $("#user").val();
        var password = $("#psw").val();

        var success = function(data) {

            if (data.status) {
                app.loginController.login(data.user);
                // Force initialize models
                app.router.modelsInitialized = null;
                app.router.navigate('/activity');

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
            alert("Acabas de logearte como invitado. Tus actividades no podrán ser corregidas")
            app.loginController.login({
                name: 'Invitado',
                isGuest: true
            });
            app.router.navigate('/activity', true);
        }


    },
    login: function(user) {
        app.dataModel.currentUser.set(app.utils.combineJson(user, {isLogged: true}));
    },
    logout: function() {
        app.dataModel.currentUser.clear();
        app.router.navigate('/login', true);
    }

}