# Plan zmiany strony imtosoftware.pl
*Cel: zwiększenie sprzedaży i dotarcia z rozwiązaniem · 2026-07-02*

---

## 1. CO OFERTOWAĆ — nowa architektura oferty

Rynek MŚP 2026 kupuje: mały start, szybki ROI, konkretny proces (nie "technologię"). Najszybszy zwrot i największy popyt mają: przetwarzanie dokumentów (OCR+AI), obsługa klienta (chatboty/agenci), automatyzacja sprzedaży i ofertowania. Typowe wdrożenie, jakiego oczekuje rynek: 1–6 tygodni.

### Trzy poziomy oferty (drabinka wejścia)

**START — pojedyncza automatyzacja · 8–15 tys. zł · 2–3 tygodnie**
Jeden proces, mierzalny efekt, minimalne ryzyko. To brakujący dziś produkt wejściowy — obecne "od 30 tys. zł" odcina większość MŚP.

**AI AGENT / INTEGRACJA — proces end-to-end · 30–80 tys. zł · 4–8 tygodni**
Obecny rdzeń oferty. Agent AI wpięty w proces + integracja z ERP/CRM + dashboard.

**SYSTEM — dedykowane oprogramowanie · 80–250 tys. zł · 3–6 miesięcy**
CRM/ERP/WMS szyte na miarę, portale B2B, systemy produkcyjne. Sprzedawane etapami, często jako naturalna kontynuacja poziomu 1–2.

**OPIEKA — abonament miesięczny**
Utrzymanie, monitoring, rozwój, szkolenia. Stały przychód + retencja klienta. Wyceniać jawnie (np. od 1,5–3 tys. zł/mc).

### Konkretne rozwiązania do ofertowania (wg popytu)

| # | Rozwiązanie | Czego szuka klient | Poziom |
|---|---|---|---|
| 1 | **OCR faktur i dokumentów** (faktury, WZ, zamówienia, reklamacje, zgłoszenia serwisowe → dane do ERP/księgowości) | "koniec przepisywania" — najczęściej automatyzowany proces w MŚP | START |
| 2 | **Agent obsługi skrzynki/zapytań** (mail → zadania, kategoryzacja, odpowiedzi na standardowe pytania) | odciążenie biura, odpowiedź 24/7 | START |
| 3 | **Chatbot/voicebot na stronie i w obsłudze klienta** (baza wiedzy firmy, kwalifikacja leadów, umawianie spotkań) | obsługa do 95% standardowych interakcji | START/AGENT |
| 4 | **Agent ofertowania** (analiza zapytania → dopasowanie produktów → draft oferty; scoring ofert dostawców — masz case Vande) | szybsze odpowiedzi = wyższa konwersja (10–20%) | AGENT |
| 5 | **Automatyzacje no-code (Make/n8n) + AI** łączące istniejące narzędzia klienta | "nie chcę nowego systemu, chcę żeby obecne gadały ze sobą" | START |
| 6 | **Raportowanie Power BI + automatyczne przepływy danych** | właściciel chce widzieć firmę bez Exceli | AGENT |
| 7 | **Copilot wiedzy firmowej** (wyszukiwanie w SOP, dokumentacji, umowach) | nowi pracownicy, mniej pytań do "tej jednej osoby, która wie" | AGENT |
| 8 | **WMS / magazyn bez papieru** (masz case + wpis blogowy) | produkcja/logistyka — cyfryzacja hali | SYSTEM |
| 9 | **Planowanie i harmonogramowanie produkcji** | wąskie gardła, przestoje | SYSTEM |
| 10 | **IoT + predykcyjne utrzymanie ruchu** (masz case SKI19 — 150 maszyn) | rosnący kierunek inwestycji w produkcji | SYSTEM |

Zasada komunikacji: sprzedawaj **proces i efekt** ("faktury księgują się same — 20 h/mc mniej pracy"), nie technologię ("OCR/NLP na Azure").

### Dotacje — wersja bezpieczna (bez obiecywania pomocy)
Nie musisz prowadzić formalności. Wystarczy: (a) box na stronie "Wdrożenia AI dla MŚP bywają objęte dofinansowaniem (np. programy PARP) — nasza wycena i dokumentacja projektu nadają się wprost do wniosku", (b) opcjonalnie partnerstwo z firmą doradczą od dotacji (polecenie za prowizję), (c) wpis blogowy informacyjny. Zero zobowiązań, a temat pracuje na Ciebie.

