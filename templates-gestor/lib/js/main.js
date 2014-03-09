/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var app;

app = {
    edit: {
        init: function() {
            
        }
    },
    correccion: {
        init: function() {
            app.addTooltip('myId', 'myTitle', 'fdsa');
        }
    },
    panel: {
        init: function() {
            app.addTooltip('myId', 'myTitle', 'fdsa');
            app.addTooltip('myId', 'myTitle', 'fdsa');
            app.addTooltip('myId', 'myTitle', 'fdsa');
        }
    },
    addTooltip: function(id, title, placement) {
        $('#' + id).tooltip({
            title: title,
            placement: placement
        });
    }

};
