<?php
/**
 * Admin interface for the Wowbrary plugin.
 */

/**
 * @wp-hook admin_menu
 */
function wowbrary_admin_menu() {
  add_options_page(
    // Page Title
    __('Wowbrary Settings'),
    // Menu Title
    __('Wowbrary'),
    // Capability
    'manage_options',
    // Menu Slug (also-referred to as option group)
    'wowbrary_settings_page',
    // Callback
    'wowbrary_output_settings_page'
  );
}
add_action('admin_menu', 'wowbrary_admin_menu');

/**
 * Initializes the settings and fields using the settings API
 *
 * @wp-hook admin_init
 */
function wowbrary_admin_init() {
  add_settings_section(
    // ID
    'default',
    // Title
    __('General Settings'),
    // Callback
    'wowbrary_output_default_settings_section',
    // Page
    'wowbrary_settings_page'
  );

  add_settings_field(
    // ID
    'wowbrary_settings_library',
    // Title
    __('Library Number'),
    // Callback
    'wowbrary_output_library_form_field',
    // Page
    'wowbrary_settings_page'//,
    // Section
    // default
  );
  register_setting('wowbrary_settings_page', 'wowbrary_settings_library');

  add_settings_field(
    // ID
    'wowbrary_settings_providertype',
    // Title
    __('Provider Type'),
    // Callback
    'wowbrary_output_providertype_form_field',
    // Page
    'wowbrary_settings_page'//,
    // Section
    // default
  );
  register_setting('wowbrary_settings_page', 'wowbrary_settings_providertype');

  add_settings_field(
    // ID
    'wowbrary_settings_provideraccount',
    // Title
    __('Provider Account'),
    // Callback
    'wowbrary_output_provideraccount_form_field',
    // Page
    'wowbrary_settings_page'//,
    // Section
    // default
  );
  register_setting('wowbrary_settings_page', 'wowbrary_settings_provideraccount');

  add_settings_field(
    // ID
    'wowbrary_settings_password',
    // Title
    __('Password'),
    // Callback
    'wowbrary_output_password_form_field',
    // Page
    'wowbrary_settings_page'//,
    // Section
    // default
  );
  register_setting('wowbrary_settings_page', 'wowbrary_settings_password');
}
add_action('admin_init', 'wowbrary_admin_init');

/**
 * Outputs HTML for the wowbrary settings page.
 *
 * This is a callback function for the Wordpress Settings API
 */
function wowbrary_output_settings_page() {
  ?>
  <h1><?php echo __('Wowbrary Settings'); ?></h1>
  <form method="POST" action="options.php">
    <?php
    settings_fields( 'wowbrary_settings_page' );
    do_settings_sections( 'wowbrary_settings_page' );
    submit_button();
    ?>
  </form>
  <?php
}

/**
 * Outputs HTML for the wowbrary settings page default section.
 *
 * This is a callback function for the Wordpress Settings API
 */
function wowbrary_output_default_settings_section() {
  echo ''; // no explanatory text for this section
}

/**
 * Outputs HTML for the wowbrary settings library field.
 *
 * This is a callback function for the Wordpress Settings API
 */
function wowbrary_output_library_form_field() {
  ?>
  <label>
    <input
      type="text"
      name="wowbrary_settings_library"
      id="wowbrary_settings_library"
      value="<?php echo get_option( 'wowbrary_settings_library' ); ?>"
    >
    <p class="description">Please enter your  Wowbrary library number.<p>
  </label>
  <?php
}

/**
 * Outputs HTML for the wowbrary settings providertype field.
 *
 * This is a callback function for the Wordpress Settings API
 */
function wowbrary_output_providertype_form_field() {
  ?>
  <label>
    <select name="wowbrary_settings_providertype">
      <option value="chilifresh" <?php selected( get_option('wowbrary_settings_providertype'), 'chilifresh'); ?>>ChiliFresh</option>
      <option value="contentcafe" <?php selected( get_option('wowbrary_settings_providertype'), 'contentcafe'); ?>>Content Café</option>
      <option value="encore" <?php selected( get_option('wowbrary_settings_providertype'), 'encore'); ?>>Encore</option>
      <option value="evergreen" <?php selected( get_option('wowbrary_settings_providertype'), 'evergreen'); ?>>Evergreen</option>
      <option value="noblenet" <?php selected( get_option('wowbrary_settings_providertype'), 'noblenet'); ?>>noblenet</option>
      <option value="openlibrary" <?php selected( get_option('wowbrary_settings_providertype'), 'openlibrary'); ?>>Open Library</option>
      <option value="sirsi" <?php selected( get_option('wowbrary_settings_providertype'), 'sirsi'); ?>>Sirsi</option>
      <option value="syndetics" <?php selected( get_option('wowbrary_settings_providertype'), 'syndetics'); ?>>Syndetics</option>
      <option value="tlc" <?php selected( get_option('wowbrary_settings_providertype'), 'tlc'); ?>>TLC</option>
      <option value="wowbrary" <?php selected( get_option('wowbrary_settings_providertype'), 'wowbrary'); ?>>Wowbrary</option>
    </select>
    <p class="description">Your provider of cover images.<p>
  </label>
  <?php
}

/**
 * Outputs HTML for the wowbrary settings provideraccount field.
 *
 * This is a callback function for the Wordpress Settings API
 */
function wowbrary_output_provideraccount_form_field() {
  ?>
  <label>
    <input
      type="text"
      name="wowbrary_settings_provideraccount"
      id="wowbrary_settings_provideraccount"
      value="<?php echo get_option( 'wowbrary_settings_provideraccount' ); ?>"
    >
    <p class="description">Your account id for your image cover provider;<br/>
    this is required only for Content Café, Syndetics, and TLC.<p>
  </label>
  <?php
}

/**
 * Outputs HTML for the wowbrary settings password field.
 *
 * This is a callback function for the Wordpress Settings API
 */
function wowbrary_output_password_form_field() {
  ?>
  <label>
    <input
      type="text"
      name="wowbrary_settings_password"
      id="wowbrary_settings_password"
      value="<?php echo get_option( 'wowbrary_settings_password' ); ?>"
    >
    <p class="description">Your password, if using Content Café.<p>
  </label>
  <?php
}
