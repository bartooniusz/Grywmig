# Gry w Mig — pierwsza paczka ulepszeń

Gotowa wtyczka do istniejącego WordPressa na grywmig.pl. Przygotowana po audycie strony i danych Search Console / GA4 z 23 października 2026.

[**Pobierz ZIP do instalacji**](dist/grywmig-ulepszenia-1.0.3.zip)

## Co zmienia

- Nowa stopka w delikatnej zieleni: oryginalne logo, skróty do gier, poradniki, PDF i informacje o serwisie. Zachowuje zarejestrowane menu stopki i ustawioną politykę prywatności. Moduł stopki można osobno wyłączyć.

- Nowa strona główna w obecnej palecie: krem, zieleń i limonka. Wszystkie opublikowane gry znajduje się w HTML; filtry działają jako opcjonalne udogodnienie. Bez JavaScriptu nadal można uruchomić każdą grę.
- Trzy dopasowane propozycje w „Zagraj dalej”, zamiast dziewięciu równorzędnych. Skróty do kolejnej gry także na ekranach wyniku Alibi, Hasła i Mahjong.
- Mniejsze odstępy na stronach gier, z poprawkami sterowania Sudoku na wąskim ekranie.
- Brakujące opisy meta dla Latającego Auta, Sky Rush 3D i „7 dni, 7 wyzwań”, lepsze tytuły sześciu podstron.
- Zachowane linki do obecnych poradników, Sudoku PDF oraz wyzwania 7 dni.

Wtyczka nie zastępuje motywu ani silników gier. Nie edytuje treści stron, zapisów graczy ani konfiguracji GA4 i zgód. Każdy moduł można osobno wyłączyć w **Ustawienia → Gry w Mig — ulepszenia**; dezaktywacja przywraca poprzedni widok.

## Instalacja

1. Pobierz gotowy plik `dist/grywmig-ulepszenia-1.0.3.zip` — archiwum całego repozytorium nie jest paczką instalacyjną wtyczki.
2. WordPress: **Wtyczki → Dodaj nową → Wyślij wtyczkę na serwer**, wybierz ZIP i włącz.
3. Wyczyść cache strony / CDN, jeśli jest używany.
4. Sprawdź stronę główną, filtry, Sudoku oraz zakończenie gry Alibi/Hasło/Mahjong. W źródle trzech poprawianych stron sprawdź pojedynczy opis meta. Nie zmieniaj istniejących adresów poradników.

Przeznaczona dla obecnego klasycznego motywu `gry-w-mig`. Zachowuje natywny nagłówek, stopkę, analitykę i istniejące publiczne adresy. Nie dodaje własnej analityki. Czasy na kartach są orientacyjne.

## Zakres weryfikacji

Testy używają małej makiety API WordPressa i rzeczywistego publicznego CSS motywu, nie kopii całej instalacji. Weryfikują m.in. nienaruszanie treści gry, polecenia, przełączniki, opisy SEO, filtry z klawiatury, działanie bez JS, widoki 320/390/768/1440 px i brak poziomego przewijania. Pełna zgodność aktywnych wtyczek wymaga sprawdzenia po instalacji w WordPressie.

```sh
npm install --prefix work @php-wasm/cli@3.1.60 playwright-core@1.61.0
PHP=7.4 node work/node_modules/@php-wasm/cli/php-wasm.js test/plugin.php
PHP=8.3 node work/node_modules/@php-wasm/cli/php-wasm.js test/plugin.php
node scripts/build.mjs
# Test przeglądarki wymaga Chromium oraz pliku CSS motywu w test/output/theme.css.
PHP=7.4 node work/node_modules/@php-wasm/cli/php-wasm.js test/render.php > test/output/index.html
node test/browser.mjs
```

## Dalszy rozwój ruchu

Najbliższy etap opisano w [planie na 30 dni](docs/plan-ruchu.md). Silniki gier, nowe zagadki i słowniki pozostają osobnym zadaniem po uzyskaniu oryginalnych źródeł. Ta paczka nie obiecuje określonej liczby wejść ani pozycji w Google.

## Kampania Halloween

Nowa gra ma osobną wtyczkę: `dist/grywmig-halloween-alibi-1.0.0.zip`. Po aktywacji tworzy stronę `/halloweenowe-alibi/`, gdy adres jest wolny. Nie zmienia istniejącego Alibi. Katalog 1.0.3 dodaje kartę nowej gry po jej publikacji.

Materiały, opisy z linkami UTM i plan testu znajdują się w `campaign/halloween/` oraz `dist/kampania-halloween/`. Wybrane narzędzie publikacji to Metricool; docelowa strona Facebook ma ID `61595039801968`. Publikacja wymaga działającej strony gry i połączonej właściwej marki.
