# Prüfung der Vorschau

**Tastaturreihenfolge vom 06.10.2026:** Homepage- und Header-Radarlogos haben negative Tab-Indizes; Kategorie-/Inhaltslinks und alle Kacheln bleiben erreichbar. Ab Logo auf Techniques: Breadcrumb → Tools → Platforms → Languages & Frameworks → Scroll-Hinweis → Automated Security Testing. Der vorhandene Sprunglink bleibt vor dem Logo. Vorhandene Artikel sind echte Links; Kacheln ohne Detailseite sind vorläufig als deaktivierte Linkziele fokussierbar und entsprechend beschriftet. Kachelfokus ersetzt den grauen Rand durch 3 px #0035EE ohne Größenänderung. Produktionsbuild, zwei HTML-Komponentenprüfungen und Browser-Prüfscriptsyntax bestanden. Die tatsächliche Tab-/Sichtprüfung bleibt durch die bereits gemeldete administrative Browser-Zugriffssperre offen. Siehe `keyboard-flow-report.json`.

**Homepage-Themendropdown vom 06.10.2026:** Figma `92:864` und rechtsbündige Varianten `92:863` / `92:865` mit Screenshots gelesen. Eigene Combobox mit Originalpfeilen, rechtsbündigem 254-px-Menü, grauer Auswahl, schwarzen Rändern und Schatten. Fokus ersetzt den vorhandenen Rand durch 3 px Blau ohne äußere Outline oder Größenänderung. Produktionsbuild, sieben Tastaturhilfenprüfungen und drei HTML-/ARIA-/Assetprüfungen bestanden; Browser-Prüfscriptsyntax korrekt. Die aktualisierten Browserchecks für Gestaltung, Fokus, Auswahl, Abbruch und nicht bestätigte Suchbegriffe sind vorbereitet, wurden wegen der erneut blockierten administrativen Sicherheitsprüfung für localhost aber nicht ausgeführt. Siehe `topic-dropdown-report.json`; aktuelle Sicht-/Klickprüfung weiterhin offen.

**Kachelhöhen auf Themenseiten vom 06.10.2026:** Platforms, Tools, Techniques und Languages & Frameworks verwenden im weißen Inhaltsbereich gleich hohe Kacheln pro Zeile. Grid-Streckung folgt der jeweils höchsten Kachel; die bestehende Flex-Ausrichtung zentriert Pfeil und Text vertikal. Vier, zwei und eine Spalte folgen den bestehenden Breakpoints. Produktionsbuild bestanden. Die aktuelle Sichtprüfung bleibt wegen der bestehenden administrativen Browser-Zugriffssperre offen.

**Weitere Homepage-Logos vom 06.10.2026:** Öffentliche Techradar-Seite und SVG-Sammlung erfolgreich gelesen; 25 Original-Symbole mit unveränderten Pfaden lokal übernommen. Die Homepage enthält jetzt 33 interaktive Logos mit gemeinsamen Hover-/Tooltip-Zuständen und sechs direkten Artikellinks. Kategorien und Ringe stammen aus dem Webseitenstand, neue Positionen sind an die Figma-Geometrie angepasst. Fünf dekorative Dopplungen wurden reduziert; alle bisherigen Logoarten und interaktiven Positionen bleiben erhalten. Produktionsbuild und 15 Tests bestanden, darunter Originalpfad-Prüfsummen, geometrische Grenzen und getrennte Bedienflächen. Das ergänzte Browser-Prüfskript ist syntaktisch korrekt, wurde wegen der bestehenden administrativen Zugriffssperre aber nicht ausgeführt. Siehe `current-techradar-logos-report.json` und `../design-reference/current-techradar-logos.json`.

