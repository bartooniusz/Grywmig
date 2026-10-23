=== Halloweenowe Alibi ===
Version: 1.0.0
Requires PHP: 7.4
License: GPL-2.0-or-later

Trzy autorskie zagadki po polsku. W każdej jest jeden sprawca i dokładnie jeden
kłamca. Każdą sprawę sprawdzono przez wyczerpujące przeliczenie możliwości.

INSTALACJA
WordPress → Wtyczki → Dodaj nową → Wyślij wtyczkę na serwer.
Wybierz grywmig-halloween-alibi-1.0.0.zip i włącz wtyczkę.

Jeśli adres halloweenowe-alibi jest wolny, wtyczka utworzy i opublikuje stronę
/halloweenowe-alibi/ ze shortcode [grywmig_halloween_alibi]. Jeżeli strona o tym
adresie już istnieje, pozostawi ją bez zmian. Możesz wtedy dodać shortcode
ręcznie do wybranej strony. Wtyczka nie edytuje starego Alibi, motywu ani wyników.
Dezaktywacja nie usuwa strony. Wtyczkę można odinstalować standardowo.

FUNKCJE
Trzy sprawy, wskazanie sprawcy i kłamcy, trzy podpowiedzi na sprawę,
odsłanianie rozwiązania po potwierdzeniu, dowód rozwiązania, lokalny zapis,
czas aktywnej gry i udostępnianie wyniku bez zdradzania odpowiedzi.
Ukończenie przez odsłonięcie rozwiązania nie liczy się jako wygrana.

POMIAR
Gra przekazuje do strony nadrzędnej komunikaty tylko z własnego iframe.
Most sprawdza origin i źródło komunikatu. Gdy witryna ma już window.gtag,
korzysta z istniejącego tagu oraz jego konfiguracji zgód; nie ładuje nowego GA4.
Zdarzenia: game_start, game_complete, hint_used, solution_revealed,
share_click, next_game_click. Parametr game_id: halloween_alibi.
game_complete następuje raz po poprawnym wskazaniu obu osób. Udostępnienie
jest kliknięciem/otwarciem udostępniania, nie potwierdzeniem publikacji.
Przed kampanią sprawdź zdarzenia w GA4 DebugView i działanie banera zgód.
Niezależnie emitowany jest CustomEvent gwm:halloween_event na stronie nadrzędnej.

Gra działa bez internetu po pobraniu własnych plików. Wyniki są lokalne,
bez publicznego rankingu. Nie dodaje cookies ani rejestracji.
