Ext.define('Movie', {
    extend: 'Ext.data.Model',

    fields: ['idx', 'title', 'description', 'year', 'country', 'budget'],
});
Ext.onReady(function () {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };
    Ext.Ajax.on('beforerequest', function (conn, options) {
        if (!(/^http:.*/.test(options.url) || /^https:.*/.test(options.url))) {
            options.headers = options.headers || {};
            options.headers["X-CSRFToken"] = getCookie('csrftoken');
        }
    }, this);
})
//take an array to store the object that we will get from the ajax response
var records = [];

//create extjs store with empty data
var store = Ext.create('Ext.data.Store', {
    fields: ['idx', 'title', 'description', 'year', 'country', 'budget'],
    data: records,
    autoSync: true,

});


Ext.application({
    launch: function () {
        Ext.Ajax.request({
            url: 'api/',
            success: function (r) {
                //create a json object from the response string
                var res = Ext.decode(r.responseText, true);
                // if we have a valid json object, then process it
                if (res !== null && typeof (res) !== 'undefined') {
                    // loop through the data
                    Ext.each(res, function (obj) {
                        //add the records to the array
                        records.push({
                            idx: obj.idx,
                            title: obj.title,
                            description: obj.description,
                            year: obj.year,
                            country: obj.country,
                            budget: obj.budget,

                        })
                    });
                    //update the store with the data that we got
                    store.loadData(records);
                }
            },
            failure: function (r) {}
        });
        Ext.create('Ext.form.Panel', {
            title: 'Movie Form',
            bodyPadding: 5,
            width: 350,

            // The form will submit an AJAX request to this URL when submitted
            url: 'api/create/',

            // Fields will be arranged vertically, stretched to full width
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },

            // The fields
            defaultType: 'textfield',
            items: [
                {
                    fieldLabel: 'Title',
                    name: 'title',
                    allowBlank: false
                }, {
                    fieldLabel: 'Description',
                    name: 'description',
                    allowBlank: false
                }, {
                    fieldLabel: 'Year',
                    name: 'year',
                    allowBlank: false
                },
                {
                    fieldLabel: 'Country',
                    name: 'country',
                    allowBlank: false
                },
                {
                    fieldLabel: 'Budget',
                    name: 'budget',
                    allowBlank: false
                },
            ],
            // Reset, Submit, Close buttons
            buttons: [{
                    text: 'Submit',
                    formBind: true, // only enabled once the form is valid
                    disabled: true,
                    handler: function () {
                        var form = this.up('form').getForm();
                        if (form.isValid()) {
                            form.submit({
                                success: function (response, data) {
                                    var idx = data.result.idx
                                    var formValues = form.getValues()
                                    formValues.idx = idx
                                    store.insert(store.data.length, formValues);
                                    form.reset();
                                    let modalWindow = document.querySelector('.modal-window')
                                    modalWindow.style.opacity = 0
                                    modalWindow.style.zIndex = -2000
                                },
                                failure: function (response) {
                                    console.log('server-side failure with status code ' + response.status);
                                }
                            });
                        }
                    }
                }, {
                    text: 'Reset',
                    handler: function () {
                        this.up('form').getForm().reset();
                    },
                },
                {
                    text: 'Close',
                    handler: function () {
                        let modalWindow = document.querySelector('.modal-window')
                        modalWindow.style.opacity = 0
                        modalWindow.style.zIndex = -2000
                    }
                }
            ],
            renderTo: 'movie-form'
        });
        grid = Ext.create('Ext.grid.Panel', {
            title: 'Movies',
            store: store,
            buttons: [{
                    text: 'add',
                    id: 'new-product-link',
                    handler: function () {
                        let modalWindow = document.querySelector('.modal-window')
                        modalWindow.style.opacity = 1
                        modalWindow.style.zIndex = 2000
                    }
                },
                {
                    text: 'Delete',
                    id: 'delete-button',
                    handler: function () {
                        if (grid.getSelectionModel().getCurrentPosition()) {
                            var data = grid.getSelectionModel().getCurrentPosition().record.data
                            store.removeAt(grid.getSelectionModel().getCurrentPosition().rowIdx)
                            Ext.Ajax.request({
                                url: 'api/remove/',
                                params: data,
                                success: function (r) {
                                    console.log('success')
                                },
                                failure: function (r) {
                                    console.log('failure')
                                }
                            });
                        }
                    }
                },
            ],
            columns: [{
                    text: 'idx',
                    dataIndex: 'idx',
                    width: 0
                },
                {
                    text: 'Title',
                    dataIndex: 'title',
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                },
                {
                    text: 'Description',
                    dataIndex: 'description',
                    flex: 1,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                },
                {
                    text: 'Year',
                    dataIndex: 'year',
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                },
                {
                    text: 'Country',
                    dataIndex: 'country',
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                },
                {
                    text: 'Budget',
                    dataIndex: 'budget',
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                },
            ],
            width: 1100,
            renderTo: 'app',
            plugins: {
                ptype: 'rowediting',
                clicksToEdit: 2,
                autoUpdate: true,
                listeners: {
                    beforeedit: function (cmp) {
                        var buttonsContainer = cmp.editor.floatingButtons;
                        // if we haven't done so hide the buttons
                        //
                        if (!buttonsContainer.buttonsHidden) {
                            buttonsContainer.items.each(function (btn) {
                                btn.hidden = true;
                            });
                            buttonsContainer.padding = 0;
                            buttonsContainer.buttonsHidden = true;
                        }
                    },
                    edit: function (editor, e) {
                        Ext.Ajax.request({
                            url: 'api/update/',
                            params: e.record.data,
                            success: function (r) {
                                console.log('success')
                            },
                            failure: function (r) {
                                console.log('failure')
                            }
                        });
                        // commit the changes right after editing finished
                        e.record.commit();
                    }
                }
            }
        });
    }
});