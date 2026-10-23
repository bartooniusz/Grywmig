<?php
namespace GryWMig\Ulepszenia;
if (!defined('ABSPATH')) { exit; }
get_header();
$all = games();
?>
<main id="main-content" class="site-main gwm-u">
    <section class="gwm-u-hero gwm-u-wrap" aria-labelledby="gwm-u-title">
        <div class="gwm-u-hero__copy">
            <p class="gwm-u-eyebrow"><span aria-hidden="true">✳</span> Mała przerwa. Dobry ruch.</p>
            <h1 id="gwm-u-title">Masz chwilę?<br><span>Zagraj w Mig.</span></h1>
            <p>Słowa, zagadki i odrobina przygody. Wybierz grę na swoją przerwę — za darmo, bez logowania.</p>
            <a class="gwm-u-button" href="#gry">Wybieram grę <span aria-hidden="true">↓</span></a>
        </div>
        <aside class="gwm-u-today" aria-labelledby="gwm-u-today-title">
            <div class="gwm-u-today__heading"><span class="gwm-u-spark" aria-hidden="true">✦</span><div><p class="gwm-u-eyebrow">Twój mały rytuał</p><h2 id="gwm-u-today-title">Na dobry początek</h2></div></div>
            <?php foreach (array('krzyzowka', 'haslo', 'alibi') as $index => $id) : if (!isset($all[$id])) { continue; } $game = $all[$id]; ?>
                <a class="gwm-u-today__game" href="<?php echo esc_url($game['url']); ?>"><span class="gwm-u-today__number" aria-hidden="true"><?php echo esc_html('0' . ($index + 1)); ?></span><span><strong><?php echo esc_html($game['title']); ?></strong><small><?php echo esc_html($game['duration']); ?></small></span><span aria-hidden="true">→</span></a>
            <?php endforeach; ?>
        </aside>
    </section>
    <section class="gwm-u-catalog gwm-u-wrap" id="gry" aria-labelledby="gwm-u-catalog-title">
        <div class="gwm-u-section-heading"><div><p class="gwm-u-eyebrow">Na co masz dziś ochotę?</p><h2 id="gwm-u-catalog-title">Twoja następna ulubiona gra</h2></div><span class="gwm-u-count"><?php echo esc_html(count($all)); ?> gier do odkrycia</span></div>
        <div class="gwm-u-filters" role="group" aria-label="Filtruj gry" hidden>
            <?php foreach (array('all' => 'Wszystkie', 'slowa' => 'Słowne', 'logiczne' => 'Logiczne', '3d' => 'Zręcznościowe i 3D') as $category => $label) : ?>
                <button type="button" class="gwm-u-filter" data-gwm-filter="<?php echo esc_attr($category); ?>" aria-pressed="<?php echo 'all' === $category ? 'true' : 'false'; ?>" aria-controls="gwm-u-games"><?php echo esc_html($label); ?></button>
            <?php endforeach; ?>
        </div>
        <p class="gwm-u-sr" role="status" aria-live="polite" data-gwm-filter-status></p>
        <div class="gwm-u-grid" id="gwm-u-games"><?php foreach ($all as $game) { echo card($game); /* escaped by card(). */ } ?></div>
    </section>
    <section class="gwm-u-bottom gwm-u-wrap" aria-label="Więcej sposobów na grę">
        <?php $challenge = get_page_by_path('7-dni-7-wyzwan'); if ($challenge && 'publish' === $challenge->post_status) : ?>
        <a class="gwm-u-promo" href="<?php echo esc_url(get_permalink($challenge)); ?>"><span class="gwm-u-eyebrow">Odrobina zabawy każdego dnia</span><h2>7 dni. 7 wyzwań.</h2><p>Odkryj gry po kolei i znajdź swój ulubiony rytuał.</p><strong>Sprawdź wyzwanie <span aria-hidden="true">→</span></strong></a>
        <?php endif; ?>
        <?php $print = get_page_by_path('sudoku-do-druku'); if ($print && 'publish' === $print->post_status) : ?>
        <a class="gwm-u-promo gwm-u-promo--paper" href="<?php echo esc_url(get_permalink($print)); ?>"><span class="gwm-u-eyebrow">Chwila z ołówkiem</span><h2>Sudoku na papierze</h2><p>Pobierz bezpłatne plansze PDF i rozwiązuj, gdzie chcesz.</p><strong>Pobierz plansze <span aria-hidden="true">→</span></strong></a>
        <?php endif; ?>
    </section>
    <?php $guides = get_posts(array('post_type' => 'post', 'post_status' => 'publish', 'numberposts' => 3)); if ($guides) : ?>
    <section class="gwm-u-guides gwm-u-wrap" id="artykuly" aria-labelledby="gwm-u-guides-title">
        <p class="gwm-u-eyebrow">Poznaj zasady i wskazówki</p><h2 id="gwm-u-guides-title">Czytaj i graj lepiej</h2>
        <div class="gwm-u-guide-grid"><?php foreach ($guides as $guide) : ?>
            <a href="<?php echo esc_url(get_permalink($guide)); ?>"><h3><?php echo esc_html(get_the_title($guide)); ?></h3><p><?php echo esc_html(wp_trim_words(wp_strip_all_tags(get_the_excerpt($guide)), 22)); ?></p><strong>Czytaj poradnik <span aria-hidden="true">→</span></strong></a>
        <?php endforeach; ?></div>
    </section>
    <?php endif; ?>
</main>
<?php get_footer(); ?>
