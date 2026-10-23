<?php
/**
 * Plugin Name: Gry w Mig — wygodniej graj
 * Description: Katalog 12 gier, trafniejsze polecenia, zwarty widok gry i uzupełnienia SEO dla grywmig.pl.
 * Version: 1.0.0
 * Requires at least: 6.2
 * Requires PHP: 7.4
 * Author: Gry w Mig
 * License: GPL-2.0-or-later
 */

namespace GryWMig\Ulepszenia;

if (!defined('ABSPATH')) {
    exit;
}

const VERSION = '1.0.0';
const OPTION = 'gwm_ulepszenia_options';

function options() {
    return wp_parse_args(get_option(OPTION, array()), array('home' => 1, 'next' => 1, 'compact' => 1, 'seo' => 1));
}

/** Published pages are resolved at render time; activation never creates or edits a page. */
function games() {
    static $games;
    if (isset($games)) {
        return $games;
    }
    $rows = array(
        'krzyzowka' => array('krzyzowka-online', 'Mini krzyżówka', 'Siedem haseł. Jedna przyjemna przerwa.', 'slowa', '3–5 min', 'Codzienna', 'crossword'),
        'haslo' => array('wordle-po-polsku', 'Hasło w Mig', 'Pięć liter i sześć prób. Odkryj słowo dnia.', 'slowa', '3–5 min', 'Codzienna', 'wordle'),
        'alibi' => array('alibi-w-mig', 'Alibi w Mig', 'Porównaj zeznania. Wskaż sprawcę i kłamcę.', 'logiczne', '5–10 min', 'Detektywistyczna', 'alibi'),
        'sudoku' => array('sudoku-online', 'Sudoku', 'Trzy poziomy, notatki i plansza na dziś.', 'logiczne', 'Bez pośpiechu', 'Codzienna', 'sudoku'),
        'slowa_z_liter' => array('slowa-z-liter', 'Słowa z liter', 'Jeden zestaw liter. Ile słów znajdziesz?', 'slowa', '5 min', '', 'letters'),
        'anagram' => array('anagram-dnia', 'Anagram dnia', 'Uporządkuj litery i odsłoń ukryte słowo.', 'slowa', '2–5 min', 'Codzienny', 'anagram'),
        'mahjong' => array('mahjong-online', 'Mahjong', 'Szukaj par w trzech układach planszy.', 'logiczne', 'Bez pośpiechu', '', 'mahjong'),
        'kulki' => array('kulki-online', 'Kulki', 'Ustaw pięć w linii i zaplanuj kolejny ruch.', 'logiczne', '5–10 min', '', 'balls'),
        'pasjans' => array('pasjans-online', 'Pasjans', 'Klasyczny Klondike. Rozdaj sobie chwilę spokoju.', 'logiczne', 'Bez pośpiechu', '', 'cards'),
        'tajemnica' => array('tajemnica-w-mig', 'Tajemnica w Mig', 'Wejdź do pracowni zegarmistrza i rozwiąż trzy zagadki.', 'logiczne', '10–15 min', 'Zagadka', 'mystery'),
        'sky_rush' => array('sky-rush-3d', 'Sky Rush 3D', 'Skacz nad chmurami, zbieraj kryształy i używaj dasha.', '3d', 'Zręcznościowa', '3D', 'sky'),
        'latajace_auto' => array('latajace-auto', 'Latające Auto', 'Wzbij się w powietrze i pobij własny rekord.', '3d', 'Zręcznościowa', '2D / 3D', 'car'),
    );
    $games = array();
    foreach ($rows as $id => $row) {
        $page = get_page_by_path($row[0]);
        if (!$page || 'publish' !== $page->post_status) {
            continue;
        }
        $games[$id] = array(
            'id' => $id, 'slug' => $row[0], 'title' => $row[1], 'description' => $row[2],
            'category' => $row[3], 'duration' => $row[4], 'badge' => $row[5], 'art' => $row[6],
            'url' => get_permalink($page),
        );
    }
    return $games;
}

function current_game() {
    if (!is_page()) {
        return '';
    }
    $page = get_queried_object();
    foreach (games() as $id => $game) {
        if ($page && $game['slug'] === $page->post_name) {
            return $id;
        }
    }
    return '';
}

