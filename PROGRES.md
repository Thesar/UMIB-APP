# Progresi - Screamulus

Data: 04.11.2026.

## Cka punon

- Aplikacioni ne Expo SDK 58 ka listen e mesimeve, filtrin per Calculus dhe detajet e nje mesimi.
- M0: AGENTS.md permbledh ekipin, perdoruesin e pare, deshmite nga bisedat, punen e vetme dhe kufijte e MVP-se.
- M1/M3: lista dhe detajet lexojne nga tabela lessons ne Supabase. Leximi nga API-ja u verifikua: gjashte mesime, perfshire Amplitude me formulen y = A sin(x). Ne shfletues u provua edhe filtri, qe shfaq vetem tri mesimet Calculus. M3 ketu eshte ekrani i pare i HARTA-s, jo Studio e plote.
- M2: ne detajet e mesimit mund te shkruhet dhe te ruhet nje shenim personal ne study_notes. API-ja u verifikua me dy llogari guest: shenimi mbetet pas rikthimit te sesionit dhe llogaria tjeter nuk mund ta lexoje ose te shkruaje ne emer te pronarit.
- Prova ne telefon: me 04.11.2026, ekipi konfirmoi se hapi aplikacionin, ruajti nje shenim te Amplitude dhe e gjeti perseri pas mbylljes dhe rihapjes. Ky eshte konfirmim i raportuar nga ekipi; agjenti nuk kontrolloi fizikisht telefonin.

## Cka beri agjenti

- Lexoi EKIPI.md, BISEDAT.md dhe HARTA.md dhe ruajti dallimin mes funksioneve ekzistuese dhe Studio-s se planifikuar.
- Shtoi kontekstin e produktit dhe rregullat e detyres ne AGENTS.md, duke ruajtur udhezimet ekzistuese te Expo-s.
- Krijoi tabelen lessons me RLS dhe leje vetem per lexim nga aplikacioni, transferoi gjashte mesimet ekzistuese dhe lidhi listen/detajet me databazen. Shtoi ngarkimin, gjendjen bosh, gabimin dhe riprovimin.
- Ruajti lidhjen publike te projektit vetem ne .env.local te perjashtuar nga Git; .env.example ka vetem vende per vlerat.
- Me miratimin e ekipit aktivizoi llogarite guest, shtoi ruajtjen e sesionit, formularin e shenimit dhe RLS sipas user_id. Kerkesa e deshtuar nuk e fshin tekstin dhe suksesi kerkon pergjigje nga databaza.
- Provoi leximin publik te mesimeve, ruajtjen/rileximin e nje shenimi, rikthimin e sesionit, izolimin mes dy perdoruesve dhe refuzimin e shenimeve boshe, shume te gjata ose me lesson_id qe nuk ekziston. Perdoruesit e aplikacionit nuk mund ta ndryshojne biblioteken e mesimeve.
- Rishikoi diff-in dhe ruajti hapat me commit te vecante: M0 per kontekstin, M1/M3 per mesimet reale dhe M2 per shenimet private.

## Verifikimi

| Kufiri | Rezultati dhe deshmia |
| --- | --- |
| Lista > API > databaza | SELECT me publishable key kthen gjashte mesime; ne shfletues shfaqet Live library dhe filtri kthen tri tema Calculus. |
| Detaji > databaza | Amplitude hapet me formulen y = A sin(x) nga lessons. |
| Formulari > INSERT > rilexim | Ne shfletues u ruajt nje shenim me Save note dhe u shfaq ne listen personale. |
| Rihapja > sesioni > shenimi | Shenimi mbeti pas reload-it te plote ne shfletues. Ekipi konfirmoi te njejten sjellje pas mbylljes/rihapjes ne telefon. |
| Privatësia | Testi me dy llogari guest refuzoi leximin e shenimit te tjetrit dhe INSERT me user_id te tjetrit. Leximi pa autentikim i study_notes refuzohet. |
| Validimi ne databaze | Refuzohen tekst bosh, mbi 1000 karaktere dhe lesson_id qe nuk ekziston. Ndryshimi i lessons nga perdoruesi refuzohet. |
| Kodi | npm run lint dhe npx tsc --noEmit kaluan. expo install --check nuk gjeti versione te papershtatshme ne harten lokale te SDK 58. Ne fund te proves se shfletuesit nuk kishte gabime ne console. |

## Email me Brevo

Brevo mund te lidhet si SMTP per konfirmimet dhe rikthimin e fjalekalimit kur te shtohet hyrja me email. Ende nuk eshte konfiguruar dhe nuk nevojitet per llogarite guest te kesaj detyre. Kredencialet SMTP do te vendosen vetem ne panelin e Supabase, jo ne aplikacion ose Git.

## Hapi tjeter

Te merret nje screenshot real nga telefoni ku shihet shenimi i ruajtur dhe te dorezohet bashke me linkun e repository-t. Studio me mikrofon/anim dhe hyrja me email per disa pajisje mbeten hapa te mevonshem.
