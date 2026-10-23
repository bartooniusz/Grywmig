# Plan rozwoju grywmig.pl — 30 dni

Punkt odniesienia: 23.09–20.10.2026, identyczny okres w obu źródłach. Search Console: 3 kliknięcia i 84 wyświetlenia. GA4: 76 sesji; 47 na telefonach i 47 przypisanych do źródeł Facebooka. Próba jest mała: nie wyciągamy z niej stabilnego rankingu popularności gier. Wszystkie 12 stron gier było zaindeksowanych; sitemap nie zgłaszał błędów.

## Tydzień 1: wdrożenie i kontrola

Zainstaluj paczkę ulepszeń. Sprawdź wygląd na telefonie, brak błędów konsoli i pojedyncze opisy meta. Zweryfikuj obecne zdarzenia `game_start`, `game_complete`, kliknięcia kolejnej gry i udostępnienia osobno dla każdej gry. Szczególnie sprawdź gry w iframe: nie zakładaj, że pomiar działa, dopóki nie zobaczysz testowego zdarzenia. Nie dodawaj drugiego wywołania GA4 do istniejącego mechanizmu.

## Tydzień 2: mini krzyżówka

To dobry pierwszy temat SEO: miała najwięcej wyświetleń strony gry w dotychczasowym, małym zbiorze. Przygotuj jeden konkretny poradnik „Mini krzyżówka online — zasady i przykład rozwiązania”: pokaż prawdziwą planszę, wybór definicji, wpisywanie całego hasła, przycisk polskich znaków i działanie podpowiedzi. Podlinkuj grę z pierwszych akapitów, a poradnik z sekcji zasad gry. Nie twórz kilkunastu bardzo podobnych podstron na odmiany jednej frazy.

## Tydzień 3: regularne powroty

Promuj istniejące Hasło dnia, Alibi i wyzwanie 7 dni. Przygotuj 2–3 krótkie nagrania prawdziwej rozgrywki: „Który świadek kłamie?”, jeden anagram i przejście fragmentu Sky Rush 3D. Każdy materiał powinien prowadzić do konkretnej gry. Linki kampanii oznacz spójnie, np. `utm_source=facebook&utm_medium=organic_social&utm_campaign=alibi_pazdziernik`. W tej paczce nic nie opublikowano w mediach społecznościowych.

## Tydzień 4: oceń wyniki, potem wybierz silnik do rozbudowy

Porównaj kolejne 28 dni z okresem bazowym: kliknięcia i zapytania Google, sesje z podziałem na źródła, wejścia na każdą grę, liczbę graczy rozpoczynających/kończących grę i przejścia do następnej. Zdarzenia start/koniec licz na poziomie użytkownika i sesji; surowy iloraz liczby zdarzeń nie jest wiarygodnym lejkiem. Nie porównuj ruchu po publikacji Facebooka z poprzednim okresem bez rozdzielenia kanałów.

Po pozyskaniu kodu rozważ: akceptację słów bonusowych w Słowach z liter, więcej odcinków Tajemnicy oraz kolejne sprawy Alibi po obecnym sezonie. Najpierw sprawdź wyniki graczy i faktyczne problemy. Sudoku ma już notatki, cofanie i podpowiedzi; Mahjong ma gwarancję początkowo rozwiązywalnego układu. Nie przedstawiaj tych funkcji jako brakujących.

Szybkość: nie uzyskano danych CrUX, więc nie ma podstaw do podawania wyników Core Web Vitals. Najpierw zmierz stronę na telefonie. Nie ładuj silników 3D na stronie katalogu; wtyczka korzysta wyłącznie z lekkich ilustracji SVG i małego skryptu filtrów.
