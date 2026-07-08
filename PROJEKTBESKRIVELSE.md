# Bryst — Projektbeskrivelse (udkast v0.5)

*Opdateret 2026-07-08 (aften). **Modulnumrene er byttet:** Modul 2 = Privatmodul (augmentation), Modul 3 = Sygehusmodul (rekonstruktion) — logisk rækkefølge på forsiden (1-2-3-katalog); hashes, id'er og CSS fulgte med. Nyt i samme omgang: per-side mål/valg ved asymmetri i Modul 1 (Ens/Højre/Venstre — mål, shortlist og picks pr. side); AK-arket åbner nu til browser-visning med print-knap, SVG-skitse af optegningerne og "kort opskrift til rutinerede"; tidsstemplede dokumenttitler (= filnavne ved Gem som PDF) på AK-ark og begge patient-PDF'er; nyt /grafik-genereret app-ikon/favicon (cirkel + profilbue + rød dimensionslinje på grafit). Ændringer fra v0.4 (litteraturudvidelsen — Blondeel I–III + Hedén): Hedén/AK-ptose-vurdering med estimeret LVC pr. implantat i Modul 1 (inkl. printbart AK-markeringsark); brystbevarende gren (⅛/⅜-algoritmen) i Modul 3; Blondeel 3-trins-analyse (footprint/konus/kuvert) i Modul 3 + PDF; forløbstidslinje i Modul 3 + PDF; SGAP/IGAP i ekspertvisningen; symmetriserings-kort i Modul 3; mastopexi-teknikvalg pr. Regnault-grad + sideforskel i Modul 2. Ændringer fra v0.3: ekspertvisning er standard i Modul 3; "Ny patient"-knap i alle modulheadere (central nulstilling på tværs af moduler). Ændringer fra v0.2: ekspander-forslag ved rekonstruktion, volumen-spænd-garanti, sløring af ikke-eksisterende filterkombinationer, kobling patientmoduler ↔ Modul 1 (patientoversigt-picks), PDF-dokumentation af fravalgte muligheder (implementeret), katalog-tillæggets værktøjer (volumen-opslag, "≈ lignende", fylde-kolonner) og ny forside beskrevet.*

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
- **Hedén/AK-ptose-vurdering (kontekst = augmentation):** To ekstra mål — papil→IMF (maksimalt strakt) og central kirtel-pinch. Pr. implantatkort beregnes **LVC** (lower ventral curvature — Mentor opgiver den ikke; estimeres geometrisk som kvart-ellipsebue af højde-andel × projektion, rund 55 %/anatomisk 50 % distalt for projektionspunktet, altid mærket "estimeret") og ideal papil→IMF = LVC + kirtel-pinch/2. Verdikt efter Hedéns regel: hudoverskud **> 2 cm → mastopexi indiceret**; 0,5–2 cm → kan ofte korrigeres med augmentation alene (incision over ILP-linjen + distal dissektion); −2,5–0,5 cm → envelope passer; < −2,5 cm → markant foldesænkning nødvendig (obs dobbelt-boble). Indgår i journalteksten. Kilde: Hedén, Clin Plast Surg 2009 + SFEP 2013-foredraget.
- **AK-markeringsark:** knap pr. kort (augmentation) åbner et ark til **browser-visning** (ingen auto-print; fast "Print / Gem som PDF"-knap, skjult ved print) med implantatets tal indsat: NS-linje (45° armelevation), ILP-linje (halv/55 % implantathøjde), hudbehov i nedre pol — både normal augmentation (A) og mastopexy-augmentation med omvendt planlægning (B), inkl. to-tempi-rækkefølgen (implantat ind før hudresektion) og 2-seance-faldgruben. Indeholder desuden en **abstrakt SVG-skitse** af optegningerne (panel A og B, dynamiske mål indsat — jf. billedpolitikken: kun linjediagrammer) og en **kort opskrift til rutinerede** nederst. Dokumenttitlen (= filnavn ved Gem som PDF) indeholder katalognr., evt. side og tidsstempel.
- **Asymmetri — mål og valg pr. side:** Toggle "Ens sider / Højre / Venstre" øverst under Mål. Ved per-side gemmes alle mål (bredde, højde, pinch, volumen, papil→IMF, kirtel-pinch) separat pr. side; shortlist-overskriften viser aktiv side, picks mærkes med side (samme implantat kan vælges til begge sider), og side fremgår af journaltekst, AK-ark og patientmodulernes oversigter/PDF'er. Første skift kopierer de fælles mål til begge sider.
- **Datakvalitet:** Katalogdata ekstraheres og verificeres 100 % manuelt mod PDF'en — ét forkert katalognummer er en patientsikkerhedshændelse. Tjek om produkter i 2023-kataloget er udgået.

