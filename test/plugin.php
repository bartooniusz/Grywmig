<?php
error_reporting(E_ALL);
set_error_handler(function ($severity, $message, $file, $line) { throw new Exception("$message at $file:$line"); });
require __DIR__ . '/bootstrap.php';
use function GryWMig\Ulepszenia\games;
use function GryWMig\Ulepszenia\recommendations;
use function GryWMig\Ulepszenia\filter_content;
use function GryWMig\Ulepszenia\seo_data;
$passed = 0;
function check($condition, $label) { if (!$condition) { throw new Exception('FAIL: ' . $label); } $GLOBALS['passed']++; }

check(count(games()) === 12, 'all twelve published games');
foreach (games() as $id => $game) {
    $next = recommendations($id);
    check(count($next) === 3, 'three recommendations: ' . $id);
    check(!in_array($id, array_column($next, 'id'), true), 'no self recommendation: ' . $id);
    check(count(array_unique(array_column($next, 'id'))) === 3, 'no duplicate recommendations: ' . $id);
}
$test_slug = 'sudoku-online';
$game = '<section class="gwm-game gwm-sudoku" data-gwm-sudoku><button data-hint>Podpowiedź</button></section>';
$old = '<section aria-label="Zagraj dalej" class="gwm-next"><h2>Old</h2><div>nine links</div></section>';
$tail = '<section><h2>Jak grać</h2></section>';
$new = filter_content($game . $old . $tail);
check(strpos($new, $game) === 0, 'game markup unchanged');
check(substr($new, -strlen($tail)) === $tail, 'guide markup preserved');
check(substr_count($new, 'data-gwm-track="next"') === 3, 'old nine links replaced by three');
check(strpos($new, 'data-from-game="sudoku"') !== false, 'tracking attributes preserved');
check(filter_content($new) === $new, 'filter idempotent');
check(substr_count(filter_content($game), 'gwm-u-next') === 1, 'missing section appended');
$similar = '<section class="gwm-next-other">Keep this section</section>';
check(strpos(filter_content($similar), $similar) === 0, 'similar class names are not replaced');
$test_options = array('next' => 0);
check(filter_content($game . $old) === $game . $old, 'recommendation module can be disabled');
$test_options = array(); $test_main = false;
check(filter_content($game) === $game, 'secondary queries unaffected');
$test_main = true; $test_slug = 'o-nas';
check(filter_content($game) === $game, 'other pages unaffected');
foreach (array('latajace-auto', 'sky-rush-3d', '7-dni-7-wyzwan') as $test_slug) {
    $data = seo_data();
    check(!empty($data[1]), 'missing meta filled: ' . $test_slug);
    ob_start(); foreach ($hooks['wp_head'] as $callback) { $callback(); } $head = ob_get_clean();
    check(substr_count($head, 'name="description"') === 1, 'one description tag');
}
$test_slug = 'sudoku-online';
check(seo_data()[1] === '', 'existing descriptions not overwritten');
$test_slug = 'sky-rush-3d'; define('WPSEO_VERSION', 'test');
ob_start(); foreach ($hooks['wp_head'] as $callback) { $callback(); } $head = ob_get_clean();
check($head === '', 'SEO plugin prevents duplicate meta output');
check(strpos(GryWMig\Ulepszenia\seo_plugin_description('existing'), 'Skacz po platformach') === 0, 'Yoast/RankMath/AIOSEO description filter');
$test_options = array('seo' => 0);
check(seo_data() === array(), 'SEO module can be disabled');
$test_options = array(); $test_slug = '';
ob_start(); require __DIR__ . '/../plugins/grywmig-ulepszenia/templates/home.php'; $home = ob_get_clean();
check(substr_count($home, 'class="gwm-u-card"') === 12, 'server renders entire catalogue');
check(strpos($home, 'id="artykuly"') !== false && strpos($home, '/2026/10/07/13/') !== false, 'existing guide remains linked');
check(strpos($home, '/7-dni-7-wyzwan/') !== false && strpos($home, '/sudoku-do-druku/') !== false, 'existing challenge and printable pages remain linked');
check(substr_count($home, '<main') === 1, 'one main landmark');
echo $passed . " PHP checks passed\n";