function recommendations($id) {
    $map = array(
        'krzyzowka' => array('haslo', 'anagram', 'slowa_z_liter'),
        'haslo' => array('krzyzowka', 'anagram', 'slowa_z_liter'),
        'alibi' => array('tajemnica', 'krzyzowka', 'sudoku'),
        'sudoku' => array('mahjong', 'kulki', 'krzyzowka'),
        'slowa_z_liter' => array('anagram', 'haslo', 'krzyzowka'),
        'anagram' => array('slowa_z_liter', 'haslo', 'krzyzowka'),
        'mahjong' => array('sudoku', 'kulki', 'pasjans'),
        'kulki' => array('mahjong', 'sudoku', 'pasjans'),
        'pasjans' => array('mahjong', 'sudoku', 'kulki'),
        'tajemnica' => array('alibi', 'krzyzowka', 'sudoku'),
        'sky_rush' => array('latajace_auto', 'kulki', 'mahjong'),
        'latajace_auto' => array('sky_rush', 'kulki', 'pasjans'),
    );
    $all = games();
    $result = array();
    foreach (isset($map[$id]) ? $map[$id] : array() as $other) {
        if (isset($all[$other])) {
            $result[] = $all[$other];
        }
    }
    return $result;
}

function art($game) {
    $url = plugins_url('assets/games.svg', __FILE__) . '#' . $game['art'];
    return '<svg class="gwm-u-art" aria-hidden="true" focusable="false" viewBox="0 0 240 132"><use href="' . esc_url($url) . '"></use></svg>';
}

function card($game) {
    ob_start();
    ?>
    <article class="gwm-u-card" data-gwm-category="<?php echo esc_attr($game['category']); ?>">
        <a class="gwm-u-card__link" href="<?php echo esc_url($game['url']); ?>">
            <div class="gwm-u-card__picture gwm-u-card__picture--<?php echo esc_attr($game['category']); ?>">
                <?php echo art($game); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped in art(). ?>
                <?php if ($game['badge']) : ?><span class="gwm-u-badge"><?php echo esc_html($game['badge']); ?></span><?php endif; ?>
            </div>
            <div class="gwm-u-card__body"><span class="gwm-u-duration"><?php echo esc_html($game['duration']); ?></span>
                <h3><?php echo esc_html($game['title']); ?></h3><p><?php echo esc_html($game['description']); ?></p>
                <span class="gwm-u-card__cta">Zagraj <span aria-hidden="true">→</span></span>
            </div>
        </a>
    </article>
    <?php
    return trim(ob_get_clean());
}

function next_section($id) {
    $items = recommendations($id);
    if (!$items) {
        return '';
    }
    ob_start();
    ?>
    <section class="gwm-next gwm-u-next" aria-label="Zagraj dalej">
        <p class="gwm-u-eyebrow">Jeszcze jedna runda?</p><h2>Zagraj dalej</h2>
        <p>Wybierz kolejne wyzwanie na swoją przerwę.</p>
        <div class="gwm-next__grid">
            <?php foreach ($items as $game) : ?>
                <a class="gwm-next__card" href="<?php echo esc_url($game['url']); ?>" data-gwm-track="next" data-from-game="<?php echo esc_attr($id); ?>" data-to-game="<?php echo esc_attr($game['id']); ?>">
                    <strong><?php echo esc_html($game['title']); ?></strong><span><?php echo esc_html($game['description']); ?></span><b>Zagraj →</b>
                </a>
            <?php endforeach; ?>
        </div>
    </section>
    <?php
    return trim(ob_get_clean());
}

function filter_content($content) {
    if (is_admin() || !is_main_query() || !in_the_loop() || !options()['next']) {
        return $content;
    }
    $id = current_game();
    if (!$id) {
        return $content;
    }
    $next = next_section($id);
    if (!$next) {
        return $content;
    }
    // Restrict replacement to the exact existing recommendation section, not game markup.
    $pattern = '~<section\b[^>]*\bclass\s*=\s*([\'"])(?:[^\'"]*\s)?gwm-next(?:\s[^\'"]*)?\1[^>]*>.*?</section\s*>~is';
    $count = 0;
    $updated = preg_replace_callback($pattern, function () use ($next) { return $next; }, $content, 1, $count);
    return $count ? $updated : $content . $next;
}
add_filter('the_content', __NAMESPACE__ . '\\filter_content', 99);

function home_enabled() {
    return options()['home'] && is_front_page() && !is_paged() && !is_feed() && !is_embed() && !is_search();
}

add_filter('template_include', function ($template) {
    return home_enabled() ? __DIR__ . '/templates/home.php' : $template;
}, 99);

add_filter('body_class', function ($classes) {
    if (home_enabled()) { $classes[] = 'gwm-u-home-page'; }
    if (current_game() && options()['compact']) { $classes[] = 'gwm-u-game-page'; }
    return $classes;
});

