=== Gry w Mig — wygodniej graj ===
Contributors: grywmig
Requires at least: 6.2
Requires PHP: 7.4
Stable tag: 1.0.2
License: GPL-2.0-or-later

Katalog gier, polecenia kolejnej gry i uzupełnienia SEO dla grywmig.pl.

== Instalacja ==
1. W panelu WordPress wybierz Wtyczki → Dodaj nową → Wyślij wtyczkę na serwer.
2. Wskaż grywmig-ulepszenia-1.0.2.zip, zainstaluj i włącz.
3. Jeśli używasz cache strony lub CDN, wyczyść cache po włączeniu.
4. Sprawdź stronę główną, Sudoku, Alibi, Hasło w Mig i obie gry 3D.

Ustawienia → Gry w Mig — ulepszenia pozwalają osobno wyłączyć każdy moduł.
Wyłączenie całej wtyczki przywraca poprzedni wygląd. Wtyczka nie edytuje treści
stron, motywu, mechaniki gier, wyników lokalnych ani ustawień analityki.

== Zawartość ==
* Nowa stopka z oryginalnym logo, linkami do gier, poradników i informacjami
  o serwisie. Zachowuje menu stopki oraz ustawioną politykę prywatności.
* Strona główna: wszystkie opublikowane gry w HTML, filtry, bezpośrednie
  odnośniki do krzyżówki, Hasła i Alibi, obecne poradniki, PDF i wyzwanie 7 dni.
* Zagraj dalej: trzy powiązane gry, dotychczasowe atrybuty pomiaru kliknięć.
  Dodatkowe skróty na widocznych ekranach wyniku Alibi, Hasła i Mahjong.
* Mniejsze odstępy nad grami i wokół sterowania Sudoku.
* Opisy meta dla Latającego Auta, Sky Rush 3D i wyzwania 7 dni.
* Bardziej opisowe tytuły stron tych trzech podstron oraz Sudoku,
  Słów z liter i Anagramu dnia.

== Zgodność ==
Przygotowano dla klasycznego motywu gry-w-mig i struktury stron grywmig.pl
odczytanej 23 października 2026. Wtyczka wyświetla tylko istniejące,
opublikowane strony o znanych nazwach. Nie zakłada nowych adresów.
Zachowuje get_header(), get_footer() i odnośniki do istniejących poradników.

Wspiera filtry opisów Yoast SEO, Rank Math i AIOSEO. Nie emituje dodatkowego
opisu meta przy wykryciu tych wtyczek, SEOPress lub The SEO Framework.
Przy innym narzędziu generującym opisy wyłącz moduł SEO i przenieś opisy
do używanego narzędzia. Moduł nie zmienia canonical, robots ani sitemapy.

Testy PHP i przeglądarki przeprowadzono na lokalnej makiecie API WordPressa
oraz kopii publicznego CSS motywu. Pełny test na aktywnym WordPressie
wymaga instalacji i dostępu do panelu. Nie gwarantujemy wzrostu pozycji.

== Zmiany ==
= 1.0.2 =
Krótsza góra strony na telefonach: trzy kompaktowe skróty i szybszy dostęp
do katalogu. Wygląd nagłówka, stopki i wersji komputerowej jest zachowany.

= 1.0.1 =
Nowa responsywna stopka, z osobnym przełącznikiem w ustawieniach.

= 1.0.0 =
Pierwsza wersja nakładki. Wersja nie zmienia samych silników gier.
