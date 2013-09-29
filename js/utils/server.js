

app.server = {
    path: 'http://www.appio.es/xurde/Zend/projects/educapp/dev/public/api/',
    validateLogin: function(_args) {

        $.ajax({
            type: 'GET',
            url: this.path + 'login',
            data: _args.data,
//            jsonp: 'callback',
// 'jsonp' type for CROSS DOMAIN !!! 
            dataType: 'jsonp',
            success: _args.success,
            error: function(data) {
                alert("error en validateLogin ")
                alert(data);
            }
        });
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
//    ajax: function(_args) {
//        $.ajax({
//            type: _args.type || 'GET',
//            // Here we have to use the oembed API, because the simple API  (e.g.  api/v2 ) don't work for private videos
//            url: _args.url,
//            jsonp: _args.jsonp || 'callback',
//            dataType: _args.dataType || 'jsonp',
//            success: _args.success || function(data) {
//
//
//            },
//            error: _args.error || function(data) {
//                con("error: ", data)
//            }
//        });
//    }
}