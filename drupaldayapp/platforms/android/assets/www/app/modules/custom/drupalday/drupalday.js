var _drupalday_reload_page = null;
var _drupalday_reload_messages = null;

/**
 * Implements hook_menu().
 */
function drupalday_menu() {
  try {
    var items = {};
    items['drupaldaydashboard'] = {
      title: 'Drupalday 2015',
      page_callback: 'drupalday_dashboard_page'
    };
    items['pluginexamples'] = {
      title: 'Drupalday 2015 Plugin examples',
      page_callback: 'drupalday_pluginexamples_page'
    };
    items['gallery'] = {
    title: 'DrupalDay 2015 Gallery',
    page_callback: 'drupalday_gallery_page'
  };
  return items;
    items['_reload'] = {
      title: t('Reloading') + '...',
      page_callback: 'drupalday_reload_page',
      pageshow: 'drupalday_reload_pageshow'
    };
    return items;
  }
  catch (error) { console.log('drupalday_menu - ' + error); }
}

/**
 * The page callback for the reload page.
 * @return {String}
 */
function drupalday_reload_page() {
  try {
    // Set aside any messages, then return an empty page.
    var messages = drupalgap_get_messages();
    if (!empty(messages)) {
      _system_reload_messages = messages.slice();
      _drupalday_reload_messages([]);
    }
    return '';
  }
  catch (error) { console.log('drypalday_reload_page - ' + error); }
}

/**
 * The pageshow callback for the reload page.
 */
function drupalday_reload_pageshow() {
  try {
    // Set any messages that were set aside.
    if (_drupalday_reload_messages && !empty(_drupalday_reload_messages)) {
      for (var i = 0; i < _drupalday_reload_messages.length; i++) {
        drupalgap_set_message(
          _drupalday_reload_messages[i].message,
          _drupalday_reload_messages[i].type
        );
      }
      _drupalday_reload_messages = null;
    }
    drupalgap_loading_message_show();
  }
  catch (error) { console.log('drupalday_reload_pageshow - ' + error); }
}

/**
 * Implements hook_system_drupalgap_goto_post_process().
 * @param {String} path
 */
function drupalday_drupalgap_goto_post_process(path) {
  try {
    if (path == '_reload') {
      if (!_drupalday_reload_page) { return; }
      var path = '' + _drupalday_reload_page;
      _drupalday_reload_page = null;
      drupalgap_loading_message_show();
      drupalgap_goto(path, { reloadPage: true });
    }

  }
  catch (error) {
    console.log('drupalday_drupalgap_goto_post_process - ' + error);
  }
}

/**
 * Page callback for the dashboard page.
 * @return {Object}
 */
function drupalday_dashboard_page() {
  try {
    var content = {};
    content.welcome_drupalday = {
      markup: '<h2 style="text-align: center;">' +
        t('Benvenuto al DrupalDay') +
      '</h2>' +
      '<p style="text-align: center;">' +
        t('DrupalGap: crea una app Android (ed iOS) con Drupal , Drupalgap ed Apache Cordova') +
      '</p>'
    };
    if (drupalgap.settings.logo) {
      content.logo = {
        markup: '<center>' +
                 theme('image', {path: drupalgap.settings.logo}) +
               '</center>'
      };
    }
    content.get_started_drupalday = {
      theme: 'button_link',
      text: t('Guida dev environment'),
      path: 'https://github.com/m3m3nto/drupalday2015_drupalgap',
      options: {InAppBrowser: true}
    };
    content.gallery = {
      theme: 'button_link',
      text: t('Drupal Day Gallery'),
      path: 'gallery'
    };
    content.foto = {
      theme: 'button_link',
      text: t('Nuova Foto'),
      path: 'node/add/foto'
    };
    content.cordovaplugins = {
      theme: 'button_link',
      text: t('Cordova plugins'),
      path: 'pluginexamples'
    };
    return content;
  }
  catch (error) { console.log('drupalday_dashboard_page - ' + error); }
}

/**
 * Page callback for the plugin examples page.
 * @return {Object}
 */
function drupalday_pluginexamples_page() {
  try {
    
    navigator.geolocation.getCurrentPosition(
      function(position) {
        // Place the coordinate values into the text fields, then force a change
        // event to fire.
        $('#lat').html(position.coords.latitude.toFixed(2));
        $('#lon').html(position.coords.longitude.toFixed(2));
      },
      function(error) {
        console.log('drupalday_pluginexamples_page - getCurrentPosition - ' + error);
      },
      {
        enableHighAccuracy: true
      }
    );

    function onContSuccess(contacts) {
      $('#numcontacts').html(contacts.length);
    };

    function onContError(contactError) {
      alert('onError!');
    };

    // find all contacts with 'Bob' in any name field
    var options      = new ContactFindOptions();
    options.filter   = "";
    options.multiple = true;
    options.desiredFields = [navigator.contacts.fieldType.id];
    options.hasPhoneNumber = true;
    var fields       = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
    navigator.contacts.find(fields, onContSuccess, onContError, options);

    var content = {};
    content.welcome_cordovaeamples = {
      markup: '<h2 style="text-align: center;">' +
        t('Esempi plugin Cordova') + '</h2>' + 
        t('<p>Posizione [geolocation]: <span id="lat"></span> - <span id="lon"></span></p>') +
        t('<p>Device platform [device]: <span id="dev"> ' + device.platform + ' ' + device.version + '</span></p>') + 
        t('<p>Device model [device]: <span id="dev">' + device.model + '</span></p>') + 
        t('<p>Connection type [connection]: <span id="conn">' + checkConnection() + '</span></p>') +
        t('<p>Contatti: <span id="numcontacts"></span></p>')
    };

    content.picker = {
      theme: 'button_link',
      text: t('Contact picker'),
      attributes: {
        onclick: "navigator.contacts.pickContact;"
      }
    };
    
    return content;
  }
  catch (error) { console.log('drupalday_pluginexamples_page - ' + error); }
}

/**
 * The page callback to display the DrupalDay gallery view.
 */
function drupalday_gallery_page() {
  try {
    var content = {};
    content['gallery_page'] = {
      theme: 'view',
      format: 'unformatted_list',
      path: 'drupalgap/views_datasource/gallery', /* the path to the view in Drupal */
      row_callback: 'drupalday_gallery_list_row',
      empty_callback: 'drupalday_gallery_list_empty',
      attributes: {
        id: 'drupalday_gallery_page'
      }
    };
    return content;
  }
  catch (error) { console.log('drupalday_gallery_page - ' + error); }
}

/**
 * The row callback to render a single row.
 */
function drupalday_gallery_list_row(view, row) {
  try {
      var image_html = theme('image', { path: row.field_foto.src });
      return l(image_html, 'node/' + row.nid);
  }
  catch (error) { console.log('drupalday_gallery_list_row - ' + error); }
}
 
/**
 * Callback function for no results.
 */
function drupalday_gallery_list_empty(view) {
  try {
    return '<p>Spiacenti nessuna foto trovata</p>';
  }
  catch (error) { console.log('drupalday_gallery_list_empty - ' + error); }
}

/**
 * @see https://github.com/apache/cordova-plugin-network-information
 */
function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown';
    states[Connection.ETHERNET] = 'Ethernet';
    states[Connection.WIFI]     = 'WiFi';
    states[Connection.CELL_2G]  = 'Cell 2G';
    states[Connection.CELL_3G]  = 'Cell 3G';
    states[Connection.CELL_4G]  = 'Cell 4G';
    states[Connection.CELL]     = 'Cell generic';
    states[Connection.NONE]     = 'No network';

    return states[networkState];
}