**Detailheader und Auswahl vom 06.10.2026:** Alle sechs Artikel verwenden auf Desktop `7b448.svg` und auf Mobil `b4102.svg` mit denselben Randpositionen wie die Homepage. Dies ersetzt die ursprünglichen Detailquadranten. Die direkte HTML-Ausgabe aller sechs Komponenten enthält die korrekten Original-Assets und alle verfügbaren Kategorieartikel als aktive Select-Ziele; bei TypeScript/Figma/OpenTofu sind dies drei Ziele, bei GitLab/GitHub Copilot zwei. Produktionsbuild und zehn bestehende Artikel-/Tastaturtests bestanden. Browser-Prüfscriptsyntax korrekt; der Ablauf TypeScript → Figma → OpenTofu → TypeScript ist mit Maus- und Tastaturauswahl vorbereitet. Die aktuelle Sicht- und Klickprüfung wurde erneut durch die nicht verifizierbare administrative Browser-Sicherheitsrichtlinie blockiert. Siehe `detail-pages-update-report.json`.

**Fünf zusätzliche Detailartikel vom 06.10.2026:** Inhalte und verwandte Themen für OpenTofu, Figma, TypeScript, GitHub Copilot und GitLab aus den gelieferten Screenshots übernommen. Detailtemplate `287:2098` / `40:235` mit Screenshots erneut über Figma MCP gelesen; gemeinsame responsive Detailansicht mit passenden Breadcrumbs, Original-Quadranten und mobiler Auswahl. Produktionsbuild und zehn Artikel-/Tastaturtests bestanden; Browser-Prüfscriptsyntax korrekt. Unveränderte Kopien der fünf Referenzbilder per SHA-256 mit den Originalen abgeglichen. Kategorien und Ringe vom Nutzer bestätigt: OpenTofu unter Languages & Frameworks / Trial, Figma und TypeScript dort unter Adopt; GitHub Copilot und GitLab unter Tools / Adopt. Produktionsbuild und fünf Artikeltests nach dieser Bestätigung erneut bestanden. Die aktuelle Browserdarstellung und vollständige Interaktionen bleiben wegen der bestehenden administrativen Zugriffssperre ungeprüft. Siehe `detail-pages-update-report.json` und `detail-screenshot-source-report.json`.

