<?php
namespace GryWMig\Ulepszenia;
if (!defined('ABSPATH')) { exit; }
$footer_games = games();
$privacy_url = get_privacy_policy_url();
$discover = array('7-dni-7-wyzwan' => '7 dni, 7 wyzwań', 'sudoku-do-druku' => 'Sudoku do druku', 'o-nas' => 'O nas');
?>
<footer class="gwm-u-footer" aria-label="Stopka Gry w Mig">
    <div class="gwm-u-wrap">
        <div class="gwm-u-footer__invitation">
            <div><p class="gwm-u-footer__eyebrow"><span aria-hidden="true">✳</span> Chwila dla siebie, zawsze pod ręką</p><h2>Dobry moment na jeszcze jedną rundę.</h2></div>
            <a class="gwm-u-footer__button" href="<?php echo esc_url(home_url('/#gry')); ?>">Znajdź swoją grę <span aria-hidden="true">→</span></a>
        </div>
        <div class="gwm-u-footer__columns">
            <div class="footer-brand gwm-u-footer__brand">
                <a class="brand" href="<?php echo esc_url(home_url('/')); ?>" rel="home" aria-label="Gry w Mig — strona główna"><span class="brand-mark" aria-hidden="true">G</span><span class="brand-title">Gry w Mig</span></a>
                <p>Słowa, zagadki i małe przygody.<br>Znajdź chwilę na dobrą grę.</p>
                <span class="gwm-u-footer__note"><span aria-hidden="true"></span> Za darmo. Bez logowania.</span>
            </div>
            <nav class="gwm-u-footer__games" aria-labelledby="gwm-footer-games-title">
                <h2 id="gwm-footer-games-title">Wybierz swoją grę</h2>
                <ul><?php foreach (array('krzyzowka', 'haslo', 'sudoku', 'slowa_z_liter', 'alibi', 'mahjong', 'sky_rush', 'latajace_auto') as $id) : if (!isset($footer_games[$id])) { continue; } $game = $footer_games[$id]; ?>
                    <li><a href="<?php echo esc_url($game['url']); ?>"><?php echo esc_html($game['title']); ?></a></li>
                <?php endforeach; ?></ul>
            </nav>
            <nav class="gwm-u-footer__discover" aria-labelledby="gwm-footer-discover-title">
                <h2 id="gwm-footer-discover-title">Odkrywaj więcej</h2>
                <ul><li><a href="<?php echo esc_url(home_url('/category/poradniki/')); ?>">Poradniki i zasady</a></li>
                <?php foreach ($discover as $slug => $label) : $page = get_page_by_path($slug); if (!$page || 'publish' !== $page->post_status) { continue; } ?>
                    <li><a href="<?php echo esc_url(get_permalink($page)); ?>"><?php echo esc_html($label); ?></a></li>
                <?php endforeach; ?></ul>
            </nav>
        </div>
        <?php wp_nav_menu(array('theme_location' => 'footer', 'container' => 'nav', 'container_aria_label' => 'Dodatkowe informacje', 'container_class' => 'gwm-u-footer__extra', 'menu_class' => 'gwm-u-footer__extra-list', 'fallback_cb' => false, 'depth' => 1)); ?>
        <div class="gwm-u-footer__bottom">
            <p>© <?php echo esc_html(wp_date('Y')); ?> Gry w Mig. Miło, że grasz z nami.</p>
            <div><?php if ($privacy_url) : ?><a href="<?php echo esc_url($privacy_url); ?>">Polityka prywatności</a><?php endif; ?><a href="#main-content">Wróć na górę <span aria-hidden="true">↑</span></a></div>
        </div>
    </div>
</footer>
