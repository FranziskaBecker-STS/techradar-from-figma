# SYZYGY Techradar – responsive Vorschau

Lauffähige React-/TypeScript-Anwendung mit Vite, React Router und eigenem CSS.
Die Figma-Datei wurde nur über MCP gelesen. Dieses Repository enthält ausschließlich das Techradar-Projekt; die übrigen Dateien des ursprünglichen Arbeitsordners wurden nicht übernommen.

## Start

Voraussetzung: Node.js 22.12 oder neuer; getestet mit Node.js 24.12.

```sh
npm install
npm run dev
```

Vorschau: http://127.0.0.1:5173

```sh
npm run build
npm test
npm run preview
npm run test:browser
npm run test:hover
npm run test:select
npm run test:topic
npm run test:keyboard
npm run test:details
```

`build` prüft TypeScript und erstellt die Produktionsdateien in `dist/`.
Die Browserprüfung benötigt eine installierte Google-Chrome-Version. Der Entwicklungsserver muss laufen.
Auf einem statischen Hosting müssen unbekannte URL-Pfade auf `index.html` zurückgeführt werden, damit direkte Detail-URLs funktionieren.

## Umgesetzter Umfang

- `/`: Homepage; Radar-/Listenwechsel, lokale Schlagwortsuche, Themenfilter und Kategorieauswahl im Inhaltsbereich. Header und Einführung bleiben stehen.
- Die Schlagwortsuche aktualisiert Treffer und URL erst mit Enter. Während des Tippens bleibt die zuletzt bestätigte Suche aktiv; Ansichts- und Kategoriewechsel übernehmen den unbestätigten Text nicht. Der Löschbutton setzt die Suche ausdrücklich zurück. Direkte URLs mit `q` laden die bestätigte Suche.
- `/techniques`: Bewertungsabschnitte mit originalen Figma-Beispielnamen.
- `/platforms`, `/tools`, `/languages-frameworks`: weitere Quadrantenseiten mit ihren jeweiligen Original-Radargrafiken auf Desktop, Bewertungsabschnitten und Links zwischen allen vier Quadranten. Mobil zeigen alle vier Kategorien die statische Homepage-Grafik.
- `/techniques/devops`: vollständiger DevOps-Artikel und verwandte Themen.
- `/languages-frameworks/opentofu`, `/languages-frameworks/figma`, `/languages-frameworks/typescript`, `/tools/github-copilot`, `/tools/gitlab`: weitere Artikel aus den bereitgestellten Screenshots, erreichbar über Suche, Kategoriekarten und die mobile Themenauswahl.
- `/techradar`: Erklärung mit Quadranten, Ringen, Originalgrafik und Credits.
- Navigation über Links und Breadcrumbs, Browser-Zurück, direkte Seiten-URLs.
- Gemeinsame Hero-, Karten-, Link- und Gruppierungs-Komponenten für Desktop/Mobil.
- Formularbeschriftungen, native Radios, selbst gestalteter Themenfilter und mobile Technologieauswahl, sichtbare Fokuszustände, Sprunglink zum Inhalt und Fokus auf die Überschrift nach einem Seitenwechsel.
- Radar-Tooltips mit schwarzem Original-Hintergrund, weißer Beschriftung und blauen Logogruppen bei Maus-Hover. Die Radar-Logos auf Homepage und Themenseiten sind aus der Tab-Reihenfolge entfernt; Tastaturnavigation erfolgt über die Quadrantenlinks und Eintragskacheln. 25 zusätzliche Original-Logos aus dem öffentlichen Techradar ergänzen die acht bestehenden interaktiven Figma-Logos. Die sechs verfügbaren Artikel sind mit der Maus auch direkt über ihre Homepage-Logos erreichbar.

## Beispieldaten und Grenzen

`src/data.ts` ist ausdrücklich eine Beispieldatenquelle. Namen und Artikeltexte stammen überwiegend aus Figma; zusätzliche React-Beispiele, Suchbegriffe und Themenzuordnungen dienen der demonstrierbaren Suche. Beispielsweise findet „React“ fünf Einträge. Es gibt keine API, Anmeldung, Redaktion oder Speicherung auf einem Server.

Der Radar verwendet die Figma-Geometrie, bestehende Original-Logos und 25 zusätzliche SVG-Symbole aus dem öffentlichen Techradar. Die ergänzten Logos sind innerhalb der passenden Kategorien und Ringe platziert; ihre Positionen sind an die vorhandene Geometrie angepasst. Die Positionen werden noch nicht aus Suchergebnissen berechnet; die gefilterte Radaransicht weist darauf hin und verweist auf die funktionierende Listenansicht. Such- und Filterzustände stehen in der URL und bleiben beim Ansichtswechsel erhalten. Die zusätzlichen Logoangaben sind ein statischer Stand vom 06.10.2026; der Beispielkatalog für die Listen und Suche wird dadurch nicht um sämtliche Inhalte der Website erweitert.

Alle vier Kategorieziele auf der Homepage und die Links zwischen den Quadranten führen zu ihren Seiten. Technologie-Detailseiten sind für DevOps, OpenTofu, Figma, TypeScript, GitHub Copilot und GitLab verfügbar. Weitere Karten und verwandte Themen ohne Artikel sind per Tab erreichbar und als nicht verfügbare Detailziele gekennzeichnet (`aria-disabled`, Titel „Detailseite noch nicht verfügbar“). Sie besitzen vorläufig kein Navigationsziel. Der mobile Menübutton ist deaktiviert, weil Menüinhalte nicht spezifiziert sind. Es wurden dafür keine zusätzlichen Screens erfunden.

Das mobile Auswahlfeld zeigt den aktuellen Artikel und alle Themen seiner Kategorie, gruppiert nach Adopt, Trial, Assess und Hold. Es verlinkt vorhandene Artikel; Ziele ohne Artikel sind als noch nicht verfügbar gekennzeichnet. Auf TypeScript, Figma und OpenTofu sind alle drei Artikel unter Languages & Frameworks auswählbar: Figma und TypeScript unter Adopt, OpenTofu unter Trial. Auch GitLab und GitHub Copilot verweisen gegenseitig auf ihre Detailseiten. Der Wechsel aktualisiert Artikel, Breadcrumb, Dokumenttitel und Auswahl; der Tastaturfokus folgt der neuen Überschrift. Auf DevOps bleibt passend zum Artikel „DevOps“ statt des widersprüchlichen Figma-Werts „Gherkin“ ausgewählt. Die identischen Assess-/Hold-Erklärungen wurden aus dem Design übernommen und müssen redaktionell geprüft werden.

