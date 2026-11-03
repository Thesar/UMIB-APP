# Harta e produktit - Screamulus

Statusi: propozim per MVP, i rishikuar me dy rastet e para. Rasti i trete ka ende detaje per t'u plotesuar.

[SHEMBUJ.md](SHEMBUJ.md) tregon si mund te lidhen shenimet e bisedave me vendimet per MVP-ne.

## Rruga e projektit

Rruga 1 - Per veten: nje aplikacion studimi per ne dhe studentet e tjere. Sipas [planit te projektit](https://artifacts.agonbajgora.com/s/V5rlkg6yvdJqqCGJlpr-o1WZKnnPVvBHopCHDgpTh_Y/projekti.html), synojme se paku 10 perdorues te vertete cdo jave ne javet 10-12.

## Puna e vetme e aplikacionit

Te ndihmoje studentin te lidhe nje formule me grafikun e saj, duke krijuar nje grafik te thjeshte me ze dhe anim te telefonit dhe duke pare cfare ndryshoi.

## Problemi qe po verifikojme

Supozimi yne eshte se disa studente e njohin formulen, por e kane te veshtire te shpjegojne si ndryshon forma e grafikut. Ne biseden e pare, nje student i ekipit pershkroi ngaterrimin mes lartesise dhe perseritjes se vales, si dhe perdorimin e AI per ta zgjidhur ushtrimin. Ne rastin e dyte, nje student pershkroi veshtiresi me kuptimin gjate pergatitjes per test dhe mesimit permendesh. Kjo na orienton drejt nje prove ku studenti e ndryshon grafikun dhe e shpjegon me fjalet e veta. Duhet ende plotesuar rasti konkret i studentit te trete.

## Rrjedha kryesore: 4 ekrane

Lista e temave > Detaji i temes > Scream Studio > Rezultati.

| Ekrani | Cfare sheh studenti | Veprimi kryesor | Hapi pasues |
| --- | --- | --- | --- |
| 1. Lista e temave | Kartat e mesimeve dhe filtri ekzistues. | Zgjedh nje teme, p.sh. Amplitude. | Detaji i temes. |
| 2. Detaji i temes | Formula, shpjegimi i shkurter dhe, ne MVP, butoni "Provoje me ze" per temen e amplitudes. | Lexon shembullin dhe hap eksperimentin. | Scream Studio. |
| 3. Scream Studio | Grafiku, butoni "Fillo/Ndalo" dhe nje udhezim: fol me ze normal dhe ano telefonin. | Lejon mikrofonin, krijon nje grafik te shkurter dhe e ndal. | Rezultati. |
| 4. Rezultati | Grafiku i krijuar dhe nje shpjegim i shkurter i ndryshimeve. | Shpjegon si ndikuan zeri dhe animi, pastaj zgjedh "Provo perseri" ose "Kthehu te tema". | Studio ose detaji. |

Lista dhe detajet jane ne kodin aktual. Scream Studio, butoni per eksperimentin dhe rezultati jane te planifikuara; ende nuk jane ndertuar.

## Brenda MVP-se

- Lista dhe detajet ekzistuese si hyrje te shkurtra ne temat matematikore.
- Nje eksperiment i plote per amplituden: niveli relativ i zerit ndryshon lartesine e nje grafiku te thjeshte, ndersa animi i telefonit kontrollon ndryshimin e tij.
- Nje udhezim para fillimit qe shpjegon se zeri dhe animi jane kontrolle per grafikun; nuk po paraqitet vala e sakte e audios.
- Kerkesa per lejen e mikrofonit vetem kur studenti nis eksperimentin.
- Fillo, ndalo dhe provo perseri, me nje sesion te shkurter pa ngarkuar audio ne server.
- Grafik dhe shpjegim i thjeshte ne fund te proves.
- Nese leja refuzohet ose sensori mungon, studenti mund te kthehet te mesimi dhe ta provoje grafikun me kontrolle manuale ne te njejtin ekran.

## Jashte MVP-se

- Fotografimi i vijave, njohja automatike e grafikut dhe gjetja e formules nga fotografia (Reverse Scream).
- Gjenerimi i zerit nga nje grafik.
- Analiza interaktive e derivateve, integraleve dhe sfidat me pikezim; mesimet ekzistuese mund te mbeten si tekst.
- Galeria, ruajtja e performances, eksporti video dhe shperndarja ne rrjete sociale.
- Pagesat, renditjet dhe funksionet sociale.

## Kerkesat e semestrit

Harta me lart pershkruan rrjedhen kryesore te te mesuarit. Projekti do te perfshije edhe kerkesat e perbashketa te lendes:

- Backend ne Supabase, hyrje ne llogari dhe rregulla qe secili perdorues te shohe vetem te dhenat e veta, gjate javeve 5-8.
- Nje funksion me AI qe ndihmon ne shpjegimin e grafikut, i thirrur nga serveri dhe me celesin vetem ne server, ne javen 9.
- Gjendjet ngarkim, bosh, gabim dhe sukses, bashke me sjelljen kur rrjeti, lejet ose AI nuk jane ne dispozicion.
- APK per telefon, deklarim te perdorimit te AI, video dhe demonstrim sipas planit te semestrit.

Keto pjese jane te planifikuara dhe ende nuk jane ndertuar.

## Si do ta provojme

Ne telefon, studenti hap temen Amplitude, nis proven, ndryshon zerin dhe animin dhe e ndal. Me pas e pyetim cfare ndryshoi ne grafik dhe cfare e shkaktoi. Shenojme ku u bllokua dhe nese e shpjegoi lidhjen pa ndihmen tone.

Ky test ende nuk eshte kryer. Nese bisedat tregojne nje nevoje tjeter, ndryshojme harten para se te ndertojme Studio-n.