add_action('wp_enqueue_scripts', function () {
    $id = current_game();
    if (!home_enabled() && !$id) { return; }
    wp_enqueue_style('gwm-ulepszenia', plugins_url('assets/site.css', __FILE__), array(), VERSION);
    wp_enqueue_script('gwm-ulepszenia', plugins_url('assets/site.js', __FILE__), array(), VERSION, true);
    if ($id && options()['next']) {
        wp_add_inline_script('gwm-ulepszenia', 'window.gwmUpgrade=' . wp_json_encode(array('from' => $id, 'next' => recommendations($id))) . ';', 'before');
    }
}, 100);

function seo_data() {
    if (!options()['seo'] || !is_page()) { return array(); }
    $data = array(
        'latajace-auto' => array('Latające Auto — darmowa gra 2D i 3D online', 'Zagraj w Latające Auto online: wybierz tryb 2D lub 3D, omijaj przeszkody i popraw swój rekord. Darmowa gra w przeglądarce, bez logowania.'),
        'sky-rush-3d' => array('Sky Rush 3D — gra platformowa online', 'Skacz po platformach nad chmurami w Sky Rush 3D. Zbieraj kryształy, korzystaj z dasha i odkrywaj trzy strefy. Graj za darmo w przeglądarce.'),
        '7-dni-7-wyzwan' => array('7 dni, 7 wyzwań — codzienna chwila na grę', 'Odkryj siedem gier w siedem dni: mini krzyżówkę, Hasło w Mig, Słowa z liter, Kulki, Mahjong, Alibi i Sudoku. Bezpłatne wyzwanie bez logowania.'),
        'sudoku-online' => array('Sudoku online — graj za darmo po polsku', ''),
        'slowa-z-liter' => array('Słowa z liter — darmowa gra słowna online', ''),
        'anagram-dnia' => array('Anagram dnia — codzienna gra słowna po polsku', ''),
    );
    $page = get_queried_object();
    return $page && isset($data[$page->post_name]) ? $data[$page->post_name] : array();
}

add_filter('document_title_parts', function ($parts) {
    $data = seo_data();
    if ($data) { $parts['title'] = $data[0]; }
    return $parts;
}, 30);

function seo_plugin_title($title) {
    $data = seo_data();
    return $data ? $data[0] . ' | ' . get_bloginfo('name') : $title;
}
function seo_plugin_description($description) {
    $data = seo_data();
    return $data && $data[1] ? $data[1] : $description;
}
foreach (array('wpseo_title', 'rank_math/frontend/title', 'aioseo_title') as $hook) {
    add_filter($hook, __NAMESPACE__ . '\\seo_plugin_title', 30);
}
foreach (array('wpseo_metadesc', 'rank_math/frontend/description', 'aioseo_description') as $hook) {
    add_filter($hook, __NAMESPACE__ . '\\seo_plugin_description', 30);
}
add_action('wp_head', function () {
    $data = seo_data();
    if (!$data || !$data[1] || defined('WPSEO_VERSION') || defined('RANK_MATH_VERSION') || defined('AIOSEO_VERSION') || defined('SEOPRESS_VERSION') || defined('THE_SEO_FRAMEWORK_VERSION')) { return; }
    echo '<meta name="description" content="' . esc_attr($data[1]) . '">' . "\n";
}, 2);

// All four changes can be toggled separately; deleting the plugin leaves page content intact.
add_action('admin_init', function () {
    register_setting('gwm_ulepszenia', OPTION, array('type' => 'array', 'sanitize_callback' => function ($value) {
        $safe = array();
        foreach (array('home', 'next', 'compact', 'seo') as $key) { $safe[$key] = !empty($value[$key]) ? 1 : 0; }
        return $safe;
    }, 'default' => array()));
});
add_action('admin_menu', function () {
    add_options_page('Gry w Mig — ulepszenia', 'Gry w Mig — ulepszenia', 'manage_options', 'gwm-ulepszenia', function () {
        if (!current_user_can('manage_options')) { return; }
        $settings = options();
        echo '<div class="wrap"><h1>Gry w Mig — ulepszenia</h1><p>Zmiany działają jako nakładka. Wyłączenie modułu przywraca poprzedni widok.</p><form method="post" action="options.php">';
        settings_fields('gwm_ulepszenia');
        foreach (array('home' => 'Nowa strona główna i katalog gier', 'next' => 'Trzy dopasowane gry w sekcji Zagraj dalej', 'compact' => 'Zwarty nagłówek stron gier i układ Sudoku', 'seo' => 'Uzupełnienia tytułów i brakujących opisów SEO') as $key => $label) {
            echo '<p><label><input type="checkbox" name="' . esc_attr(OPTION) . '[' . esc_attr($key) . ']" value="1" ' . checked($settings[$key], 1, false) . '> ' . esc_html($label) . '</label></p>';
        }
        submit_button('Zapisz zmiany');
        echo '</form></div>';
    });
});