## Responsive Entscheidungen

- Ab 1200 px: 1000 px Inhaltsbreite, vier Kartenspalten und Kategorien rund um den nativen Radar.
- 768–1199 px: fließende Inhaltsbreite mit 32 px Seitenabstand, zwei Kartenspalten; die Kategorien stehen ober- und unterhalb des Radars. Überschriften und Heroillustration werden etwas kleiner. Geprüfte Zwischenbreite: 900 px.
- Unter 768 px: 16 px Seitenabstand, eine Kartenspalte, Typografiewerte aus dem Figma-Mobile-Modus. Die Homepage zeigt entsprechend dem mobilen Frame die vier Kategorien; Suche, Ansichtswechsel und interaktiver Inhaltsradar sind dort ausgeblendet.
- Der blaue Hero ist auf allen Breiten genau eine aktuelle Viewporthöhe hoch (`100dvh`, Ersatz `100vh`). Text und Scrollpfeil stehen relativ zur Unterkante; die Breadcrumb bleibt oben. Die Illustrationen sind oben rechts verankert. Homepage und alle sechs Detailseiten verwenden dieselbe statische, angeschnittene Headergrafik: `7b448.svg` auf Desktop und `b4102.svg` auf Mobil. Die interaktiven Quadranten der vier Kategorieseiten werden auf Desktop proportional vollständig eingepasst. Mobil verwenden auch diese Seiten die statische Homepage-Grafik, beschnitten innerhalb der Zone zwischen Navigation und Text. Bei kurzen Viewports werden Schriftgrößen und Abstände kompakter, damit Navigation, Grafik und Text Platz behalten.
- Breakpoints und Tablet-Anordnung sind abgeleitete Annahmen, keine ausgelesenen Figma-Vorgaben.
- Lange Texte bestimmen ihre Inhaltshöhe. Ein zusätzlicher schmaler Hinweis am Seitenende kennzeichnet die Beispieldaten; dadurch sind Gesamtseiten höher als die Figma-Frames.
- Auf den vier Themenseiten übernehmen Kacheln innerhalb derselben Zeile die Höhe der höchsten Kachel. Das gilt für vier Spalten auf Desktop und zwei Spalten bei Zwischenbreiten. Pfeil und Text sind vertikal zentriert. Mobil enthält jede Zeile eine Kachel; deren Höhe bleibt vom eigenen Text abhängig.

## Schrift und Original-Assets

Alle eingesetzten SVG-/PNG-Assets liegen lokal unter `public/assets/`. Laufzeitcode enthält keine temporären Figma-Assetlinks. SVG-Dateien sind unverändert; die fixen Illustrationsschichten erhalten ihre Originalgeometrie und werden über Container skaliert. Figma-Screenshots dienen ausschließlich dem Vergleich unter `verification/`.

Proxima Nova A wird über `@font-face` mit `local()` aus den auf diesem Rechner installierten Originalschriften geladen. Ohne diese installierten Schriften greift Arial als Ersatzschrift. Es werden keine lizenzierten Systemschriftdateien mitgeliefert. Für eine Veröffentlichung werden lizenzierte Webfont-Dateien oder ein abgestimmter Ersatz benötigt.

## Designreferenzen

Figma-Datei: https://www.figma.com/design/4rMKbhNsesNBVLsGQveSlk/Techradar

| Seite | Desktop-Knoten | Mobil-Knoten |
|---|---|---|
| Homepage | 287:2479 | 368:1718 |
| Techniques | 174:1045 | 13:839 |
| Platforms | 266:4810 | Von 13:839 abgeleitet |
| Tools | 266:5425 | Von 13:839 abgeleitet |
| Languages & Frameworks | 266:5924 | Von 13:839 abgeleitet |
| DevOps | 287:2098 | 40:235 |
| Erklärung | 244:1054 | 56:2169 |

Zusätzlich ausgelesen: Homepage-Liste 258:3213, gefilterter Radar 258:2656, gefilterte Liste 258:2906 und Radar-Hovervarianten.
Die MCP-Referenzantworten stehen in `design-reference/`; deren Downloadlinks sind temporär. Die laufende Anwendung verwendet ausschließlich die lokal gespeicherten Dateien.

## Prüfung und offene Punkte

Siehe `verification/README.md` und `verification/browser-report.json` für die durchgeführten Prüfungen und Screenshots.

Vor einer produktiven Umsetzung festlegen: echte Technologiequelle und Redaktion, verbindliche Ring-/Kategorie-/Themenzuordnungen, dynamische Radarpositionen, weitere Detailziele und Menü, mobile Suche sowie Webfont-Bereitstellung und Hosting. Aktuell wird keine Produktionsveröffentlichung durchgeführt.

## Anpassung von Hero und Radar-Hover

Die drei Figma-Zustände `220:2520` (AWS), `220:2875` (Abstract) und `220:2994` (Adyen) wurden erneut über MCP einschließlich Screenshots gelesen. Die blauen Original-SVGs und Tooltip-Hintergründe liegen lokal. Aktive Logos sind 40 px groß, ergänzende Logos 30 px; die Radarfarbe ist entsprechend der Vorlage #003EEB. Pfeillinktexte wechseln bei Hover zu #0035EE und erhalten keine Unterstreichung.

Die bisherige Logogruppe bleibt bei Mausbewegungen durch Zwischenräume 800 ms sichtbar. Diese Zeit wurde aus der AWS-`MOUSE_LEAVE`-Verlinkung ausgelesen. Auf einem neuen Logo muss der Zeiger 300 ms bleiben, bevor dessen Gruppe erscheint; diese Verweilzeit ist eine Umsetzung der gewünschten verzögerten Umschaltung. Hin- und Herbewegungen setzen die ausstehende Umschaltung zurück. Tastaturfokus wechselt sofort.

Nur die drei genannten Logos haben eigene Hovervarianten in Figma. Für Ansible, Apache Kafka, API Gateway, das äußere Abstract-Logo und Alpine.js werden die Rückverbindungen der beobachteten Gruppen gezeigt; weitere Beziehungen wurden nicht ergänzt. Diese Rückrichtung und die 300 ms Verweilzeit sind abgeleitete Annahmen. Logos ohne belegte Beziehungen bleiben dekorativ. Eine vollständige fachliche Beziehungstabelle ist weiterhin offen.