---

## 2. NOWA STRUKTURA STRONY (docelowy sitemap)

```
/                          — strona główna (przebudowa sekcji oferty na 3 poziomy)
/uslugi/automatyzacja-start   — pakiet START (nowa, priorytet #1)
/uslugi/ai-agenci             — agenci AI + chatboty (nowa)
/uslugi/integracje-power-bi   — integracje ERP/CRM + raportowanie (nowa)
/uslugi/dedykowane-oprogramowanie — systemy CRM/ERP/WMS (nowa)
/dla-produkcji             — landing branżowy: IoT, WMS, planowanie (nowa)
/dla-msp                   — landing branżowy: biuro, sprzedaż, dokumenty (nowa)
/realizacje/…              — bez zmian + blok "Efekt biznesowy" w case'ach
/o-nas, /blog, /kontakt    — bez zmian strukturalnych
```

Każda podstrona usługi: problem → jak działa (3 kroki) → case + liczby → cena "od" i czas → FAQ → CTA (kalendarz).

---

## 3. PLAN WDROŻENIA

### Faza 0 — fundament techniczny (tydzień 1)
- [ ] Clarity warunkowo po zgodzie cookie (RODO)
- [ ] Zdarzenia konwersji: formularz, tel, mail, kalendarz (bez tego nie zmierzymy efektu)
- [ ] Calendly/Cal.com pod wszystkie CTA "Umów konsultację"
- [ ] Autoresponder formularza z linkiem do kalendarza
- [ ] Poprawki: spójność "2–4 tyg.", nazwy technologii, LinkedIn, stopka PL/EN/DE, favicon, hreflang

### Faza 1 — oferta na stronie głównej (tydzień 2)
- [ ] Przebudowa sekcji "Usługi" na 3 poziomy oferty (START / AI AGENT / SYSTEM + OPIEKA)
- [ ] Nowa sekcja "Od czego zacząć?" — pakiet START z ceną i czasem jako główne CTA
- [ ] Box o dofinansowaniu (wersja bezpieczna)
- [ ] Zdjęcie/twarz przy sekcji kontakt ("porozmawiasz z Grzegorzem")

### Faza 2 — podstrony usług (tygodnie 3–6, jedna tygodniowo)
- [ ] /uslugi/automatyzacja-start (priorytet — nowy produkt wejściowy)
- [ ] /uslugi/ai-agenci
- [ ] /uslugi/integracje-power-bi
- [ ] /uslugi/dedykowane-oprogramowanie
- [ ] Aktualizacja nawigacji (dropdown "Usługi") i sitemap.xml

### Faza 3 — dowody i branże (tygodnie 7–10)
- [ ] Blok "Efekt biznesowy" w top 3 case'ach (DocFlow, SKI19, Alphatex) — liczby w h/zł
- [ ] Pełne testimoniale (imię i nazwisko + zdjęcie, zgody od klientów)
- [ ] Logotypy klientów lokalnie (WebP/SVG) + optymalizacja obrazów całej strony
- [ ] /dla-produkcji i /dla-msp
- [ ] Google Business Profile + pierwsze opinie; profil Clutch

### Faza 4 — lejek treści (tygodnie 11–14)
- [ ] Lead magnet: kalkulator ROI automatyzacji lub checklist PDF + zapis na newsletter
- [ ] CTA kontekstowe i powiązane case'y na końcu każdego wpisu blogowego
- [ ] 2 nowe wpisy pod frazy komercyjne ("automatyzacja faktur", "chatbot dla firmy")
- [ ] Wersje DE/EN: przetłumaczone meta/slugi, nowe podstrony usług

### Rytm stały (co miesiąc)
- [ ] 2 wpisy blogowe (PL, wybrane DE), przegląd nagrań Clarity, raport KPI

---

## 4. POMIAR SUKCESU
Baza: dzisiejsza liczba leadów/mc i konwersja (do zmierzenia w Fazie 0). Cele po 3 miesiącach: konwersja odwiedziny→lead ≥ 2,9% (mediana B2B), 50%+ leadów przez kalendarz, pierwsze leady organiczne na frazy usługowe. KPI miesięczne: leady wg źródła, konwersja %, pozycje fraz (Search Console), czas reakcji na leada.
