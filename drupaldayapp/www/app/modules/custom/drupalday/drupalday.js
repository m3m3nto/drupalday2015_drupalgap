/**
 * Implements hook_menu().
 */
function drupalday_menu() {
  try {
    var items = {};
    items['drupalday-dashboard'] = {
      title: 'Drupalday 2015',
      page_callback: 'drupalday_dashboard_page'
    };
    return items;
  }
  catch (error) { console.log('my_module_menu - ' + error); }
}

/**
 * Page callback for the dashboard page.
 * @return {Object}
 */
function drupalday_dashboard_page() {
  try {
    var content = {};
    content.site_info = {
      markup: '<h4 style="text-align: center;">' +
        Drupal.settings.site_path +
      '</h4>'
    };
    content.welcome = {
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
    content.get_started = {
      theme: 'button_link',
      text: t('Guida dev environment'),
      path: 'https://github.com/m3m3nto/drupalgap_enviroment_installation',
      options: {InAppBrowser: true}
    };
    content.support = {
      theme: 'button_link',
      text: t('Sito ufficiale DrupalGap'),
      path: 'http://www.drupalgap.org/support',
      options: {InAppBrowser: true}
    };
    return content;
  }
  catch (error) { console.log('drupalday_dashboard_page - ' + error); }
}