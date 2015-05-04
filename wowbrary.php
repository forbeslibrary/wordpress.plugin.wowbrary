<?php
/**
 * Plugin Name: Wowbrary
 * Plugin URI: https://github.com/forbeslibrary/wordpress.plugin.wowbrary
 * Author: Benjamin Kalish
 * Author URI: https://github.com/bkalish
 * Description: Allows easy embedding of the Wowbrary widget using shortcodes and allows the widget to be dynamically resized.
 * Version: 1.0
 */

if ( is_admin() ) {
  require_once(dirname( __FILE__ ) . '/admin.php');
}

add_filter('mce_external_plugins', 'wowbrary_register_tinymce_javascript');
function wowbrary_register_tinymce_javascript($plugin_array) {
  $plugin_path = plugins_url('/js/tinymce-plugins', __FILE__);
  $plugin_array['noneditable'] = $plugin_path . '/noneditable/plugin.js';
  $plugin_array['wowbrary_shortcode'] = $plugin_path . '/wowbrary_shortcode/plugin.js';
  return $plugin_array;
}

add_filter('mce_buttons', 'wowbrary_register_buttons');
function wowbrary_register_buttons($buttons) {
  array_push($buttons, 'Wowbrary');
  return $buttons;
}

add_shortcode( 'wowbrary', 'wowbrary_shortcode_handler' );

function wowbrary_shortcode_handler( $atts, $content = null ) {
  $atts = shortcode_atts( array(
    'container' => NULL,
    'library' => get_option('wowbrary_settings_library'),
    'providertype' => get_option('wowbrary_settings_providertype'),
    'provideraccount' => get_option('wowbrary_settings_provideraccount'),
    'password' => get_option('wowbrary_settings_password'),
    'providertype' => get_option('wowbrary_settings_providertype'),
    'width' => '1000',
    'height' => NULL,
    'imagesize' => NULL,
    'imagescale' => NULL,
    'spacing' => NULL,
    'speed' => NULL,
    'pause' => NULL,
    'captionflip' => NULL,
    'category' => NULL,
    'noelectronic' => NULL,
    'count' => NULL,
    'borderstyle' => NULL,
    'background' => NULL,
    'headingtext' => NULL,
    'headingstyle' => NULL,
    'titlestyle' => NULL,
    'motion' => NULL,
    'notitles' => NULL,
    'buttonheight' => NULL,
    'buttoncolor' => NULL,
    'buttonstyle' => NULL,
    'buttontextcolor' => NULL,
    'buttonsymbolcolor' => NULL,
    'buttonpath' => NULL,
    'target' => NULL,
    'reverse' => NULL,
    'sidearrows' => NULL,
    'debug' => NULL,
    ), $atts );

  $container_selector = $atts['container'];
  unset($atts['container']);

  $widget_url = "http://wowbrary.org/widgetslider.aspx?" . http_build_query($atts, '', '&amp;');

  ob_start(); ?>
<!--Wowbrary Widget Start-->
<div id="wowbrary">
<script src="<?php echo $widget_url; ?>"  type="text/javascript"></script>
<script>
jQuery(document).ready( function($) {
   $("#wowbrary>table").addClass("plain");
   function setTableWidth() {
      $("#wowbrary>table").width($("<?php echo $container_selector; ?>").width());
      $("#wowbrary>table tr").width($("<?php echo $container_selector; ?>").width());
      $("#wowbrary>table div").width($("<?php echo $container_selector; ?>").width());
   }
   setTableWidth();
   $("#wowbrary>table tr:nth-child(4)>td").css("text-align","center");
   $("#wowbrary>table tr:nth-child(5)>td").css("text-align","center");
   $(window).resize( function() {
     setTableWidth();
   } );
});
</script>
</div>
<!--Wowbrary Widget End--><?php
  return ob_get_clean();
}