Die fünf Zeitsteuerungstests und der Produktionsbuild bestehen. Die aktuelle visuelle Browserprüfung ist wegen einer blockierten administrativen Sicherheitsprüfung offen; die älteren Browseraufnahmen zeigen den Stand vor dieser Anpassung. Details stehen in `verification/update-report.json`.

## Listenansicht: Typografie, Tabs und Suche (06.10.2026)

Frame `258:3213` wurde erneut einschließlich Screenshot über Figma MCP gelesen; die Antwort steht unter `design-reference/258-3213-review.txt`. Die Kategorieüberschrift nutzt 34/41 px, die Ringüberschriften 30/38 px. Im HTML sind Ringe untergeordnete Überschriften. Bei 900 px bleiben sie mit 26/32 px kleiner als die Kategorieüberschrift mit 30/38 px; diese Zwischenwerte sind responsive Annahmen.

Kategorietabs übernehmen 20/30 px, 15 px horizontalen und 8 px vertikalen Innenabstand. Aktiv: #1D1D1D mit weißem Text und weißem Zählerfeld. Inaktive Zähler mit Treffern sind schwarz mit weißem Text und verwenden 16/24 px. Zähler mit 0 Treffern verwenden dagegen #DBD9D6 mit #1D1D1D als Textfarbe, wie im erneut über MCP samt Screenshot gelesenen Suchergebnis-Frame `258:2906`. Entsprechend der aktuellen Vorgabe gilt das auch beim aktiven Tab und bei „Alle“, wenn insgesamt keine Treffer vorliegen; diese beiden Fälle sind in dem Frame nicht separat dargestellt. Die blaue Auswahl-Unterstreichung wurde entfernt.

Die vorhandene Suchfeldkante wechselt bei Fokus von 1,5 px zu 3 px und #0035EE; es gibt keinen zweiten äußeren Rahmen. Ausgleichender Innenabstand hält Feldgröße und Textposition stabil. Enter bestätigt den Suchbegriff; der Hinweis ist für Screenreader verfügbar.

Der Produktionsbuild ist erfolgreich. Die Browserprüfung wurde um Schriftgrößen, Tabfarben, Fokusgeometrie sowie Suchentwurf vor/nach Enter erweitert, konnte aber wegen der weiterhin blockierten Sicherheitsprüfung nicht ausgeführt werden. Aktueller Prüfstatus: `verification/list-update-report.json`. Weitere Abweichungen der unveränderten Heroillustration und der Beispieldaten-Zähler gegenüber diesem Frame wurden in diesem Auftrag nicht angepasst.

## Headerausrichtung und mobiler Select (06.10.2026)

Die aktuelle Vorgabe ersetzt die zuvor gewünschte untere Ausrichtung der Detailgrafiken: Alle blauen Header orientieren ihre Illustration jetzt am rechten Viewportrand, unabhängig von der Inhaltsbreite. Auf Desktop stehen die Detailgrafiken unterhalb der oberen Navigation. Auf Mobil liegt die Illustration in einer flexiblen Zone zwischen Logo/Breadcrumb und Text; Überstand wird dort abgeschnitten und kann den Textbereich nicht überlagern. Bei wenig verfügbarer Höhe bleibt ein kleinerer Ausschnitt sichtbar.

Das Logo ist auf allen Seiten mittig ausgerichtet. Der mobile Menübutton steht unabhängig davon absolut rechts. Auf besonders schmalen Ansichten wird das Logo proportional kleiner, damit es den Menübutton nicht berührt. Die Original-Assets werden über vorhandene FigmaAsset-Container skaliert.

Die mobile Detailauswahl verwendet den Originalpfeil `2a73c.svg` aus Frame `40:235` statt des Browserpfeils: Native SVG-Größe 11,8407 × 6,98106 px, Design-Slot 10,78 × 5,39 px einschließlich der ursprünglichen Überstände. Er sitzt rechts mittig. Die spätere Dropdown-Anpassung ersetzt das native Select durch eine selbst gestaltete, per Tastatur bedienbare Komponente. Der Frame wurde erneut mit Screenshot über MCP gelesen, ohne Figma zu verändern.

Der Produktionsbuild besteht. Browser- und Sichtprüfung bleiben wegen der nicht verifizierbaren administrativen Sicherheitsrichtlinie offen. Die vorhandene Browserprüfung enthält jetzt Zentrierung, Randanker, kollisionsfreie mobile Grafikzone und Select-Pfeilmaße einschließlich 2560 px, 393 × 640 und 320 × 568 px. Diese neuen Prüfschritte sind noch nicht ausgeführt. Siehe `verification/header-update-report.json`.

## Weiche Radar-Hoverübergänge (06.10.2026)

Die grauen und blauen Original-Logos bleiben dauerhaft im Radar geladen und überblenden sich in beide Richtungen. Das aktive Logo wächst über eine CSS-Transformation von 30 auf 40 px; ergänzende Logos blenden mit einer leichten Vergrößerung auf ihre 30 px ein. Unterschiedliche aktive und ergänzende Original-Assets werden ebenfalls überblendet. Der Mausbereich bleibt während der Animation an einer festen Position, damit die Größenänderung keinen zusätzlichen Hoverwechsel auslöst. Unterbrochene Übergänge laufen vom aktuellen Zwischenzustand weiter.

Die Dauer beträgt 300 ms mit `ease-out`, entsprechend der zuvor ausgelesenen Smart-Animate-Dauer. Die konkrete Kombination von Überblendung und Skalierung setzt den aktuellen Animationswunsch um. Der erneute MCP-Aufruf `get_motion_context` für `220:2520` liefert keine Canvas-Keyframes (`nodes: []`); die Animation wird deshalb als Interaktion zwischen den bekannten Zuständen umgesetzt. Gruppenverweilzeit (300 ms), Ausblendverzögerung (800 ms) und Tastaturverhalten bleiben erhalten. Bei aktivierter Systemeinstellung für reduzierte Bewegung entfallen die Übergänge.

Produktionsbuild und alle fünf Zeitsteuerungstests bestehen. Die Bewegung selbst konnte wegen der bestehenden administrativen Browser-Zugriffssperre noch nicht visuell geprüft werden. Siehe `verification/animation-update-report.json`.

## Interaktiver Header-Quadrant (06.10.2026)

