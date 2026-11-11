# J6 - prova me dy llogari

Data: 11.11.2026. Repository: https://github.com/Thesar/UMIB-APP

## Cfare duhet treguar ne klase

Kriteri i profesorit kerkon dy llogari ne dy telefona, secila sheh vetem te vetat, pa policy zhvillimi. Check-off-i behet me prezence dhe pa AI. Dorëzimi ne Hub dhe provat automatike jane deshmi pergatitjeje; nuk e zevendesojne vleresimin ne klase.

1. Nis aplikacionin me `npx.cmd expo start` dhe hape ne dy telefona. Te dy telefonat duhet te mund ta arrijne serverin; ne nje rrjet te perbashket skano te njejtin QR me Expo Go.
2. Ne telefonin A hyr me llogarine A. Ne telefonin B perdor nje llogari tjeter B. Mos perdor te njejtin email ne te dy telefonat per kete prove.
3. Te Amplitude, A ruan nje shenim te dallueshem, p.sh. "Nga telefoni A: koeficienti A ndryshon lartesine e vales." B ruan nje shenim tjeter.
4. Prek Refresh notes ne secilin telefon. A duhet te shohe vetem shenimet e A-se dhe B vetem te B-se. Rihape mesimin per te kontrolluar qe shenimet mbeten.
5. Ne Supabase > Table Editor > study_notes, gjej rreshtat e krijuar nga telefonat. user_id duhet te jete i ndryshem per A dhe B. Paneli administrativ mund t'i shohe te dy; aplikacioni perdor publishable key dhe RLS.
6. Ne Database > Policies > study_notes trego RLS aktiv dhe vetem dy policy: Students read their own notes (SELECT) dhe Students add their own notes (INSERT). Te dyja kerkojne auth.uid() = user_id. Nuk duhet nje policy e pergjithshme me USING (true) ose WITH CHECK (true) mbi shenimet private.

Mund ta pergatitesh vetem nese ke dy telefona dhe dy llogari. Nderrimi i llogarive ne nje telefon ndihmon per prove paraprake, por nuk eshte kriteri i shkruar "dy telefona". Secili anetar dorezon vete dhe duhet ta shpjegoje punen ne klase.

## Cfare duhet te shpjegosh

| Kolona | Kuptimi |
| --- | --- |
| id | Identifikuesi unik i shenimit. |
| user_id | Pronari i shenimit, i lidhur me llogarine e Supabase Auth. RLS e krahason me ID-ne e sesionit. |
| lesson_id | Mesimi ku u shkrua shenimi; s2 eshte Amplitude. |
| body | Teksti i shenimit, nga 1 deri ne 1000 karaktere pas pastrimit te hapesirave. |
| created_at | Koha kur databaza e krijoi rreshtin. |

`.select()` lexon shenimet dhe `.insert()` ruan nje te ri, ne src/data/study-notes.ts. Filtri user_id ne aplikacion ndihmon kerkesen; kufizimi i sigurise eshte RLS ne databaze. Llogarite guest kane gjithashtu ID te vecanta dhe rolin authenticated.

Policy publike e lessons lejon vetem leximin e mesimeve te perbashketa. Ajo nuk jep qasje te shenimet personale dhe nuk eshte policy zhvillimi per study_notes.

## Screenshot dhe dorezim

Merr nje screenshot real nga telefoni yt pas Refresh notes: te shihet Amplitude dhe shenimi yt i ruajtur. Tastiera te jete e mbyllur. Ky eshte screenshot-i per Hub; izolimi mes dy telefonave tregohet ne klase. Mos perdor screenshot nga shfletuesi, terminali ose paneli ne vend te telefonit.

Tekst per Hub, pa pretenduar check-off te perfunduar:

> Repository i ekipit: https://github.com/Thesar/UMIB-APP. Screamulus ruan shenime personale ne Supabase me llogari dhe RLS sipas perdoruesit. Bashkengjitur eshte screenshot-i nga telefoni. PROGRES.md pershkruan punen dhe provat e kryera.

Per J5, krijo nje shenim te ri nga telefoni yt para profesorit, trego rreshtin ne study_notes dhe shpjego nje kolone. Profesori e percakton check-off-in; dorezimi i J5 eshte i mbyllur sipas Hub-it.

## Verifikim nga kompjuteri

```powershell
npx.cmd tsc --noEmit
npm.cmd run lint
node --env-file=.env.local scripts/verify-note-privacy.mjs --live
```

Komanda e fundit krijon dy guest-e te vecante dhe nga nje shenim te shenuar [J6 API check]. Lexon pa filtrin user_id per te provuar RLS-ne, provon kerkesa per rreshtin e tjetrit dhe INSERT me pronar te falsifikuar. Fixtures mbeten vetem te ato llogari testuese. Nuk perdoret service-role key dhe nuk ruhen kredenciale ne Git. Kjo prove nuk eshte prove ne dy telefona.

Ne nje checkout te ri, src/types/expo.d.ts ngarkon deklarimet zyrtare te CSS-se. Nuk duhet nisur Expo vetem qe kontrolli tsc t'i gjeje ato. expo-env.d.ts dhe .expo mbeten fajlla lokale te gjeneruar.
