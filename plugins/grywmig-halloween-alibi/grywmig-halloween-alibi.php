<?php
/**
 * Plugin Name: Gry w Mig — Halloweenowe Alibi
 * Description: Trzy logiczne zagadki Halloween. Po aktywacji tworzy stronę Halloweenowe Alibi, jeśli taki adres jest wolny.
 * Version: 1.0.0
 * Requires at least: 6.2
 * Requires PHP: 7.4
 * Author: Gry w Mig
 * License: GPL-2.0-or-later
 */
namespace GryWMig\Halloween;
if (!defined('ABSPATH')) { exit; }

register_activation_hook(__FILE__, function () {
    if (get_page_by_path('halloweenowe-alibi')) { return; }
    $id = wp_insert_post(array('post_type' => 'page', 'post_status' => 'publish', 'post_title' => 'Halloweenowe Alibi', 'post_name' => 'halloweenowe-alibi', 'post_content' => '[grywmig_halloween_alibi]'), true);
    if (!is_wp_error($id)) { update_option('gwm_halloween_page_id', $id, false); }
});

add_shortcode('grywmig_halloween_alibi', function () {
    wp_enqueue_script('gwm-halloween-embed', plugins_url('embed.js', __FILE__), array(), '1.0.0', true);
    $src = plugins_url('game/index.html', __FILE__) . '?embed=1&v=1.0.0';
    return '<div class="gwm-halloween-embed" data-gwm-halloween-embed><iframe title="Halloweenowe Alibi — trzy zagadki logiczne" src="' . esc_url($src) . '" style="display:block;width:100%;height:1100px;border:0;border-radius:20px;background:#fbf8f0" allow="clipboard-write; web-share" loading="eager"></iframe><noscript><p>Do gry potrzebujesz włączonego JavaScriptu.</p></noscript></div>';
});

add_filter('document_title_parts', function ($parts) {
    if (is_page('halloweenowe-alibi')) { $parts['title'] = 'Halloweenowe Alibi — darmowe zagadki na Halloween'; }
    return $parts;
}, 30);
add_action('wp_head', function () {
    if (!is_page('halloweenowe-alibi') || defined('WPSEO_VERSION') || defined('RANK_MATH_VERSION') || defined('AIOSEO_VERSION') || defined('SEOPRESS_VERSION') || defined('THE_SEO_FRAMEWORK_VERSION')) { return; }
    echo '<meta name="description" content="Zagraj w Halloweenowe Alibi: trzy krótkie zagadki po polsku. Porównaj zeznania, znajdź jedynego kłamcę i wskaż sprawcę. Za darmo, bez logowania.">' . "\n";
}, 2);
