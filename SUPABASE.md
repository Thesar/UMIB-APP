# Supabase - lidhja dhe prova

## Projekti

Screamulus, plani Free, rajoni Europe (Paris). Konfigurimi lokal eshte ne .env.local dhe nuk ruhet ne Git.

## Nisja ne nje kompjuter tjeter

1. Ekzekuto `npm ci`.
2. Kopjo .env.example si .env.local. Nga projekti Supabase, kopjo vetem Project URL dhe Publishable key ne dy fushat perkatese. Keto jane vlera publike te aplikacionit. Mos perdor database password, secret key, service_role ose personal access token.
3. Per nje databaze te re, ekzekuto fajllat ne supabase/migrations sipas renditjes se emrit. Ne projektin ekzistues jane aplikuar; mos i ekzekuto perseri mbi te.
4. Ne Supabase > Authentication > Sign In / Providers, aktivizo Allow anonymous sign-ins. Per llogarite me email duhen edhe Allow manual linking dhe Confirm email; konfigurimi dhe templates pershkruhen ne ACCOUNTS.md. Keto opsione jane aktivizuar ne projektin e ekipit me miratimin e tij.
5. Ekzekuto `npx expo start --clear` dhe hape me Expo Go SDK 58. Ne PowerShell mund te perdoret `npx.cmd`.

## Si rrjedhin te dhenat

- Lista therrret listLessons: nje SELECT ne tabelen lessons, sipas sort_order. Detaji lexon vetem mesimin me id-ne e routes. Nuk ka liste lokale qe fsheh nje deshtim te databazes.
- Kur hapet nje mesim, Supabase Auth rikthen sesionin ekzistues ose krijon nje llogari guest. Sesioni ruhet ne AsyncStorage ne telefon dhe ne storage-in e shfletuesit ne web. Ne telefon rifreskohet kur aplikacioni eshte aktiv.
- Save note pastron hapesirat ne fillim/fund, kontrollon gjatesine 1-1000 dhe ben INSERT ne study_notes me lesson_id dhe user_id. Suksesi shfaqet vetem pas pergjigjes se databazes. Pastaj lista e shenimeve lexohet perseri.
- Tabela lessons lejon vetem SELECT nga aplikacioni. study_notes lejon vetem SELECT dhe INSERT nga nje perdorues i autentikuar, me kushtin auth.uid() = user_id. Edhe llogarite guest marrin rolin authenticated. Filtri ne aplikacion nuk e zevendeson RLS-ne.
- Shenimet jane private per pronarin. Pa email, pastrimi i te dhenave te aplikacionit humb qasjen ne guest-in e asaj pajisjeje. Create account lidh email te verifikuar me te njejtin user ID dhe pastaj vendos fjalekalimin. Sign in ne nje llogari ekzistuese hap shenimet e asaj llogarie; aplikacioni paralajmeron para zevendesimit te nje guest-i me shenime. Shih ACCOUNTS.md dhe statusin e proves reale ne PROGRES.md.

## Prova ne telefon dhe screenshot-i

1. Hap listen: duhet te shfaqet numri i mesimeve dhe Live library.
2. Hap Amplitude dhe shiko formulen y = A sin(x).
3. Te My study notes shkruaj nje mendim tendin, p.sh. cfare ndryshon koeficienti A, dhe prek Save note.
4. Prit konfirmimin Saved online dhe shenimin ne listen poshte.
5. Mbylle/rihape aplikacionin dhe hape te njejtin mesim: shenimi duhet te mbetet. Mund te perdoret edhe Refresh notes.
6. Merr nje screenshot real nga telefoni ku shihet shenimi i ruajtur. Mos perfshi celesa, terminalin ose panelin e Supabase ne vend te aplikacionit.

## Kontrollet e kodit

```sh
npm run lint
npx tsc --noEmit
npx expo install --check
```

## Email me Brevo

Brevo SMTP eshte konfiguruar ne Supabase per verifikimin e email-it dhe rikthimin e fjalekalimit. Llogarite guest nuk kerkojne email. Statusi i provave reale shenohet ne PROGRES.md.

Supabase Auth dergon kodet permes Brevo-s. Ne Brevo duhet te verifikohet derguesi dhe, kur eshte e mundur, te autentikohet domain-i. Te Supabase > Authentication > Emails > SMTP Settings vendosen:

- Sender email: adresa e verifikuar ne Brevo; sender name: Screamulus.
- Host: smtp-relay.brevo.com; port: 587 (STARTTLS).
- Username: vlera Login nga faqja SMTP e Brevo-s.
- Password: SMTP key nga Brevo, jo API key apo fjalekalimi i llogarise.

SMTP key futet vetem ne panelin e Supabase nga pronari i llogarise. Nuk vendoset ne Expo, .env.example ose Git. Per email te tjera te aplikacionit, nje Edge Function mund te therrase Brevo me celesin e ruajtur vetem ne server.

Shih [udhezimin zyrtar Brevo/Supabase](https://developers.brevo.com/docs/supabase-smtp-integration) dhe [fushen SMTP Login](https://help.brevo.com/hc/en-us/articles/7924908994450-Send-transactional-emails-using-Brevo-SMTP).

## Burimet zyrtare

- [Expo SDK 58](https://docs.expo.dev/versions/v58.0.0/)
- [Supabase ne React Native](https://supabase.com/docs/guides/auth/quickstarts/react-native)
- [Anonymous sign-ins](https://supabase.com/docs/guides/auth/auth-anonymous)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
