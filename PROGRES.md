# Progresi - Screamulus

Perditesuar: 11.11.2026. Provat e shenuara me 04.11 mbeten prova te asaj date.

## J6 - pergatitja me 11.11.2026

- U riprodhuan dy gabimet e raportuara nga profesori duke kontrolluar kodin pa expo-env.d.ts dhe pa types te gjeneruara ne .expo: TS2307 per animated-icon.module.css dhe TS2882 per global.css.
- U shtua src/types/expo.d.ts ne Git qe ngarkon deklarimet zyrtare expo/types edhe para nisjes se Expo-s. Kontrollet e TypeScript mbeten aktive. Kontrolli normal, kontrolli pa fajllat e gjeneruar dhe lint kaluan.
- Ne panelin real te Supabase u kontrollua study_notes: RLS eshte aktiv, ekzistojne vetem SELECT dhe INSERT per authenticated, te dyja me auth.uid() = user_id. Nuk kishte policy zhvillimi qe jep qasje ne te gjitha shenimet. Policy publike e lessons lejon vetem leximin e bibliotekes se perbashket.
- U shtua scripts/verify-note-privacy.mjs per prove API me dy llogari te izoluara, pa filtrin user_id te aplikacionit. Ekzekutimi i 11.11 u ndal te leximi i pare publik me HTTP 522; paneli i projektit raportonte Unhealthy. Kjo nuk eshte prove e kaluar e API-se. Rikuperimi i sherbimit dhe riprovimi jane ende ne pune.
- CHECKOFF-J6.md ka hapat per dy telefona, shpjegimin e kolonave, screenshot-in dhe tekstin per Hub.
- Prova ne dy telefona dhe check-off-i ne klase ende nuk jane konfirmuar per J6. Nje prove API nuk i zevendeson keto.

## Cka punon

- Aplikacioni ne Expo SDK 58 ka listen e mesimeve, filtrin per Calculus dhe detajet e nje mesimi.
- M0: AGENTS.md permbledh ekipin, perdoruesin e pare, deshmite nga bisedat, punen e vetme dhe kufijte e MVP-se.
- M1/M3: lista dhe detajet lexojne nga tabela lessons ne Supabase. Leximi nga API-ja u verifikua: gjashte mesime, perfshire Amplitude me formulen y = A sin(x). Ne shfletues u provua edhe filtri, qe shfaq vetem tri mesimet Calculus. M3 ketu eshte ekrani i pare i HARTA-s, jo Studio e plote.
- M2: ne detajet e mesimit mund te shkruhet dhe te ruhet nje shenim personal ne study_notes. API-ja u verifikua me dy llogari guest: shenimi mbetet pas rikthimit te sesionit dhe llogaria tjeter nuk mund ta lexoje ose te shkruaje ne emer te pronarit.
- Prova ne telefon: me 04.11.2026, ekipi konfirmoi se hapi aplikacionin, ruajti nje shenim te Amplitude dhe e gjeti perseri pas mbylljes dhe rihapjes. Ky eshte konfirmim i raportuar nga ekipi; agjenti nuk kontrolloi fizikisht telefonin.
- Llogari opsionale: guest-i mund te vazhdoje pa email ose te lidhe email te verifikuar dhe fjalekalim me te njejtin user ID. Ekipi konfirmoi ne telefon regjistrimin, ruajtjen e shenimit guest, hyrjen perseri dhe rikthimin e fjalekalimit me email permes Brevo-s.

## Cka beri agjenti