**Null-Zähler der Kategorie-Tabs vom 06.10.2026:** Suchergebnis-Frame `258:2906` mit Screenshot erneut über Figma MCP gelesen. Kategorien ohne Treffer verwenden jetzt graue Zähler (#DBD9D6) mit dunklem Text (#1D1D1D), auch bei aktivem Tab und bei einer vollständig leeren Suche. Die vorhandenen Farb-Tokens und gemeinsamen Zähler werden verwendet; keine Assetänderung. Produktionsbuild bestanden. Der erneute Zugriff auf die aktuelle lokale Browser-Vorschau wurde blockiert, weil die administrative Sicherheitsrichtlinie nicht verifiziert werden konnte; keine aktuelle Sichtprüfung.

**Mobile Ringüberschriften vom 06.10.2026:** Frame `56:2169` mit Screenshot erneut gelesen. Die veraltete 14/20-px-Überschreibung auf `/techradar` wurde entfernt; Adopt, Trial, Assess und Hold verwenden jetzt die vorhandenen H4-Tokens mit 20/26 px und Semibold wie in Figma. Produktionsbuild bestanden. Die aktuelle Sichtprüfung im Browser bleibt durch die bestehende administrative Zugriffssperre blockiert.

**DevOps-Dropdown vom 06.10.2026:** Frame `368:2342` mit Screenshot über Figma MCP gelesen; selbst gestaltete Auswahl mit allen 18 Techniques-Themen unter Adopt/Trial/Assess/Hold und Original-Haken ergänzt. Nur DevOps besitzt ein verfügbares Detailziel. Produktionsbuild, fünf Tests der Tastaturnavigation/Suche und Syntaxprüfung des angepassten Browser-Prüfskripts bestanden. Beide Original-Assets lokal mit nativen Maßen geprüft. Die vorbereiteten Browserchecks wurden wegen der bestehenden administrativen Zugriffssperre nicht ausgeführt; keine aktuelle visuelle oder vollständige Interaktionsprüfung.

**Mobile Erklärungs-Breadcrumb vom 06.10.2026:** Aktualisierten Frame `56:2169` und Breadcrumb `471:2511` mit Screenshots über Figma MCP gelesen. Bestehende Navigation auf `/techradar` mobil eingeblendet und Typografie/Abstände an den vollständigen mobilen Frame angepasst. Keine Assetänderung. Produktionsbuild bestanden; aktuelle Sichtprüfung im Browser wegen der bestehenden administrativen Zugriffssperre weiterhin offen.

**Statische mobile Kategoriegrafik vom 06.10.2026:** Die vier Quadrantenseiten verwenden unter 768 px wieder das dekorative Homepage-Original `b4102.svg` mit gemeinsamer Randposition und beschnittener Grafikzone. Desktop und DevOps behalten ihre interaktiven Quadranten. Produktionsbuild und Prüfscriptsyntax bestanden. Die Browserchecks wurden an die neue Vorgabe angepasst, sind wegen der bestehenden administrativen Zugriffssperre aber weiterhin nicht ausgeführt.

**Weitere Quadrantenseiten vom 06.10.2026:** Platforms `266:4810`, Tools `266:5425` und Languages & Frameworks `266:5924` einschließlich Figma-Screenshots gelesen. Drei neue Seiten mit eigenen Original-Radargrafiken und gemeinsamen Hover-/Tooltip-Komponenten. Produktionsbuild und fünf Zeitsteuerungstests bestanden; 38 neue SVG-Dateien, Koordinaten, Routen, Querverweise und Beispieldaten lokal geprüft. Keine eigene Mobilvorlage für diese Kategorien; Mobilverhalten von Techniques abgeleitet. Die aktuelle Browserdarstellung bleibt wegen der bestehenden administrativen Zugriffssperre ungeprüft. Vorbereitete Browserchecks wurden nicht ausgeführt. Siehe `category-pages-update-report.json`, `category-pages-asset-report.json` und `category-pages-configuration-report.json`.

**Header-Quadrant vom 06.10.2026:** Figma `304:3046` einschließlich Screenshot und Hover-Geometrie gelesen. Techniques und DevOps verwenden einen vollständig eingepassten gemeinsamen Quadranten mit schwarzer Hoverfläche und Tooltips für alle fünf sichtbaren Logos. Build und fünf Zeitsteuerungstests bestanden; 41 lokale Assets vorhanden und Prüfscriptsyntax korrekt. Browserzugriff erneut administrativ blockiert; die ergänzten Prüfungen sind vorbereitet, aber nicht ausgeführt. Siehe `quadrant-update-report.json`.

**Radaranimation vom 06.10.2026:** Persistente Original-Assets, Überblendung und sanfte Skalierung in 300 ms, einschließlich Rückweg und reduziertem Bewegungsmodus. Produktionsbuild und fünf Hover-Zeitsteuerungstests bestanden. Die Animation ist wegen der bestehenden administrativen Browser-Zugriffssperre noch nicht visuell geprüft. Siehe `animation-update-report.json`.

**Headeranpassung vom 06.10.2026:** Grafiken oben rechts am Rand; mobile Grafikzone getrennt vom Text; Logos zentriert; Originalpfeil im mobilen Select. Produktionsbuild bestanden. Neue Layoutprüfungen vorbereitet, wegen der weiterhin blockierten administrativen Browserprüfung noch nicht ausgeführt. Siehe `header-update-report.json`.

**Listenanpassung vom 06.10.2026:** Frame `258:3213` erneut gelesen; Schrift-Hierarchie, schwarze Kategorietabs, Suchfeld-Fokus und Enter-Suche korrigiert. Produktionsbuild bestanden. Die erweiterten Browserprüfungen sind noch nicht ausgeführt, weil die administrative Sicherheitsrichtlinie weiterhin nicht verifiziert werden kann. Siehe `list-update-report.json`.

**Aktueller Stand nach der Hero-/Hover-Anpassung:** Build und fünf Hover-Zeitsteuerungstests bestanden. Die neue Darstellung wurde noch nicht im Browser geprüft, weil Browser Use die administrativ vorgegebene Sicherheitsrichtlinie nicht verifizieren konnte und den Zugriff blockierte. Diese Sperre wurde nicht umgangen. `update-report.json` dokumentiert den aktuellen Prüfstatus; die folgenden Browserergebnisse und Bilder beziehen sich auf die vorherige Umsetzung. `npm run test:browser` ist für den neuen Stand erweitert, aber noch nicht ausgeführt.

Geprüft am 05.10.2026 mit Google Chrome über Playwright und visueller Sichtprüfung der gespeicherten Screenshots.

## Browsergrößen

| Seite | Desktop | Mobil |
|---|---|---|
| Homepage | 1440 × 2226 | 393 × 1992 |
| Techniques | 1440 × 2149 | 393 × 2694 |
| DevOps | 1440 × 2000 | 393 × 2336 |
| Erklärung | 1440 × 2846 | 393 × 2921 |

Zusätzlich alle Seiten mit 900 × 1000 px. Die Screenshots enthalten die ganze Seite einschließlich des Beispieldaten-Hinweises.

## Funktionale Prüfung

- Homepage → Techniques → DevOps; Breadcrumb zurück; Logo zurück zur Homepage.
- Homepage → Erklärung; Browser-Zurück.
- Suche „React“: fünf Beispiele; Listenwechsel ohne Veränderung der Hero-Geometrie; fünf Ergebniskarten.
- Suchbegriff ohne Treffer, Löschen der Suche und Themenfilter Cloud.
- Wechsel zurück zum Radar; Hoverhinweis per Tastaturfokus.
- Mobile Kategorieansicht und Auswahlfeld mit DevOps; Suchleiste entsprechend der Mobilvorlage ausgeblendet.
- Sprunglink per Tab/Enter; Fokus nach Navigation.
- Alle sichtbaren Bilder geladen, kein horizontaler Überlauf und keine JavaScript-Seitenfehler bei den geprüften Größen.
- TypeScript-/Produktionsbuild erfolgreich.

Maschinenlesbare Messwerte und Ergebnis: `browser-report.json`. Die Prüfung ist mit `npm run test:browser` wiederholbar.

## Visueller Vergleich

`figma-*.png` sind über Figma MCP heruntergeladene Referenzen. `home-*`, `techniques-*`, `devops-*` und `explanation-*` sind Browseraufnahmen. Referenzen wurden mit der Umsetzung verglichen. Korrigiert wurden insbesondere der Techniques-Radar mit seiner Vektorgeometrie, Überschriftenabstände und Kartenumbrüche.

Bewusste Abweichungen: Beispieldaten-Hinweis am Seitenende; korrekter DevOps-Wert im mobilen Auswahlfeld; nicht beauftragte Ziele ohne Navigation; Tablet-Anordnung abgeleitet. Textkanten können sich zwischen Figma-Renderer und Chrome leicht unterscheiden.

## Einschränkungen

Keine echte Datenquelle, Redaktion, Authentifizierung oder Backendintegration. Radar-Suchpositionen bleiben simuliert und werden im UI erklärt. Keine Prüfung in Safari/Firefox oder auf physischen Mobilgeräten; getestet wurden die responsive Darstellung und Tastaturbedienung in Chrome. Dies ist kein vollständiges Accessibility-Audit. Die Schriftprüfung gilt für den Rechner mit installierter Proxima Nova A.

Die automatische Prüfung in Chrome wurde erfolgreich abgeschlossen. Das anschließende Öffnen der eingebetteten Vorschau über Browser Use wurde von der Browser-Sicherheitsprüfung blockiert, weil die administrativ vorgegebene Richtlinie nicht überprüft werden konnte. Diese Sperre wurde nicht umgangen. Der lokale Vite-Server läuft weiterhin auf http://127.0.0.1:5173; gespeicherte Browseraufnahmen liegen in diesem Ordner.
