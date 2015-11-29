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
      title: 'Plugin',
      page_callback: 'drupalday_pluginexamples_page'
    };
    items['gallery'] = {
    title: 'Gallery',
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
    
    // Position plugin
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

    // Contacts plugin
    function onContSuccess(contacts) {
      $('#numcontacts').html(contacts.length);
    };
    function onContError(contactError) {
      alert('Error retrieving contacts!');
    };
    var options      = new ContactFindOptions();
    options.filter   = "";
    options.multiple = true;
    options.desiredFields = [navigator.contacts.fieldType.id];
    options.hasPhoneNumber = true;
    var fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
    navigator.contacts.find(fields, onContSuccess, onContError, options);

    // Battery plugin
    window.addEventListener("batterystatus", onBatteryStatus, false);
    function onBatteryStatus(info) {
      $('#battery').html(info.level + "% - in carica: " + info.isPlugged);
    }

    // Orientation
    function onOrientSuccess(heading) {
      $('#orientation').html(heading.magneticHeading);
    };
    function onOrientError(error) {
      alert('CompassError: ' + error.code);
    };
    var orient_options = { frequency: 3000 };
    navigator.compass.watchHeading(onOrientSuccess, onOrientError, orient_options);

    // Acceleration
    function onAccSuccess(acceleration) {
      $('#accelerationx').html(acceleration.x.toFixed(2));
      $('#accelerationy').html(acceleration.y.toFixed(2));
      $('#accelerationz').html(acceleration.z.toFixed(2));
    }
    function onAccError() {
      alert('onError!');
    }
    var acc_options = { frequency: 100 };
    navigator.accelerometer.watchAcceleration(onAccSuccess, onAccError, acc_options);

    var content = {};
    content.welcome_cordovaeamples = {
      markup: '<h2>' + t('Esempi plugin Cordova') + '</h2>' + 
        t('<p>Posizione: <span id="lat"></span> - <span id="lon"></span></p>') +
        t('<p>Device platform: <span id="dev"> ' + device.platform + ' ' + device.version + '</span></p>') + 
        t('<p>Device model: <span id="dev">' + device.model + '</span></p>') + 
        t('<p>Connection type: <span id="conn">' + checkConnection() + '</span></p>') +
        t('<p>Contacts: <span id="numcontacts"></span></p>') + 
        t('<p>Battery: <span id="battery"></span></p>') +
        t('<p>Orientation: <span id="orientation"></span></p>') +
        t('<p>Acceleration: X: <span id="accelerationx"></span> ') + 
        t('Y: <span id="accelerationy"></span> ') +
        t('Z: <span id="accelerationz"></span><br/><br/>')
    };

    content.play = {
      theme: 'button_link',
      text: t('Start vibration'),
      attributes: {
        onclick: "navigator.vibrate(2000);"
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