Figma `304:3046` wurde über MCP mit Screenshot gelesen. Beobachtet: Techniques-Quadrant mit fünf sichtbaren Logos, schwarzer runder Hoverfläche #000001 und schwarzem Tooltip mit weißer Proxima Nova A Semibold in 16 px. Der Kreis misst im Komponentenframe 34,8296 px; die vorhandene Desktopinstanz skaliert ihn auf 57,6761 px. Das schwarze Kafka-Original-SVG `03cdc.svg` wurde unverändert heruntergeladen. Die übrigen Logos verwenden ihre vorhandenen weißen Original-Assets mit derselben schwarzen Kreisfläche. Die vollständige Referenz und Maße stehen in `design-reference/304-3046.txt` und `design-reference/quadrant-hover-geometry.json`.

`HeroQuadrant` behält die feste Originalgeometrie der weißen Techniques-Illustration und passt sie proportional sowohl in die verfügbare Breite als auch in die Höhe ein. Die Grafik steht oben rechts, bleibt innerhalb des Viewports und wird unten nicht mehr abgeschnitten. Aktuell verwenden nur die vier Kategorieseiten diese Komponente auf Desktop. Nach den späteren Nutzervorgaben erhalten Kategorieseiten mobil und alle Detailseiten auf beiden Bildschirmgrößen die statische Homepage-Grafik. Für Detailartikel bei 320–360 px Breite und 551–650 px Höhe bleiben Überschrift und Navigationsabstände etwas kompakter; dies ist eine responsive Annahme für längere Überschriften.

Jedes der fünf sichtbaren Logos bekommt den schwarzen Zustand und einen Tooltip. Kreis und Logo blenden in 300 ms ein und aus, mit einer leichten Skalierung auf die exakte Endgröße. Die gemeinsame Hover-Zeitsteuerung, Tooltip-Komponente, Tastaturfokus, Escape und reduzierte Bewegung werden auch auf der Homepage verwendet. Auf dem einzelnen Quadranten werden keine zusätzlichen Verbindungen dargestellt. Das Figma-Beispiel beschriftet das Kafka-Logo mit „AWS“; die Vorschau verwendet stattdessen den tatsächlichen Ebenennamen „Apache Kafka“. Namen der übrigen Tooltips sind ebenfalls aus den Logo-Ebenen abgeleitet. Die fachliche Zuordnung dieser Beispielsymbole zu Technologien bleibt offen.

Die gemeinsame Darstellung und Interaktion werden inzwischen auch für Platforms, Tools und Languages & Frameworks verwendet; siehe die folgende Erweiterung.

Produktionsbuild, fünf Zeitsteuerungstests, Syntaxprüfung des Browser-Prüfskripts und lokale Prüfung aller 41 verwendeten Quadranten-Assets bestehen. Die ergänzten Browserchecks prüfen vollständige Grafikgrenzen, alle fünf Tooltips und Fokus/Hover, einschließlich kleinerer Desktop- und Mobilhöhen. Sie konnten wegen der erneut bestätigten administrativen Browser-Zugriffssperre nicht ausgeführt werden. Siehe `verification/quadrant-update-report.json`.

## Weitere Quadrantenseiten (06.10.2026)

Die Desktop-Frames `266:4810` (Platforms), `266:5425` (Tools) und `266:5924` (Languages & Frameworks) wurden in Section `195:1314` über Figma MCP einschließlich Screenshots gelesen. Alle drei sind 1440 × 2149 px groß. Gemeinsam genutzte Komponenten übernehmen Hero, Breadcrumb, Pfeillinks und Bewertungsabschnitte; die Homepage-Kategorieziele und jeweils drei Links im Hero verbinden alle vier Quadrantenseiten.

Jeder neue Quadrant verwendet seinen eigenen vollständigen Original-SVG-Export statt einer gedrehten Techniques-Grafik. Die drei Grafiken und 35 sichtbaren Logo-Assets liegen unter `public/assets/category-*.svg`; Herkunft, Originalmaße und Positionen stehen in `src/components/categoryQuadrantAssets.ts`. Die Logos übernehmen die schwarzen Hoverflächen, Tooltips, 300-ms-Überblendung, Tastaturbedienung und reduzierte Bewegung der vorhandenen Quadranten-Komponente. Namen stammen aus den Figma-Ebenen. Auch am Rand angeschnittene Logo-Elemente behalten den Zuschnitt der Vorlage; der Quadrant als Ganzes wird vollständig eingepasst. Die Figma-Datei wurde nicht verändert.

Die mobile Section `77:577` enthält keine eigenen Frames für diese drei Kategorien. Ihre Mobilansichten werden daher von der vorhandenen Techniques-Seite `13:839` abgeleitet: identische gemeinsame Struktur und kompaktere Abstände bei kurzen Viewports. Die aktuelle Vorgabe verwendet für alle vier Kategorien die statische mobile Homepage-Grafik, wie im folgenden Abschnitt beschrieben. Zwischenbreiten folgen denselben Breakpoints. Der Desktop-Frame beschriftet die letzte Kategorie teilweise als „Language & Frameworks“; die App verwendet einheitlich „Languages & Frameworks“ wie auf der Homepage und in der Aufgabenstellung.

Alle drei Figma-Seiten wiederholen dieselben 18 Techniques-Beispielkarten (Adopt: 8, Trial: 7, Assess: 3, Hold: leer). Diese Inhalte bleiben separate, ausdrücklich gekennzeichnete Seiten-Beispieldaten. Die neuen Screenshot-Artikel werden ergänzend in ihrer jeweiligen Kategorie angezeigt und sind auch in den Suchdaten enthalten; die bestehende React-Beispielsuche behält ihre fünf Treffer. Verbindliche Kategorieinhalte und weitere Technologie-Detailseiten bleiben offen.

Produktionsbuild, alle fünf Hover-Zeitsteuerungstests und Syntaxprüfung des erweiterten Browser-Prüfskripts bestehen. Zusätzlich wurden die 38 neuen SVG-Dateien, ihre Originalmaße und Logo-Koordinaten sowie die Routenkonfiguration, Querverweise und Beispieldaten lokal geprüft. Das ist keine Prüfung der Darstellung im Browser. Die vorhandene administrative Browser-Zugriffssperre verhindert weiterhin die aktuelle Sicht- und Interaktionsprüfung; die älteren Browserbilder zeigen diese Seiten nicht. Prüfungen bei 1440, 900 und 393 px sowie kleineren Höhen sind vorbereitet, aber noch nicht ausgeführt. Aktueller Status: `verification/category-pages-update-report.json`.

## Statische Grafik auf mobilen Quadrantenseiten (06.10.2026)

