<?php

class WordPress_Content_Likes_Admin_Settings
{
    /**
     * Holds the values to be used in the fields callbacks
     */
    private $options;
    private $name;
    private $labels;
    /**
     * Start up
     */
    public function __construct($name)
    {
        add_action('admin_menu', array( $this, 'add_plugin_page' ));
        add_action('admin_init', array( $this, 'page_init' ));
        $this->name = $name;
    }

    /**
     * Add options page
     */
    public function add_plugin_page()
    {
        // This page will be under "Settings"
        add_options_page(
            'Settings Admin',
            $this->name,
            'manage_options',
            'my-setting-admin',
            array( $this, 'create_admin_page' )
        );
    }

    /**
     * Options page callback
     */
    public function create_admin_page()
    {
        // Set class property
        $this->options = get_option('my_option_name'); ?>
        <div class="wrap">
            <h1><?php echo $this->name ?></h1>
            <form method="post" action="options.php">
            <?php
                // This prints out all hidden setting fields
                settings_fields('my_option_group');
        do_settings_sections('my-setting-admin');
        submit_button(); ?>
            </form>
        </div>
        <?php
    }

    /**
     * Register and add settings
     */
    public function page_init()
    {
        register_setting(
            'my_option_group', // Option group
            'my_option_name' // Option name
        );

        add_settings_section(
            'setting_section_id', // ID
            'Which posts to enable?', // Title
            array( $this, 'print_section_info' ), // Callback
            'my-setting-admin' // Page
        );

        add_settings_field(
            'track_posts', // ID
            'Enable posts tracking', // Title
            array( $this, 'posts_callback' ), // Callback
            'my-setting-admin', // Page
            'setting_section_id' // Section
        );

        add_settings_field(
            'track_custom_posts', // ID
            'Enable custom posts tracking', // Title
            array( $this, 'custom_posts_callback' ), // Callback
            'my-setting-admin', // Page
            'setting_section_id' // Section
        );

        add_settings_field(
            'track_pages', // ID
            'Enable page tracking', // Title
            array( $this, 'page_callback' ), // Callback
            'my-setting-admin', // Page
            'setting_section_id' // Section
        );
    }

    /**
     * Get the settings option array and print one of its values
     */
    public function posts_callback()
    {
        printf(
            '<input type="checkbox" id="id_number" name="my_option_name[track_posts]" %s />',
            isset($this->options['track_posts']) ? 'checked' : ''
        );
    }

    /**
     * Get the settings option array and print one of its values
     */
    public function custom_posts_callback()
    {
        printf(
            '<input type="checkbox" id="title" name="my_option_name[track_custom_posts]" %s />',
            isset($this->options['track_custom_posts']) ? 'checked' : ''
        );
    }
    public function page_callback()
    {
        printf(
            '<input type="checkbox" id="title" name="my_option_name[track_pages]" %s />',
            isset($this->options['track_pages']) ? 'checked' : ''
        );
    }

    public function print_section_info()
    {
        print '';
    }
}