- Lexoi EKIPI.md, BISEDAT.md dhe HARTA.md dhe ruajti dallimin mes funksioneve ekzistuese dhe Studio-s se planifikuar.
- Shtoi kontekstin e produktit dhe rregullat e detyres ne AGENTS.md, duke ruajtur udhezimet ekzistuese te Expo-s.
- Krijoi tabelen lessons me RLS dhe leje vetem per lexim nga aplikacioni, transferoi gjashte mesimet ekzistuese dhe lidhi listen/detajet me databazen. Shtoi ngarkimin, gjendjen bosh, gabimin dhe riprovimin.
- Ruajti lidhjen publike te projektit vetem ne .env.local te perjashtuar nga Git; .env.example ka vetem vende per vlerat.
- Me miratimin e ekipit aktivizoi llogarite guest, shtoi ruajtjen e sesionit, formularin e shenimit dhe RLS sipas user_id. Kerkesa e deshtuar nuk e fshin tekstin dhe suksesi kerkon pergjigje nga databaza.
- Provoi leximin publik te mesimeve, ruajtjen/rileximin e nje shenimi, rikthimin e sesionit, izolimin mes dy perdoruesve dhe refuzimin e shenimeve boshe, shume te gjata ose me lesson_id qe nuk ekziston. Perdoruesit e aplikacionit nuk mund ta ndryshojne biblioteken e mesimeve.
- Rishikoi diff-in dhe ruajti hapat me commit te vecante: M0 per kontekstin, M1/M3 per mesimet reale dhe M2 per shenimet private.
- Shtoi AuthProvider, ekranin e llogarise dhe rrjedhat me kod per email/verifikim dhe reset te fjalekalimit. Ruajti qasjen guest, shtoi paralajmerimin para hyrjes ne nje llogari tjeter dhe pastroi UI-ne private kur ndryshon pronari. Vendosi templates ne Supabase dhe zbuloi gabimin SMTP 535; pronari krijoi dhe ruajti SMTP key pa e vendosur ne aplikacion apo Git.

## Verifikimi

| Kufiri | Rezultati dhe deshmia |
| --- | --- |
| Lista > API > databaza | SELECT me publishable key kthen gjashte mesime; ne shfletues shfaqet Live library dhe filtri kthen tri tema Calculus. |
| Detaji > databaza | Amplitude hapet me formulen y = A sin(x) nga lessons. |
| Formulari > INSERT > rilexim | Ne shfletues u ruajt nje shenim me Save note dhe u shfaq ne listen personale. |
| Rihapja > sesioni > shenimi | Shenimi mbeti pas reload-it te plote ne shfletues. Ekipi konfirmoi te njejten sjellje pas mbylljes/rihapjes ne telefon. |
| Privatësia | Testi me dy llogari guest refuzoi leximin e shenimit te tjetrit dhe INSERT me user_id te tjetrit. Leximi pa autentikim i study_notes refuzohet. |
| Validimi ne databaze | Refuzohen tekst bosh, mbi 1000 karaktere dhe lesson_id qe nuk ekziston. Ndryshimi i lessons nga perdoruesi refuzohet. |
| Guest > email > llogari | Ekipi raportoi ne telefon se kodi erdhi, regjistrimi perfundoi dhe shenimi i vjeter guest mbeti. |
| Hyrja dhe rikthimi i fjalekalimit | Ekipi raportoi ne telefon se dalja/hyrja, kodi i reset-it dhe hyrja me fjalekalimin e ri punojne; shenimi mbetet. Agjenti nuk pa kodet apo fjalekalimet. |
| Kodi | npm run lint dhe npx tsc --noEmit kaluan. expo install --check nuk gjeti versione te papershtatshme ne harten lokale te SDK 58. Ne fund te proves se shfletuesit nuk kishte gabime ne console. |

## Email me Brevo

Jane ndertuar ekranet per krijimin e llogarise nga nje guest, verifikimin me kod, hyrjen/daljen dhe rikthimin e fjalekalimit. Biblioteka dhe shenimet guest mbeten te hapura. Brevo SMTP dhe dy templates me kod jane vendosur ne Supabase. Ekipi konfirmoi ne telefon se email-i erdhi, regjistrimi perfundoi dhe shenimi i vjeter guest mbeti ne llogari.

Prova e pare deshtoi me 535 Authentication failed ne Auth Logs. Pas krijimit te nje SMTP key ne Brevo dhe ruajtjes vetem ne panelin e Supabase, prova e regjistrimit kaloi sipas konfirmimit te ekipit. Ekipi provoi edhe daljen/hyrjen dhe resetimin me kod, pastaj hyrjen me fjalekalimin e ri: punojne dhe shenimi mbetet. Agjenti nuk pa fjalekalimet apo kodet e email-it. Pas ndryshimeve, ruajtja e nje shenimi guest ne shfletues kaloi perseri. Shih ACCOUNTS.md per rrjedhen dhe kufijte.

## Hapi tjeter

Te rikuperohet sherbimi Supabase nga statusi Unhealthy dhe te riprovohet API-ja. Pastaj te provohen dy llogari ne dy telefona, te merret screenshot-i real me shenimin e ruajtur dhe te dorezohet me linkun e repository-t per J6. J5 dhe J6 kerkojne check-off me prezence ne klase. Studio me mikrofon/anim mbetet hap i ardhshem i produktit.