Unter 768 px zeigen Techniques, Platforms, Tools und Languages & Frameworks denselben Original-SVG-Export `b4102.svg` wie die mobile Homepage. Asset und Randposition werden gemeinsam verwendet. Die dekorative Grafik steht oben rechts und wird innerhalb der vorhandenen Grafikzone beschnitten, damit sie den Text nicht überlagert. Der mobile Bereich enthält keine interaktiven Logo-Schaltflächen und ist für Screenreader ausgeblendet. Desktop-Kategorieseiten behalten ihre interaktiven Quadranten. Die nachfolgende Detailheader-Anpassung verwendet die statische Grafik auch auf allen Artikeln.

Produktionsbuild und Syntaxprüfung des angepassten Browser-Prüfskripts bestanden. Die vorbereiteten Mobilchecks erwarten nun die statische Grafik auf den vier Kategorieseiten. Die aktuelle Sichtprüfung bleibt wegen der bestehenden administrativen Browser-Zugriffssperre offen.

## Mobile Breadcrumb der TechRadar-Erklärung (06.10.2026)

Der aktualisierte Mobilframe `56:2169` und die neue Breadcrumb `471:2511` wurden über Figma MCP einschließlich Screenshots gelesen. Die bereits vorhandene gemeinsame Breadcrumb ist auf `/techradar` nun auch unter 768 px sichtbar: unter dem Logo, vor „Das Techradar“, mit 16 px Seitenabstand. Der blaue Homepage-Link verwendet 20/30 px und Semibold; der restliche Text 16/24 px gemäß dem mobilen Modus des vollständigen Frames. Der 32-px-Bereich und 8 px Abstand zur Überschrift übernehmen die neue Vorlage. Beschriftung „Techradar / Techniques“ und Desktopdarstellung entsprechen der vorhandenen Referenz; „Techradar“ führt zur Homepage. Es werden keine neuen Assets benötigt. Referenz: `design-reference/56-2169-breadcrumb-review.txt`.

Der Produktionsbuild besteht. Die aktuelle Browser-Sichtprüfung bleibt wegen der administrativen Zugriffssperre offen.

Die mobilen Ringüberschriften Adopt, Trial, Assess und Hold auf `/techradar` verwenden ebenfalls die Figma-H4-Werte: 20 px Semibold mit 26 px Zeilenhöhe. Der erneute MCP-Abgleich des vollständigen Frames `56:2169` bestätigt diese Werte für alle vier Überschriften. Eine alte mobile Überschreibung mit 14/20 px wurde entfernt, sodass die bestehenden H4-Tokens greifen. Produktionsbuild bestanden; aktuelle Browser-Sichtprüfung weiterhin offen.

## Selbst gestaltetes DevOps-Dropdown (06.10.2026)

Frame `368:2342` wurde über Figma MCP einschließlich Screenshot gelesen. Die mobile Detailauswahl verwendet jetzt `TechnologySelect` anstelle eines nativen Selects. Das aufgeklappte Menü übernimmt 1,5 px schwarze Border, 4 px Radius, 4 px vertikalen Innenabstand und den Schatten (0/4/12 px, 10 % Schwarz). Gruppenüberschriften verwenden 16/24 px Semibold und #3B3B38; Themen 20/30 px mit 10 px vertikalem und 34 px linkem Abstand. Der gewählte Eintrag hat einen Original-Haken, Semibold und #EFEEEA als Hintergrund. Original-Asset `016a9.svg` (14,3326 × 11,2525 px) und vorhandener Originalpfeil bleiben unverändert lokal. Referenz: `design-reference/368-2342-dropdown-review.txt`.

Die Auswahl enthält alle vorhandenen Techniques-Themen in der Reihenfolge Adopt (8), Trial (7), Assess (3), Hold (leer). Der leere Ring wird ausdrücklich angezeigt. Der gelesene Dropdown-Frame zeigt abweichende Beispieldaten und mehrere gleiche Trial-Zeilen; übernommen wird dessen Styling, während die Einträge aus der bestehenden Techniques-Datenquelle stammen. DevOps bleibt als aktueller Artikel ausgewählt. Andere Einträge haben noch keine Detailziele und sind entsprechend deaktiviert und heller dargestellt; sie ändern weder Artikel noch Auswahl. Weitere Detailseiten wurden nicht erfunden.

Diese Komponente wird inzwischen auch auf den neuen Detailseiten verwendet: Beschriftung, Einträge, Auswahl und verfügbare Detailziele richten sich nach der jeweiligen Kategorie.

Enter/Leertaste öffnen die Auswahl; Pfeiltasten sowie Home/End bewegen die aktive Position über die Gruppen hinweg. Buchstaben suchen nach Namensanfängen, wiederholte Buchstaben wechseln zwischen Treffern. Enter bestätigt verfügbare Ziele. Escape, Tab, Klick außerhalb oder Verlassen des Steuerelements schließen das Menü. Tastaturaktivität bekommt eine sichtbare blaue Markierung; Auswahl und Fokus sind getrennt. Die Liste scrollt intern, bleibt maximal 480 px hoch und öffnet bei wenig Platz unten nach oben. Der 4-px-Abstand zum Auslöser, Höhenbegrenzung, Tastaturmarkierung und deaktivierte Darstellung sind abgeleitete Ergänzungen für die Benutzung innerhalb der responsiven Seite.

Produktionsbuild, fünf Tests der Tastaturnavigation/Suche (`npm run test:select`) und Syntaxprüfung des angepassten Browser-Prüfskripts bestehen. Die beiden Original-Assets sind lokal vorhanden und ihre nativen Maße wurden geprüft. Die vorbereitete Browserprüfung umfasst Gruppen, Einträge, Auswahl, deaktivierte Ziele, Popup-Grenzen, Original-Icons und Schließen per Escape/außerhalb. Sie wurde wegen der bestehenden administrativen Browser-Zugriffssperre nicht ausgeführt; aktuelle Sicht- und vollständige Interaktionsprüfung bleiben offen.

## Weitere Detailartikel aus Screenshots (06.10.2026)

Die fünf bereitgestellten Screenshots sind die Inhaltsquelle für OpenTofu, Figma, TypeScript, GitHub Copilot und GitLab. Texte, Überschriften, Hervorhebungen und sämtliche verwandten Themen wurden übernommen; die kurzen Hero-Einführungen sind daraus abgeleitet. Die Originaldateien wurden nicht verändert. Unveränderte Referenzkopien liegen unter `design-reference/content-screenshots/`; SHA-256-Vergleich: `verification/detail-screenshot-source-report.json`. Der Textstand stammt aus diesen Screenshots und wird nicht aus einer laufenden Website oder API aktualisiert.