## Modul 3: Sygehusmodul — rekonstruktionsflow (byg sidst)

Samtaleværktøj til delt skærm. Før flowet udfyldes de parametre, der afgør hvilke muligheder der er tilgængelige.

**Parametre (skal underbygges med grundig research, DBCG som primær kilde):**
tidligere/planlagt strålebehandling, modsidigt brysts størrelse og ptose (symmetrisering), cicatricer i potentielle donorområder (DIEP m.fl.), BMI, brystbredde, rygestatus, diabetes og øvrig komorbiditet, bindevævssygdom, genetik/profylaktisk indikation, mastektomitype (komplet/lumpektomi/nipple-sparing-mulighed), alder (ikke selvstændig kontraindikation), patientpræference.

**DBCG-forankring (v3.1, skal håndteres korrekt i logikken):**

- "Der findes ingen evidens for at en rekonstruktionstype er mere anbefalelsesværdig end en anden" → flowet må aldrig ranke muligheder.
- Planlagt strålebehandling → anbefalet udskydelse til sekundær rekonstruktion.
- Rygning → krav om ophør.
- Højt BMI, komorbiditet, alder → relative kontraindikationer, vises som forbehold, ikke blokering.

Flowet ender i sammenligningsbillede (fordele/ulemper side om side) af de egnede muligheder. Lægen supplerer mundtligt.

**Ekspertvisning** (lap-typer enkeltvis: DIEP / latissimus dorsi / PAP-TUG / **SGAP-IGAP**) er slået **til som standard** — kan fravælges pr. konsultation, hvis den samlede "Autolog lap"-visning passer bedre til patienten. SGAP/IGAP-kortet bærer Blondeel II-forbeholdene (fastere væv, lille hudø, bedst ved primær rekonstruktion, bilateral ofte i to seancer).

**Brystbevarende gren (Blondeel III):** Intake-feltet "Udgangspunkt" skifter mellem mastektomi- og BCT-forløb. BCT spørger om defekt-andel (⅛/⅜-grænserne) og timing (immediat/senere) og viser fem kort: glandulær remodellering (< ⅛), lokoregional lap TDAP/LICAP/AICAP (⅛–⅜, +20 % volumen ved immediat før RT, "brænd ikke broer"-forbeholdet), lipofilling (2–3+ seancer; forbedrer RT-hud, tilfører ikke hud), mastektomi + total rekonstruktion (> ⅜; Cocquyt 2003) og symmetrisering. RT-ventereglen (6–12 mdr før endelig vurdering) går igen som note. Ekspertvisningstoggle skjules i BCT-forløbet.

**Blondeel 3-trins-analyse (valgfri):** Intake kan registrere status for footprint (intakt/deformeret/mangler), konus (intakt/delvis/mangler) og hudkuvert (ok/stram-RT-beskadiget/mangler). Udfyldt analyse vises som opsummering med afledt strategi (fx "footprint retableres først") i oversigten og medtages i PDF'en. Default "ikke vurderet" — påvirker aldrig filtreringen, kun dokumentationen.

