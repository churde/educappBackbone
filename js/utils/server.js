

app.server = {
    path: 'http://www.appio.es/xurde/Zend/projects/educapp/dev/public/api/',
    validateLogin: function(_args) {
alert("server.validateLogin, llamo a ajax")
        $.ajax({
            type: 'GET',
            url: this.path + 'login',
            data: _args.data,
            jsonp: 'callback',
// 'jsonp' type for CROSS DOMAIN !!! 
            dataType: 'jsonp',
            success: _args.success,
            error: function(data) {
                alert("error en validateLogin ")
                alert(data);
            }
        });
        
        alert("despues de haber llamado al ajax")
    },
    
    sendTaskQuestions: function(_args){
        
        $.ajax({
            type: 'GET',
            url: this.path + 'add-answers',
            data: {
                userId: 0,
                questions: _args.questions
            },
//            jsonp: 'callback',
// 'jsonp' type for CROSS DOMAIN !!! 
            dataType: 'jsonp',
            success: _args.success,
            error: function(data) {
                con("error: ", data)
            }
        });
        
    }
    
};