Die Darstellung verwendet das gemeinsame Figma-Detailtemplate (`287:2098` und `40:235`, erneut mit Screenshots über MCP gelesen). Die Screenshots des aktuellen Radars liefern Inhalte, nicht ein zweites Seitenlayout. `TechnologyDetail`, Hero mit der statischen Startseiten-Grafik, Breadcrumb und die mobile Dropdown-Komponente werden von allen sechs Artikeln gemeinsam verwendet. Jede Breadcrumb nennt die tatsächliche Kategorie und den aktuellen Artikel; Dokumenttitel und Fokus nach Navigation folgen dem Artikel. Vorhandene verwandte Artikel werden verlinkt, beispielsweise Figma → TypeScript sowie OpenTofu/GitLab → DevOps. Weitere verwandte Themen erhalten keine erfundenen Detailseiten oder Ringbewertungen.

Vom Nutzer am 06.10.2026 bestätigt: OpenTofu steht unter Languages & Frameworks / Trial, Figma und TypeScript unter Languages & Frameworks / Adopt. GitHub Copilot und GitLab stehen unter Tools / Adopt. Diese Zuordnungen gelten gemeinsam für Listen, Suche und Dropdowns. Suchbegriffe und Themenfilter-Zuordnungen sind ergänzende Demoangaben. Die Kategorien behalten ihre bisherigen Figma-Beispielkarten; die fünf neuen Artikel kommen als funktionierende Karten hinzu. Die statischen Radar-Positionen bleiben die ursprüngliche Figma-Vorlage.

Produktionsbuild und zehn Tests bestanden: fünf für Artikelrouten, Katalog-/Kategoriekarten, Quellen, verwandte Verweise und bestehende DevOps-/React-Daten (`npm run test:details`), fünf für die Tastaturnavigation im Dropdown (`npm run test:select`). Die Syntax des um zwölf Routen erweiterten Browser-Prüfskripts ist korrekt. Prüfungen bei 1440, 900 und 393 px sowie kleineren Headerhöhen sind vorbereitet; die neue Browserdarstellung und vollständige Navigation wurden wegen der bestehenden administrativen Zugriffssperre nicht geprüft. Aktueller Status: `verification/detail-pages-update-report.json`.

## Einheitliche Detailheader und verlinkte Auswahl (06.10.2026)

Auf ausdrücklichen Nutzerwunsch zeigen alle sechs Detailartikel die dekorative Startseiten-Grafik auf Desktop und Mobil. Original-Assets, Randposition, Desktop-Skalierung und mobile Grafikzone werden gemeinsam mit der Homepage verwendet; die Grafik bleibt oben rechts angeschnitten. Diese Vorgabe ersetzt die vorherige Verwendung des jeweiligen Kategoriequadranten auf Detailseiten. Die Figma-Datei und Original-Assets wurden nicht verändert.

Die vorhandene Select-Navigation verwendet die Seitenziele aus dem gemeinsamen Technologiekatalog. Die HTML-Ausgabe aller sechs Detailkomponenten wurde direkt aus dem Code geprüft: jeweils beide Startseiten-Assets, kein Header-Quadrant und alle vorhandenen Artikel derselben Kategorie als aktive Auswahlziele. Das ergibt drei Ziele bei TypeScript/Figma/OpenTofu, zwei bei GitLab/GitHub Copilot und DevOps als einziges verfügbares Techniques-Ziel. Dies prüft die Komponentenstruktur und Datenzuordnung, nicht die Klickinteraktion im Browser.

Produktionsbuild, zehn bestehende Artikel-/Tastaturtests und Syntaxprüfung des Browser-Prüfskripts bestehen. Die vorbereitete Browserprüfung enthält jetzt ausdrücklich TypeScript → Figma → OpenTofu → TypeScript mit Maus- und Tastaturauswahl sowie die statischen Detailheader bei 1440, 900 und 393 px. Die aktuelle Sicht- und Klickprüfung wurde erneut durch die nicht verifizierbare administrative Browser-Sicherheitsrichtlinie blockiert.

## Weitere Original-Logos auf der Homepage (06.10.2026)

