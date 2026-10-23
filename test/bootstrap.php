<?php
// A narrow WordPress API fixture, not a replacement for a staging WordPress test.
define('ABSPATH', __DIR__ . '/');
$hooks = array(); $test_options = array(); $test_slug = ''; $test_main = true;
function add_filter($name, $callback, $priority = 10, $accepted = 1) { $GLOBALS['hooks'][$name][] = $callback; }
function add_action($name, $callback, $priority = 10, $accepted = 1) { add_filter($name, $callback); }
function get_option($key, $fallback = false) { return $GLOBALS['test_options']; }
function wp_parse_args($value, $defaults) { return array_merge($defaults, (array) $value); }
function get_page_by_path($slug) { return (object) array('post_name' => $slug, 'post_status' => 'publish'); }
function get_permalink($page) { return 'http://127.0.0.1:8787/' . $page->post_name . '/'; }
function is_page() { return $GLOBALS['test_slug'] !== ''; }
function get_queried_object() { return (object) array('post_name' => $GLOBALS['test_slug']); }
function is_admin() { return false; }
function is_main_query() { return $GLOBALS['test_main']; }
function in_the_loop() { return true; }
function is_front_page() { return $GLOBALS['test_slug'] === ''; }
function is_paged() { return false; }
function is_feed() { return false; }
function is_embed() { return false; }
function is_search() { return false; }
function esc_attr($value) { return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8'); }
function esc_html($value) { return esc_attr($value); }
function esc_url($value) { return esc_attr($value); }
function plugins_url($path, $file) { return '/plugins/grywmig-ulepszenia/' . $path; }
function wp_json_encode($value) { return json_encode($value, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT); }
function get_bloginfo($key) { return 'Gry w Mig'; }
function get_posts($args) { return array((object) array('post_name' => '2026/10/07/13')); }
function get_the_title($post) { return 'Jak grać w sudoku? Zasady i wskazówki dla początkujących'; }
function get_the_excerpt($post) { return 'Poznaj trzy zasady sudoku, zobacz prosty przykład i naucz się znajdować pewne cyfry bez zgadywania.'; }
function wp_strip_all_tags($text) { return strip_tags($text); }
function wp_trim_words($text, $count) { return $text; }
function wp_enqueue_style() {}
function wp_enqueue_script() {}
function wp_add_inline_script() {}
require __DIR__ . '/../plugins/grywmig-ulepszenia/grywmig-ulepszenia.php';

function get_header() {
    echo '<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Gry w Mig — podgląd zmian</title><link rel="icon" href="https://grywmig.pl/wp-content/plugins/grywmig-anagram/assets/brand/gry-w-mig-icon-142.png"><link rel="stylesheet" href="/test/output/theme.css"><link rel="stylesheet" href="/plugins/grywmig-ulepszenia/assets/site.css"><link rel="stylesheet" href="/test/fixtures/original-header.css"><style>body{margin:0;font-family:system-ui,sans-serif}.preview-label{padding:8px 16px;background:#172b3a;color:#fffefa;text-align:center;font-size:12px}.preview-label a{color:#d8f36a}</style></head><body class="gwm-u-home-page gwm-brand-120 gwm-mystery-available"><div class="preview-label">Podgląd nowego katalogu • <a href="/dist/grywmig-ulepszenia-1.0.0.zip" download>Pobierz wtyczkę WordPress</a></div>';
    echo file_get_contents(__DIR__ . '/fixtures/original-header.html');
}
function get_footer() {
    echo '<footer class="site-footer"><div class="wrap"><p>Gry w Mig · Twoja chwila na dobrą grę.</p></div></footer><script src="/plugins/grywmig-ulepszenia/assets/site.js"></script><script src="/test/fixtures/original-header.js"></script></body></html>';
}
