
function con() {
    try {
        for (var i = 0, l = arguments.length; i < l; i++) {
            console.log(arguments[i])
        }
    }
    catch (e) {
    }
}

function err(e) {
    con("Error " + e.message + " en la linea " + e.lineNumber + " del archivo " + e.fileName)
}

app.utils = {
    formatDate: function(_args){
        var date = _args.date, format = _args.format;
        
        var oDate = new Date(date);
        
        return oDate.toString(format);
                
    },
            
            /* This function combines 2 json, having the second object preference over the first one*/
    combineJson: function(/*Object*/obj1, /*Object...*/obj2) {

        for (var p in obj2) {
            if (obj2.hasOwnProperty(p)) {
                obj1[p] = typeof obj2[p] === 'object' ? utils.combineJson(obj1[p], obj2[p]) : obj2[p];
            }
        }
        return obj1;
    }
}


window.utils = {

    // Asynchronously load templates located in separate .html files
    loadTemplate: function(views, callback) {

        var deferreds = [];

        $.each(views, function(index, view) {
            if (window[view]) {
                deferreds.push($.get('tpl/' + view + '.html', function(data) {
                    window[view].prototype.template = _.template(data);
                }));
            } else {
                alert(view + " not found");
            }
        });
alert("dentro de LoadTemaplate llamo al callback")
        $.when.apply(null, deferreds).done(callback);
    },

    uploadFile: function (file, callbackSuccess) {
        var self = this;
        var data = new FormData();
        data.append('file', file);
        $.ajax({
            url: 'api/upload.php',
            type: 'POST',
            data: data,
            processData: false,
            cache: false,
            contentType: false
        })
        .done(function () {
            console.log(file.name + " uploaded successfully");
            callbackSuccess();
        })
        .fail(function () {
            self.showAlert('Error!', 'An error occurred while uploading ' + file.name, 'alert-error');
        });
    },

    displayValidationErrors: function (messages) {
        for (var key in messages) {
            if (messages.hasOwnProperty(key)) {
                this.addValidationError(key, messages[key]);
            }
        }
        this.showAlert('Warning!', 'Fix validation errors and try again', 'alert-warning');
    },

    addValidationError: function (field, message) {
        var controlGroup = $('#' + field).parent().parent();
        controlGroup.addClass('error');
        $('.help-inline', controlGroup).html(message);
    },

    removeValidationError: function (field) {
        var controlGroup = $('#' + field).parent().parent();
        controlGroup.removeClass('error');
        $('.help-inline', controlGroup).html('');
    },

    showAlert: function(title, text, klass) {
        $('.alert').removeClass("alert-error alert-warning alert-success alert-info");
        $('.alert').addClass(klass);
        $('.alert').html('<strong>' + title + '</strong> ' + text);
        $('.alert').show();
    },

    hideAlert: function() {
        $('.alert').hide();
    }

};