Die öffentliche Seite [techradar.syzygy-techsolutions.de](https://techradar.syzygy-techsolutions.de/) und deren [SVG-Sammlung](https://techradar.syzygy-techsolutions.de/assets/sprite.svg) konnten gelesen werden. 25 Symbole wurden mit unveränderten Pfaden in die lokale Datei `public/assets/current-techradar-logos.svg` übernommen. Sie ist rund 28 KB groß; die Vorschau lädt die Logos lokal. Herkunft, SHA-256-Prüfsummen der Originalpfade sowie beobachtete Kategorien, Ringe und verwandte Themen stehen in `design-reference/current-techradar-logos.json`.

| Kategorie | Ergänzte Logos |
| --- | --- |
| Techniques | DevOps, CICD, Serverless, Gherkin, DDD, Microfrontend |
| Languages & Frameworks | Figma, TypeScript, React, OpenTofu, Tailwind CSS, Vitest, Playwright |
| Platforms | Kubernetes, OpenShift, Azure, AWS ECS, Google Cloud, n8n |
| Tools | GitLab, GitHub Copilot, Storybook, Terraform, Trivy, ChatGPT |

Die Kategorien und Ringe stammen aus dem ausgelesenen Webseitenstand und stimmen für die sechs vorhandenen Detailartikel mit den bestätigten Zuordnungen überein. Die Radarpositionen wurden innerhalb dieser Ringe abgeleitet und sind keine unveränderten Koordinaten der Website. Tools stehen entsprechend der Figma-Homepage unten links, Platforms unten rechts. Fünf doppelte dekorative Figma-Beispiele wurden reduziert (eine ActiveMQ-, eine Aurora- und drei Rekognition-Kopien), damit die Ergänzungen Platz haben. Jede bisherige Logoart und alle acht bisherigen interaktiven Positionen bleiben erhalten.

Alle 33 interaktiven Logos verwenden die gemeinsame Hover-Zeitsteuerung, blaue Kreisflächen, 300-ms-Überblendung, Tooltips, Tastaturfokus und Escape. Neue verwandte Gruppen stammen aus den `seeAlso`-Angaben der Website. Zwischen neu übernommenen Logos gelten diese Beziehungen in beiden Richtungen; das ist eine abgeleitete Interpretation der thematischen Ergänzung. Die bestehenden Figma-Gruppen bleiben erhalten. Die Logos für DevOps, OpenTofu, Figma, TypeScript, GitLab und GitHub Copilot führen direkt zu den vorhandenen Artikeln. Weitere Logos zeigen ihren Tooltip; zusätzliche Detailseiten wurden nicht erfunden. Die bisherigen mobilen Homepage-Kategorien und Headergrafiken behalten ihre Darstellung.

Produktionsbuild und 15 Tests bestanden: fünf neue Prüfungen für Originalpfade, Ring-/Kategoriegrenzen, getrennte Bedienflächen, verwandte Gruppen und Artikelzuordnungen (`npm run test:logos`), fünf für Hover-Verzögerungen und fünf für vorhandene Artikel. Das Browser-Prüfskript wurde um Symbole, alle neuen Tooltips, Markierungen und sechs direkte Artikellinks erweitert; seine Syntax ist geprüft. Die aktuelle Darstellung und Klickinteraktion bleiben wegen der bereits bestehenden administrativen Browser-Zugriffssperre ungeprüft. Prüfstatus: `verification/current-techradar-logos-report.json`.

## Gleiche Kachelhöhen pro Zeile (06.10.2026)

Auf Platforms, Tools, Techniques und Languages & Frameworks werden die Kacheln im weißen Inhaltsbereich innerhalb ihrer jeweiligen Grid-Zeile gestreckt. Jede Zeile richtet sich nach ihrer höchsten Kachel; längere Texte bestimmen weiterhin die erforderliche Höhe. Die vorhandene Flex-Ausrichtung zentriert Pfeil und Text vertikal. Die Regel ist auf die vier Themenseiten begrenzt und funktioniert ohne feste Höhen oder Messungen per JavaScript. Produktionsbuild bestanden; die aktuelle Sichtprüfung bleibt wegen der bestehenden administrativen Browser-Zugriffssperre offen.


## Homepage-Themendropdown (06.10.2026)

Figma-Komponente `92:864` einschließlich geschlossener und geöffneter rechtsbündiger Variante (`92:863` / `92:865`) über MCP mit Screenshots gelesen. Die Referenz ist unter `design-reference/92-864-topic-dropdown.png` und `92-864-topic-dropdown-review.txt` gespeichert; die Figma-Datei wurde nicht verändert.

Beobachtet und übernommen: weißes Feld mit schwarzem 1,5-px-Rand und 4-px-Radius, 50 px Höhe, 20/30-px-Auswahltext sowie die beiden unveränderten Originalpfeile. Das geöffnete Menü ist 254 px breit und rechtsbündig, überlappt den unteren Feldrand um 3 px und hat 4 px Innenabstand oben/unten sowie einen Schatten von 0 / 4 / 12 px bei 10 % Schwarz. Einträge verwenden 10 px Innenabstand und 20/30 px; die ausgewählte Zeile verwendet #F2F2F2 und Semibold 16/24 px. Die Beschriftung „Thema“ bleibt entsprechend der Homepage-Instanz `287:2561;112:3658` bei 20/30 px; die separat verlinkte Bibliothekskomponente verwendet dafür 16/24 px.

Wie ausdrücklich gewünscht, ersetzt beim Fokus ein 3-px-Rand in #0035EE den vorhandenen Rand. Es kommt keine äußere Outline hinzu. Angepasste Innenabstände halten Feldgröße und Text-/Pfeilposition stabil. Der native Select wurde durch die gemeinsame React-Auswahl `TopicSelect` ersetzt. Pfeiltasten, Home/End und Buchstabensuche bewegen die aktive Option; Klick oder Enter/Leertaste bestätigen sie. Escape, Tab, Klick außerhalb und Seitenscrollen schließen das Menü. Beschriftung, aktueller Wert, Auswahl und aktive Option werden über Combobox-/Listbox-Attribute vermittelt. Die vorhandenen Tastaturhilfen der mobilen Technologieauswahl werden wiederverwendet.

Abgeleitete Annahmen: Die ausgewählte Zeile verwendet bei jedem Thema die in Figma für „Alle“ gezeigte Markierung. Lange gewählte Namen können das Feld bis 254 px verbreitern und werden bei Platzmangel gekürzt; vollständiger Text bleibt als zugänglicher Name und Titel verfügbar. Das Menü scrollt bei begrenzter Viewporthöhe und öffnet nach oben, wenn unten weniger als 240 px und oben mehr Platz sind. Unter 768 px bleibt der Homepage-Filter entsprechend dem vorhandenen mobilen Design ausgeblendet.

Der Themenfilter schreibt weiterhin nur `topic` in die URL und verwendet die vorhandenen Beispieldaten. Eine Themenauswahl übernimmt keinen unbestätigten Schlagworttext; die Schlagwortsuche wird weiterhin ausschließlich durch Enter in ihrem Eingabefeld bestätigt.

Prüfung: Produktionsbuild und zehn Prüfungen bestanden (`npm run test:select`: sieben Tastaturhilfenprüfungen; `npm run test:topic`: drei Prüfungen der HTML-/ARIA-Ausgabe und nativen Assetmaße). Das Browser-Prüfskript wurde auf die eigene Auswahl umgestellt und um Rand-/Geometriestabilität, Menügestaltung, Maus-/Tastaturauswahl, Abbruch und unveränderte unbestätigte Suchbegriffe ergänzt; Syntaxprüfung bestanden. Die laufende Vite-Vorschau hat die Änderungen übernommen. Aktuelle Darstellung und vollständige Interaktion konnten erneut nicht im Browser geprüft werden: Die administrative Sicherheitsrichtlinie für localhost konnte nicht verifiziert werden, sodass Browser Use den Zugriff blockierte. Die HTML-Prüfungen ersetzen diese ausstehende Sicht-/Interaktionsprüfung nicht. Prüfstatus: `verification/topic-dropdown-report.json`.


## Tastaturreihenfolge und Kachelfokus (06.10.2026)

Auf Nutzerwunsch haben alle 33 Homepage-Radarziele und sämtliche Logos in den vier Desktop-Headerquadranten `tabIndex=-1`. Die Änderung wurde als Anpassung der Tastatursteuerung verstanden; bestehende Maus-Hover, Animationen und verfügbare Homepage-Logolinks bleiben erhalten. Die Tastatur führt über die Links zu den Kategorien und über die darunter aufgelisteten Einträge. Suchfeld, Ansichtswechsel und Themendropdown bleiben bedienbar.

Ab dem Logo lautet die Reihenfolge auf Techniques: Logo → Breadcrumb „Techradar“ → Zu Tools → Zu Platforms → Zu Languages & Frameworks → Scroll-Hinweis „Zum Inhalt“ → Automated Security Testing → weitere Kacheln in Ring-/Zeilenreihenfolge. Die drei anderen Themenseiten verwenden die entsprechende bestehende Linkreihenfolge. Der vorhandene Sprunglink „Zum Inhalt springen“ bleibt als zusätzliche erste Station vor dem Logo erhalten. Keine positiven Tab-Indizes; die Reihenfolge ergibt sich aus dem Dokument.

Alle Eintragskacheln sind jetzt per Tab erreichbar. Artikel mit vorhandenen Detailseiten bleiben echte Links. Für Themen ohne Artikel wurde vorläufig die in der optionalen Rückfrage empfohlene Variante eingesetzt: fokussierbare Kachel mit deaktivierter Linkrolle, `aria-disabled=true` und Titel „Detailseite noch nicht verfügbar“. Dafür wurden weder zusätzliche Artikel noch leere Navigationsziele erfunden. Die Alternative, fehlende Artikel im bisherigen TechRadar zu verlinken, bleibt eine offene Zielentscheidung.

Der gemeinsame Kachelfokus ersetzt den 1-px-Rand in Grau durch einen 3-px-Rand in #0035EE. Es entsteht keine zusätzliche äußere Outline. Innenabstand von 9 statt 11 px gleicht die Randbreite aus; Inhalt, Kartengröße und Zeilenhöhe behalten ihre Geometrie. Das gilt auch für die gemeinsamen Karten in Listen und verwandten Themen.

Produktionsbuild, zwei Komponentenprüfungen für die vollständigen Kataloge aller vier Kategorien und den ersten Techniques-Eintrag (`npm run test:keyboard`) sowie Syntaxprüfung des aktualisierten Browser-Prüfskripts bestanden. Browserchecks für die tatsächliche Tab-Reihenfolge, blaue Kachelränder und stabile Größen sind vorbereitet. Die aktuelle Tab-/Sichtprüfung bleibt aufgrund der bereits gemeldeten administrativen Browser-Zugriffssperre offen; Komponenten-HTML und Codeprüfung ersetzen sie nicht. Prüfstatus: `verification/keyboard-flow-report.json`.


## GitHub-Export (06.10.2026)

Repository: https://github.com/FranziskaBecker-STS/techradar-from-figma

Enthalten sind Anwendungscode, Original-Assets, Paket-Lockdatei, Startanleitung, Tests und zugehörige Design-/Prüfreferenzen. Die Dateien unter sources/ sowie andere Arbeitsunterlagen, installierte Pakete, Build-Ausgaben und persönliche Konfigurationen wurden nicht übernommen. Temporäre Figma-Downloadlinks und persönliche absolute Dateipfade wurden nur in den Exportkopien entfernt; die ursprüngliche Vorschau blieb unverändert.

Das Repository ist eine separate Kopie des Standes vom 06.10.2026. Für weitere Entwicklung diesen Ordner beziehungsweise einen Git-Clone verwenden; Änderungen im ursprünglichen ChatGPT-Arbeitsordner werden nicht automatisch synchronisiert. Nach dem Klonen npm ci und npm run dev ausführen. Die App verwendet statische Beispieldaten und benötigt keine Zugangsdaten oder API-Schlüssel. Eine GitHub-Ablage allein veröffentlicht noch keine Web-Vorschau.

Die Schrift Proxima Nova A wird bisher über eine lokale Installation geladen. Eine lizenzierte Webfont-Datei liegt nicht bei; auf Rechnern ohne diese Schrift greift der vorhandene Arial-Ersatz.


Der GitHub-Export wurde in einer frischen Installation mit npm ci geprüft: Produktionsbuild und alle 27 automatisierten Prüfungen bestanden. npm test bündelt die Prüfungen für Daten, Artikel, SVG-Originale, Hover-Zeitsteuerung, Tastaturhilfen und Komponenten-HTML. Die Browserprüfung ist davon getrennt und bleibt wegen der bereits dokumentierten lokalen Zugriffssperre ungeprüft. Für die direkten HTML-Prüfungen ist die Hintergrundsuche nach Browser-Abhängigkeiten deaktiviert, damit ihr eigener Prüfserver sauber beendet werden kann.


## Öffentliche Vorschau mit GitHub Pages

Die Vorschau ist für https://franziskabecker-sts.github.io/techradar-from-figma/ vorbereitet. Dieser Link ist erst nach einem erfolgreichen Pages-Deployment erreichbar. Der GitHub-Repository-Link zeigt den Quellcode; localhost/127.0.0.1 ist nur auf dem jeweiligen Rechner erreichbar.

Einmalig im Repository unter Settings → Pages → Build and deployment → Source die Option GitHub Actions auswählen. Der Workflow `.github/workflows/pages.yml` prüft und veröffentlicht anschließend jeden neuen Stand auf main. Ein fehlgeschlagener erster Lauf kann unter Actions → Publish Techradar preview → Re-run all jobs erneut gestartet werden; außerdem gibt es Run workflow.

Für den Pages-Build `npm run build:pages` und anschließend `npm run test:pages` ausführen. Der Build verwendet `/techradar-from-figma/` als Basis für Navigation, Bilder, SVG-Symbole und Masken. Alle zwölf bestehenden Routen erhalten eigene index.html-Dateien, sodass auch direkt geteilte Detailseiten und Neuladen funktionieren. Die App und ihre vorhandenen Inhalte werden weiterhin gemeinsam aus denselben Komponenten aufgebaut. Lokal verwenden npm run dev und npm run build unverändert die Basis `/`. Ein Repository- oder Domainwechsel erfordert die entsprechende Anpassung in vite.config.ts und scripts/prepare-pages.mjs.

Node.js 24 wird für die Veröffentlichung verwendet. Für einen reproduzierbaren lokalen Ablauf ebenfalls Node.js 24 verwenden. Veröffentlichte Artikel und Daten bleiben die vorhandene Demonstration; die Schrift Proxima Nova A benötigt weiterhin eine passende lokale Installation beziehungsweise eine noch bereitzustellende lizenzierte Webfont-Datei.

Dokumentation: [Vite: GitHub Pages](https://vite.dev/guide/static-deploy#github-pages), [GitHub: Pages mit GitHub Actions](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
