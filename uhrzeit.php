<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://profiles.wordpress.org/uhrzeit/
 * @since             1.0.0
 * @package           Uhrzeit
 *
 * @wordpress-plugin
 * Plugin Name:       Uhrzeit Widget
 * Plugin URI:        https://www.uhrzeitde.com
 * Description:       Beautiful clock, time and date widget (English or German)
 * Version:           1.0.0
 * Author:            uhrzeit
 * Author URI:        https://profiles.wordpress.org/uhrzeit/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       uhrzeit
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'UHRZEIT_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-uhrzeit-activator.php
 */
function activate_uhrzeit() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-uhrzeit-activator.php';
	Uhrzeit_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-uhrzeit-deactivator.php
 */
function deactivate_uhrzeit() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-uhrzeit-deactivator.php';
	Uhrzeit_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_uhrzeit' );
register_deactivation_hook( __FILE__, 'deactivate_uhrzeit' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-uhrzeit.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_uhrzeit() {

	$plugin = new Uhrzeit();
	$plugin->run();

}
run_uhrzeit();


class time_widget extends WP_Widget
{
    // Set up the widget name and description.
    public function __construct()
    {
        $widget_options = array('classname' => 'time_widget', 'description' => 'German Time, Date and Clock widget');
        parent::__construct('time_widget', 'Uhrzeit Widget', $widget_options);
    }


    // Create the widget output.
    public function widget($args, $instance)
    {
        // Keep this line
        echo $args['before_widget'];

        $city = $instance['city'];
        $country = $instance['country'];
        $backgroundColor = $instance['backgroundColor'];
        $widgetWidth = $instance['widgetWidth'];
        $textColor = $instance['textColor'];
        $showDigitalClock = $instance['showDigitalClock'];
        $showDate = $instance['showDate'];
        $language = $instance['language'];
        $showAnalogClock = $instance['showAnalogClock'];

        ?>

        <div class="time-widget"
             data-text-color='<?php echo $textColor ?>'
             data-background="<?php echo $backgroundColor ?>"
             data-width="<?php echo $widgetWidth ?>"
             data-digital="<?php echo $showDigitalClock ?>"
             data-analog="<?php echo $showAnalogClock ?>"
             data-date="<?php echo $showDate ?>"
             data-language="<?php echo $language ?>"
             data-city="<?php echo $city ?>"
             data-country="<?php echo $country; ?>">

            <div class="time_widget_placeholder"></div>
            <div style="font-size: 14px;text-align: center;padding-top: 6px;padding-bottom: 4px;background: rgba(0,0,0,0.03);">
                Data from <a target="_blank" href="https://www.uhrzeitde.com">uhrzeitde.com</a>
            </div>
        </div>
        <?php echo $args['after_widget'];
    }


    // Create the admin area widget settings form.
    public function form($instance)
    {
        // print_r($instance);
        $city = !empty($instance['city']) ? $instance['city'] : 'Berlin';
        $country = !empty($instance['country']) ? $instance['country'] : 'Germnay';
        $backgroundColor = !empty($instance['backgroundColor']) ? $instance['backgroundColor'] : '#becffb';
        $textColor = !empty($instance['textColor']) ? $instance['textColor'] : '#000000';

        if (isset($instance['widgetWidth'])) {
            $widgetWidth = $instance['widgetWidth'];
        } else {
            $widgetWidth = '100';
        }


        if (isset($instance['language'])) {
            $language = $instance['language'];
        } else {
            $language = "german";
        }

        $showDigitalClock = !empty($instance['showDigitalClock']) ? $instance['showDigitalClock'] : 'on';
        $showAnalogClock = !empty($instance['showAnalogClock']) ? $instance['showAnalogClock'] : 'on';
        $showDate = !empty($instance['showDate']) ? $instance['showDate'] : 'on';


        ?>
        <div class="weer_form">
            <div class="form-section">
                <h3>Location for current time</h3>
                <div class="form-line">
                    <label class="text-label" for="<?php echo $this->get_field_id('city'); ?>">City:</label>
                    <input type="text" id="<?php echo $this->get_field_id('city'); ?>"
                           name="<?php echo $this->get_field_name('city'); ?>"
                           value="<?php echo esc_attr($city); ?>"/>
                </div>
                <div class="form-line">
                    <label class="text-label" for="<?php echo $this->get_field_id('country'); ?>">Country:</label>
                    <input type="text" id="<?php echo $this->get_field_id('country'); ?>"
                           name="<?php echo $this->get_field_name('country'); ?>"
                           value="<?php echo esc_attr($country); ?>"/>
                </div>
            </div>

            <div class="form-section">
                <h3>Widget Language</h3>
                <div class="form-line">
                    <select name="<?php echo $this->get_field_name('language'); ?>">
                        <option value="english" <?php if ($language == "english") {
                            echo 'selected';
                        } ?>>English
                        </option>
                        <option value="german" <?php if ($language == "german") {
                            echo 'selected';
                        } ?>>German
                        </option>
                    </select>
                </div>
            </div>

            <div class="form-section">
                <h3>Data</h3>
                <div class="form-line">
                    <input type="checkbox"
                        <?php if ($showAnalogClock == 'on') {
                            echo 'checked';
                        }; ?>
                           id="<?php echo $this->get_field_id('showAnalogClock'); ?>"
                           name="<?php echo $this->get_field_name('showAnalogClock'); ?>"/>
                    <label for="<?php echo $this->get_field_id('showAnalogClock'); ?>">Show: Analog Clock</label>
                </div>
                <div class="form-line">
                    <input type="checkbox"
                        <?php if ($showDigitalClock == 'on') {
                            echo 'checked';
                        }; ?>
                           id="<?php echo $this->get_field_id('showDigitalClock'); ?>"
                           name="<?php echo $this->get_field_name('showDigitalClock'); ?>"/>
                    <label for="<?php echo $this->get_field_id('showDigitalClock'); ?>">Show: Digital Time</label>
                </div>
                <div class="form-line">
                    <input type="checkbox"
                        <?php if ($showDate == 'on') {
                            echo 'checked';
                        }; ?>
                           id="<?php echo $this->get_field_id('showDate'); ?>"
                           name="<?php echo $this->get_field_name('showDate'); ?>"/>
                    <label for="<?php echo $this->get_field_id('showDate'); ?>">Show: Date</label>
                </div>
            </div>



            <div class="form-section">
                <h3>Look & Feel</h3>
                <div class="form-line">
                    <label for="<?php echo $this->get_field_id('widgetWidth'); ?>">Widget Stretch (width):</label>
                    <input type="radio" id="<?php echo $this->get_field_id('widgetWidth'); ?>"
                        <?php if ($widgetWidth == '100') {
                            echo 'checked';
                        }; ?>
                           name="<?php echo $this->get_field_name('widgetWidth'); ?>"
                           value="100"/> 100%
                    <input type="radio" id="<?php echo $this->get_field_id('widgetWidth'); ?>"
                        <?php if ($widgetWidth == 'tight') {
                            echo 'checked';
                        }; ?>
                           name="<?php echo $this->get_field_name('widgetWidth'); ?>"
                           value="tight"/> Tight as possible
                </div>
                <div class="form-line">
                    <label for="<?php echo $this->get_field_id('backgroundColor'); ?>">Background Color
                        (optional):</label>
                    <input type="color" id="<?php echo $this->get_field_id('backgroundColor'); ?>"
                           name="<?php echo $this->get_field_name('backgroundColor'); ?>"
                           value="<?php echo esc_attr($backgroundColor); ?>"/>
                </div>
                <div class="form-line">
                    <label for="<?php echo $this->get_field_id('textColor'); ?>">Text Color (optional):</label>
                    <input type="color" id="<?php echo $this->get_field_id('textColor'); ?>"
                           name="<?php echo $this->get_field_name('textColor'); ?>"
                           value="<?php echo esc_attr($textColor); ?>"/>
                </div>
            </div>
        </div>
        <?php
    }


    // Apply settings to the widget instance.
    public function update($new_instance, $old_instance)
    {
        $instance = $old_instance;
        $instance['city'] = strip_tags($new_instance['city']);
        $instance['country'] = strip_tags($new_instance['country']);
        $instance['backgroundColor'] = strip_tags($new_instance['backgroundColor']);
        $instance['textColor'] = strip_tags($new_instance['textColor']);
        $instance['widgetWidth'] = strip_tags($new_instance['widgetWidth']);
        $instance['showDigitalClock'] = $new_instance['showDigitalClock'];
        $instance['showAnalogClock'] = $new_instance['showAnalogClock'];
        $instance['showDate'] = $new_instance['showDate'];
        $instance['language'] = strip_tags($new_instance['language']);
        if ($new_instance['showSunrise'] != "on") {
            $instance['showSunrise'] = "false";
        }
        if ($new_instance['showDigitalClock'] != "on") {
            $instance['showDigitalClock'] = "false";
        }
        if ($new_instance['showAnalogClock'] != "on") {
            $instance['showAnalogClock'] = "false";
        }
        if ($new_instance['showDate'] != "on") {
            $instance['showDate'] = "false";
        }

        return $instance;
    }


}

// Register the widget.
function jpen_register_time_widget()
{
    register_widget('time_widget');
}

add_action('widgets_init', 'jpen_register_time_widget');