**Forløbstidslinje:** Sammenlignings-trinnet viser det typiske etapeforløb for de valgte muligheder (OP1 med bevidst 5–10 %/15–20 % volumenoverskud ved autolog · ekspanderfyldning · ~6 mdr sætning · OP2 justering/symmetri/papil · +3 mdr areola-tatovering; BCT-variant med RT-stabilisering 6–12 mdr). Medtages i PDF'en som "Forventet forløb" — dokumenterer at etaperne er planen, ikke en komplikation (Blondeel II).

**Symmetrisering af modsatte bryst** er et selvstændigt kort i begge forløb (gråes ved bilateralt indgreb) — i BCT-forløbet med Blondeel III-pointen om at modsidig reduktion alene kan være hele løsningen ved RT-skadet men acceptabelt formet bryst.

## Modul 2: Privatmodul — augmentation (byg som nr. 2)

Forsimplet flow: rask patient, ønske om større barm. Implantat/fedt/løft/kombination. Genbruger filtermotoren fra modul 1 og flow-komponenterne fra modul 2. Implantatkortet henviser til ris-testen (1 dl ris ≈ 100 cc) som konkret hjemme-redskab til volumenafprøvning.

**Mastopexi-lag (Hedén):** Løft-kortet foreslår teknik pr. Regnault-grad (I: periareolær kun til små justeringer — flader NAC og udvider areolaen; II: vertikal; III: inverteret-T med kort fold-ar) og nævner at øvre polfylde efter løft alene aftager over ~6 mdr. Kombinationskortet bærer AK-pointerne: løftet dimensioneres efter implantatets mål (LVC), implantat ind før hudresektion, og ved 2-seance-plan skal 1. seance planlægges efter det senere implantat (klassisk faldgrube). Intake har desuden **sideforskel (asymmetri)** — ja/nej — som føjer en drøftelsesnote til implantat-/kombinationskortene (med henvisning til Modul 1's per-side-planlægning: mål og implantatvalg for højre og venstre hver for sig) og medtages i PDF'ens grundlag. Den præcise vurdering (2 cm-reglen pr. implantat) ligger i Modul 1 og der henvises dertil.

## "Ny patient" — nulstilling mellem konsultationer

Alle tre modulheadere har en "Ny patient"-knap (i modulets eget udtryk). Den nulstiller efter bekræftelse **alt på tværs af hele værktøjet**: mål/filtre i Modul 1, intake + valgte løsninger i Modul 2 og 3 (begge tilbage til trin 1), patientoversigt-picks og katalogets sammenligningsbakke. Teknisk: central `Bryst.resetAll()`, som hvert modul registrerer sin oprydning på via `Bryst.onReset()` — nye moduler hægter sig automatisk på samme mekanisme. Understøtter kernebeslutning 1 (statelessness): intet fra én patient må hænge ved til den næste.

## Kobling: patientmoduler ↔ Modul 1

- Implantat-relaterede valg i Modul 3 (implantat / ekspander / kombination / LD-lap) og Modul 2 (implantat / kombination) har "Åbn implantatvalg →" (`#modul1?fra=modul2|3`).
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
2. **Modul 2** — privatflow (simplest patientvendte flow).
3. **Modul 3** — sygehusflow (mest komplekst og følsomt).
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
- Blondeel et al.: *Shaping the Breast … An Easy Three-Step Principle*, del I–III, Plast Reconstr Surg 2009 — 3-trins-analysen (footprint/konus/kuvert), ⅛/⅜-algoritmen efter brystbevarende kirurgi, etapeforløbet og volumenoverskudsreglerne, SGAP/IGAP-forbeholdene. PDF'er i `artikler/` (**ikke i git**, ophavsretligt tredjepartsmateriale).
- Hedén: *Mastopexy Augmentation with Form Stable Breast Implants*, Clin Plast Surg 2009 + SFEP 2013-foredrag (YouTube EyVfUeH6bfU) — AK-metoden: NS-linje, ILP-linje, LVC, 2 cm-reglen for mastopexi-indikation, omvendt planlægning ved mastopexy-augmentation. NB: LVC-værdier i værktøjet er geometriske estimater (Hedéns publicerede tal gælder Allergan).
