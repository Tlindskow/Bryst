# Bryst — Projektbeskrivelse (udkast v0.2)

*Opdateret 2026-07-06. Ændringer fra v0.1: designprincipper, regulatorisk afklaring, statelessness, etapeplan og governance tilføjet.*

## Formål

Et simpelt, overskueligt værktøj i tre moduler, som styrker patientens overblik og forståelse af tilgængelige muligheder — og som slutter med, at patienten har truffet et velinformeret valg.

**Status:** Privat testbrug. Ikke til klinisk beslutningstagning og ikke underlagt godkendelseskrav på nuværende stadie. Skulle værktøjet senere anvendes klinisk eller deles med kolleger, skal MDR-spørgsmålet (beslutningsstøtte-software, regel 11) genbesøges.

## Kernebeslutninger (låst)

1. **100 % stateless.** Intet gemmes. Ingen patientidentifikatorer indtastes — heller ikke navn på PDF'en. PDF genereres lokalt i browseren. Ingen persondata i systemet.
2. **Filtrering, ikke anbefaling.** Værktøjet viser hvilke muligheder der matcher indtastede parametre, med kildehenvisning til DBCG. Lægen træffer valget. Sprogbrug i UI: "egnede muligheder" — aldrig "anbefalet".
3. **Patientmodulet er et samtaleværktøj.** Det ender i et sammenligningsbillede af egnede muligheder — ikke en tragt mod ét svar. Ikke-egnede muligheder gråes ud med begrundelse ("ikke egnet pga. planlagt strålebehandling, jf. DBCG afsnit X") i stedet for at skjules.
4. **Billedpolitik:** Abstrakte silhuetter og formdiagrammer er tilladt. Ingen realistiske billeder af patienter, hud eller bryster.
5. **Versionsstempling:** Alt output stemples med datagrundlag, fx "Genereret ud fra DBCG v3.1 (nov. 2024), Mentor katalog 2023".

## Modul 1: Lægemodul — implantatvalg (byg først)

Filtermotor over Mentor-kataloget, ikke en algoritme der udpeger "det rigtige implantat" (findes ikke valideret; nærmeste ramme er vævsbaseret planlægning à la Tebbetts High Five).

- Input: brystbredde → diameterinterval; vævsdække/pinch test → profil/projektion; ønsket volumen; glat/tekstureret; rund/anatomisk; ekspander/Becker til rekonstruktion.
- Output: shortlist på 3–6 implantater med matchende sizer (katalognr. + sizer-nr., volumen, diameter, projektion, lower pole arc).
- **Kopi-knap:** kopierer valgt implantat + sizer + en fast skabelon-journaltekst med indsatte værdier (ikke frit genereret tekst). Overvej DBIR-felter. Teksten skal afspejle at der ved konsultationen vælges en *plan* (type/interval) — det endelige implantat afgøres peroperativt med sizer.
- **Datakvalitet:** Katalogdata ekstraheres og verificeres 100 % manuelt mod PDF'en — ét forkert katalognummer er en patientsikkerhedshændelse. Tjek om produkter i 2023-kataloget er udgået.

## Modul 2: Sygehusmodul — rekonstruktionsflow (byg sidst)

Samtaleværktøj til delt skærm. Før flowet udfyldes de parametre, der afgør hvilke muligheder der er tilgængelige.

**Parametre (skal underbygges med grundig research, DBCG som primær kilde):**
tidligere/planlagt strålebehandling, modsidigt brysts størrelse og ptose (symmetrisering), cicatricer i potentielle donorområder (DIEP m.fl.), BMI, brystbredde, rygestatus, diabetes og øvrig komorbiditet, bindevævssygdom, genetik/profylaktisk indikation, mastektomitype (komplet/lumpektomi/nipple-sparing-mulighed), alder (ikke selvstændig kontraindikation), patientpræference.

**DBCG-forankring (v3.1, skal håndteres korrekt i logikken):**

- "Der findes ingen evidens for at en rekonstruktionstype er mere anbefalelsesværdig end en anden" → flowet må aldrig ranke muligheder.
- Planlagt strålebehandling → anbefalet udskydelse til sekundær rekonstruktion.
- Rygning → krav om ophør.
- Højt BMI, komorbiditet, alder → relative kontraindikationer, vises som forbehold, ikke blokering.

Flowet ender i sammenligningsbillede (fordele/ulemper side om side) af de egnede muligheder. Lægen supplerer mundtligt.

## Modul 3: Privatmodul — augmentation (byg som nr. 2)

Forsimplet flow: rask patient, ønske om større barm. Implantat/fedt/løft/kombination. Genbruger filtermotoren fra modul 1 og flow-komponenterne fra modul 2.

## Output: Eksporterbar PDF

- Opsummerer: valgt løsning, hvordan I nåede dertil, og **fravalgte muligheder patienten principielt kunne have valgt** (dokumenterer reel fælles beslutningstagning).
- Ingen patientidentifikatorer — patienten kan selv skrive navn på.
- PDF'en supplerer men **erstatter ikke** journalført informeret samtykke (sundhedsloven).
- Versionsstemplet (se kernebeslutning 5).

## Design

- Én fælles motor, **to skins**: roligt, nedtonet og sagligt til sygehusmodulet (cancerpatienter skal ikke møde salgsæstetik); eksklusivt udtryk med lyserøde nuancer til privatmodulet.
- Parallax kun på evt. forside — ikke i konsultationsflowet (distraherer på delt skærm).
- Minimal tekst, ingen informations-overload. Grafik via /frontend-design og /grafik. Må ikke fremstå AI-generisk.
- Abstrakte silhuetter/formdiagrammer til formidling af form og projektion.

## Etapeplan

1. **Modul 1** — filtermotor + kopi-knap. Selvstændig værdi fra dag ét, ingen patientvendt risiko. Inkl. manuel verifikation af katalogdata.
2. **Modul 3** — privatflow (simplest patientvendte flow).
3. **Modul 2** — sygehusflow (mest komplekst og følsomt).
4. Løbende: PDF-eksport bygges sammen med hvert patientvendt modul.

## Governance og vedligehold

- DBCG og Mentor opdaterer løbende → review af logik og data ved hver ny version af hhv. guideline og katalog.
- Før evt. brug af andre end mig selv: kollega stress-tester beslutningstræet med edge cases; MDR-status genbesøges.

## Afklaret

- **Kun til eget brug.** Ingen kolleger som brugere — forenkler governance; MDR-status genbesøges kun hvis dette ændres.
- **Kører ikke på sygehusets udstyr.** Kun eget udstyr, som forberedelses-/samtaleværktøj.

- **Katalog-omfang:** Hele Mentor-kataloget ekstraheres — alle gel-serier, saline, Spectrum, Becker og ekspandere.
- **Platform:** Én samlet HTML-fil med alle tre moduler, fælles motor og to skins. Åbnes lokalt i browser, intet gemmes, ingen installation.
- **DBIR-felter fra start:** Journalskabelonen struktureres med DBIR-relevante felter (implantattype, katalognr., placering, incision).

## Åbne spørgsmål

Ingen. Udkastet er byggeklart.

## Kilder

- Mentor Product Guide, EMEA, effective 2023 (implantater, sizere, ekspandere — tabeldata verificeret egnet til ekstraktion).
- DBCG: Kirurgisk behandling af brystkræft, v3.1, adm. godkendt 27-11-2024.
