# Wstęp do rachunku prawdopodobieństwa - Łańcuchy Markowa
Tematem projektu, który wybrałem są Łańcuchy Markowa. Zdecydowałem się zgłębić to zagadnienie w kontekście szachów.
## Projekt - Wykonanie
Projekt został wykonany w formie strony internetowej. Całość została zrealizowana za pomocą HTML, CSS oraz JavaScript.
## Projekt - Działanie
-
## Projekt - podłoże teoretyczne
Niezbędnym składnikiem do rozpoczęcia jakichkolwiek rozważań przy temacie Łańcuchów Markowa jest przestrzeń stanów. Niezależnie od tego nad czym konkretnie będziemy się
zastanawiać, musimy ją określic. W przypadku tematyki mojego projektu, przestrzenią stanów jest cała szachownica.

![Przestrzeń Stanów](./article/state_space.png)

Każdy kwadrat reprezentuje jeden z 64 stanów.

Kolejnym składnikiem, bez którego rozważania nie miałyby sensu jest funkcja przejścia albo macierz przejścia, z której możemy odczytać
prawdopodobieństwo przejścia z jednego stanu do drugiego. W zależności od tego nad czym konkretnie będziemy się zastanawiać, macierz przejścia będzie inna.
Gdybyśmy chcieli wyznaczyć taką funkcję przejścia prawdopodobieństwa, zaczęlibyśmy rysować z każdego kwadratu (każdego stanu) strzałki do innych kwadratów, do których mamy
możliwość przemieszczenia się. W zależności od tego jaką bierką byśmy się poruszali, strzałki byłyby inaczej kierowane, jednak koniec końcow na pewno wyszedłby nam jeden wielki
bazgroł. Dlatego czytelniejszą formą będzie na pewno macierz przejścia.

![Funkcja przejścia](./article/probability_function.png)
