/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

 var app = {
    edit: {
        init: function() {

            $('#initDateInEdit').datepicker({
                format: "dd-mm-yy",
                weekStart: 1,
                todayBtn: "linked",
                todayHighlight: "true",
                language: "es",
                autoclose: true
            });

            $('#deliveryDateInEdit').datepicker({
                format: "dd-mm-yy",
                weekStart: 1,
                todayBtn: "linked",
                todayHighlight: "true",
                language: "es",
                autoclose: true
            });

            app.setTooltips();
        }
    },
    correccion: {
        init: function() {
            app.setTooltips();
        }
    },
    correccionIndividual: {
        init: function() {
            app.setTooltips();
        }
    },
    editTasks: {
        init: function() {
            app.setTooltips();
        }
    },
    panel: {
        init: function() {
            var p = $('.activityDescription p');
            var divh = $('.activityDescription').height();
            while ($(p).outerHeight() > divh) {
                $(p).text(function(index, text) {
                    return text.replace(/\W*\s(\S)*$/, '...');
                });
            }
            app.setTooltips();

        }
    },
    tasks: {
        init: function() {
            app.setTooltips();
        }
    },


    setTooltips: function(){
        app.addTooltip('actCourseInCorrection', 'Asignatura');
        app.addTooltip('actLocationInCorrection', 'Localización');
        app.addTooltip('actCreatorInCorrection', 'Creador');
        app.addTooltip('actDescriptionInCorrection', 'Descripción');
        app.addTooltip('statusInCorrection', 'Estado');
        app.addTooltip('statusDateInCorrection', 'Fecha con este estado', 'bottom');

        app.addTooltip('editActivityButtonInCorrection', 'Modificar datos y tareas');
        app.addTooltip('tasksActivityButtonInCorrection', 'Ver tareas');
        app.addTooltip('reviseActivityButtonInCorrection', 'Corregir y ver resultados', 'bottom');
        app.addTooltip('removeActivityButtonInCorrection', 'Borrar la actividad', 'bottom');

        //   METER LOS SIGUIENTES USANDO LA FUNCTION app.addTooltip
        $('#actCourseInCard').tooltip({
            title: 'Asignatura',
            placement: 'right'
        });

        $('#actLocationInCard').tooltip({
            title: 'Localización',
            placement: 'right'
        });

        $('#actCreatorInCard').tooltip({
            title: 'Creador',
            placement: 'right'
        });

        $('#actDescriptionInCard').tooltip({
            title: 'Descripción',
            placement: 'right'
        });

        $('#statusInCard').tooltip({
            title: 'Estado',
        });

        $('#statusDateInCard').tooltip({
            title: 'Fecha con este estado',
            placement: 'bottom'
        });

        $('#editActivityButtonInCard').tooltip({
            title: 'Modificar datos y tareas'
        });

        $('#tasksActivityButtonInCard').tooltip({
            title: 'Ver tareas'
        });

        $('#reviseActivityButtonInCard').tooltip({
            title: 'Corregir y ver resultados',
            placement: 'bottom'
        });

        $('#removeActivityButtonInCard').tooltip({
            title: 'Borrar la actividad',
            placement: 'bottom'
        });

        // Valorar si estos tooltips ya están metidos, y sino meterlos con app.addTooltip

        $('#createActivityButton').tooltip({
            title: 'Crear nueva actividad'
        });

        $('.editActivityButton').tooltip({
            title: 'Modificar datos y tareas'
        });

        $('.tasksActivityButton').tooltip({
            title: 'Ver tareas'
        });

        $('.reviseActivityButton').tooltip({
            title: 'Corregir y ver resultados'
        });

        $('.removeActivityButton').tooltip({
            title: 'Borrar actividad'
        });
    },

    /* If not placement property is received, it takes "right" as default */
    addTooltip: function(id, title, placement) {
        $('#' + id).tooltip({
            title: title,
            placement: placement || "right"
        });
    }

};
