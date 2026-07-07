# Bryst — Projektbeskrivelse (udkast v0.3)

*Opdateret 2026-07-07. Ændringer fra v0.2: ekspander-forslag ved rekonstruktion, volumen-spænd-garanti, sløring af ikke-eksisterende filterkombinationer, kobling patientmoduler ↔ Modul 1 (patientoversigt-picks), PDF-dokumentation af fravalgte muligheder (implementeret), katalog-tillæggets værktøjer (volumen-opslag, "≈ lignende", fylde-kolonner) og ny forside beskrevet.*

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

- Input: brystbredde → diameterinterval; brysthøjde → højdeinterval (kun anatomiske/CPG-implantater, som har højde som selvstændig tredje dimension ud over bredde/volumen — runde implantater har ingen tilsvarende parameter); vævsdække/pinch test → profil/projektion; ønsket volumen; glat/tekstureret; rund/anatomisk; ekspander/Becker til rekonstruktion.
- Output: shortlist på 3–6 implantater med matchende sizer (katalognr. + sizer-nr., volumen, diameter, projektion, lower pole arc).
- **Kopi-knap:** kopierer valgt implantat + sizer + en fast skabelon-journaltekst med indsatte værdier (ikke frit genereret tekst). Overvej DBIR-felter. Teksten skal afspejle at der ved konsultationen vælges en *plan* (type/interval) — det endelige implantat afgøres peroperativt med sizer.
- **Volumen-spænd:** Shortlisten skal altid indeholde nærmeste match **både over og under** det ønskede volumen; det aktuelle spænd vises som dynamisk hint under slideren, og hvert kort viser signeret Δ vol.
- **Ikke-eksisterende kombinationer:** Filterknapper, der ville give nul kandidater (fx glat + anatomisk — findes ikke i Mentor-kataloget), skraveres og kan ikke vælges. Beregnes dynamisk fra katalogdata, så det følger med ved katalogopdateringer. Ved ekspander-søgning er form-togglen inaktiv (form filtreres ikke for ekspandere).
- **Ekspander-forslag (2-stadie):** Ved kontekst = rekonstruktion foreslås pr. implantat den nærmeste ekspander (CPX4/Smooth) efter reglen: ekspanderbase ≈ implantatbredde − 0,5 cm (litteratur: endeligt implantat 0,25–1,0 cm bredere end ekspanderens base; Gabriel & Maxwell, Gland Surgery), med højdematch for anatomiske implantater og volumen som sekundært kriterium. Forslaget indgår i journalteksten.
- **Patientoversigt-picks:** "Til patientoversigt"-knap pr. kort lægger implantatet i en delt in-memory liste (`Bryst.picks`) til brug i patientmodulernes printbare oversigt. Kun i hukommelsen — lukkes vinduet, er listen væk (jf. kernebeslutning 1).
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

Forsimplet flow: rask patient, ønske om større barm. Implantat/fedt/løft/kombination. Genbruger filtermotoren fra modul 1 og flow-komponenterne fra modul 2. Implantatkortet henviser til ris-testen (1 dl ris ≈ 100 cc) som konkret hjemme-redskab til volumenafprøvning.

## Kobling: patientmoduler ↔ Modul 1

- Implantat-relaterede valg i Modul 2 (implantat / ekspander / kombination / LD-lap) og Modul 3 (implantat / kombination) har "Åbn implantatvalg →" (`#modul1?fra=modul2|3`).
- Modul 1 viser da en retur-bjælke tilbage til samtalen; implantater markeret "Til patientoversigt" vises i patientmodulets sammenlignings-trin med afkrydsning (fravælges pr. styk) og medtages på PDF'en med fulde katalogdata.

## Tillæg: Digitalt katalog

Hele Mentor-kataloget som opslagsværktøj i kataloguens egen teal-stil (farvekodet pr. produktfamilie). Ud over søgning, foldbare/sorterbare familietabeller og sammenligningsbakke:

- **Volumen-opslag:** indtast volumen ± tolerance → alle serier ved samme volumen, sorteret efter bredde, så bredde/projektion kan sammenlignes på tværs.
- **"≈ lignende":** pr. række — finder nærmeste tilsvarende variant i de andre serier (permanente mod permanente, ekspandere mod ekspandere) og åbner sammenligningen direkte.
- **Fylde-kolonner:** Becker (gel/saline/total) og Spectrum (fyldespænd) — vises kun hvor data findes.

## Output: Eksporterbar PDF

- Opsummerer: valgt løsning, hvordan I nåede dertil, og **fravalgte muligheder patienten principielt kunne have valgt** (dokumenterer reel fælles beslutningstagning). *Implementeret:* PDF'en har sektioner for "gennemgået, men fravalgt" og "vurderet mindre egnet her" (med begrundelse) samt drøftede implantater fra lægemodulet.
- Ingen patientidentifikatorer — patienten kan selv skrive navn på.
- PDF'en supplerer men **erstatter ikke** journalført informeret samtykke (sundhedsloven).
- Versionsstemplet (se kernebeslutning 5).

## Design

- Én fælles motor, **to skins**: roligt, nedtonet og sagligt til sygehusmodulet (cancerpatienter skal ikke møde salgsæstetik); eksklusivt udtryk med lyserøde nuancer til privatmodulet.
- Parallax kun på evt. forside — ikke i konsultationsflowet (distraherer på delt skærm). *Implementeret:* forsiden er en "fire døre"-indgang (opmålt wordmark med dimensionslinje, genereret topografisk konturbaggrund med pointer-parallax, fuldhøjde-døre i hvert moduls egen identitet). Respekterer `prefers-reduced-motion` og touch.
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
- Gabriel & Maxwell: *Implant selection in the setting of prepectoral breast reconstruction*, Gland Surgery — grundlag for ekspander/implantat-breddematch (implantat 0,25–1,0 cm bredere end ekspanderbase).
