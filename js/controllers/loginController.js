app.loginController = {
    validateLogin: function(_args) {

        var isGuest = _args.isGuest;

        var user = $("#user").val();
        var password = $("#psw").val();

        var success = function(data) {
            if (data.status) {
                app.loginController.login(data.user);
                app.router.navigate('', true);
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
            app.loginController.login({
                name: 'Invitado',
                isGuest: true
            });
            app.router.navigate('', true);
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
