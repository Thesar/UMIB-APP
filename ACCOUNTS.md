# Llogarite dhe qasja si guest

## Rrjedhat

- Pa llogari: lista dhe detajet jane te hapura. Kur hapen shenimet krijohet nje sesion guest; studenti mund ta provoje ruajtjen pa dhene email.
- Create account: studenti shton email ne te njejten llogari guest, verifikon kodin e derguar dhe pastaj vendos fjalekalimin. ID-ja e pronarit nuk ndryshon, prandaj shenimet guest ruhen.
- Sign in: email dhe fjalekalim per nje llogari ekzistuese. Shenimet e asaj llogarie lexohen nga databaza.
- Forgot password: studenti kerkon nje kod me email, e verifikon ne aplikacion dhe vendos nje fjalekalim te ri.
- Sign out: mbyllet sesioni vetem ne kete pajisje. Biblioteka mbetet e hapur dhe mund te provohet perseri si guest.

Kur nje guest me shenime zgjedh hyrjen ne nje llogari tjeter ekzistuese, aplikacioni kerkon zgjedhje te qarte: krijo nje llogari te re per t'i mbajtur shenimet, ose vazhdo te llogaria ekzistuese. Nuk pretendon se i bashkon automatikisht dy llogarite. Per te mbajtur shenimet e telefonit, krijo llogarine nga ai telefon.

## Email me Brevo

Supabase Auth dergon email permes Brevo SMTP. Kredencialet SMTP jane vetem ne panelin e Supabase. Aplikacioni perdor vetem URL-ne publike dhe publishable key te projektit.

Ne Supabase duhet te jene aktive Allow new users to sign up, Allow anonymous sign-ins, Allow manual linking dhe Confirm email. Guest-to-account lidhja u miratua nga ekipi. Email duhet verifikuar para se te lejohet vendosja e fjalekalimit.

Fajllat e templates jane ne supabase/templates:

- email_change.html perdoret te Authentication > Emails > Change email address, sepse regjistrimi lidh email me nje llogari guest ekzistuese.
- recovery.html perdoret te Reset password.

Te dy templates perdorin {{ .Token }}. Studenti e fut kodin brenda aplikacionit; kjo funksionon edhe ne Expo Go pa hapur nje link qe ridrejton ne nje server lokal. Fajllat ne repo nuk publikohen automatikisht: ne projektin e ekipit aplikohen ne panelin e Supabase.

## Qasja te shenimet

RLS vazhdon te kerkoje auth.uid() = user_id per cdo lexim ose shtim. Metadata screamulus_setup eshte vetem per te rikthyer ekranin e vendosjes se fjalekalimit nese aplikacioni mbyllet ne mes te regjistrimit; nuk jep leje mbi te dhenat.

AuthProvider ndjek sesionin aktual. Kur ndryshon pronari, formulari i shenimeve rindertohet dhe nuk mban tekst apo shenime te llogarise se meparshme. Kerkesat e shenimeve kontrollojne edhe ID-ne e pronarit qe i nisi. Krijimi i guest-it dhe veprimet e hyrjes/daljes kryhen me radhe qe nje kerkese e vjeter guest te mos zevendesoje nje hyrje te re.

## Prova

1. Si guest, hap Amplitude dhe ruaj nje shenim. Rihape temen dhe kontrollo qe mbetet.
2. Nga i njejti telefon, hap Create account, verifiko kodin nga email dhe vendos fjalekalimin. Kontrollo shenimin e vjeter.
3. Dil nga llogaria. Hyr perseri me email/fjalekalim dhe kontrollo shenimin.
4. Provo Forgot password, kodin e email-it dhe nje fjalekalim te ri. Hyr me fjalekalimin e ri.
5. Provo nje guest te ri: nuk duhet te shfaqe shenimet e llogarise se meparshme.

Konfirmimet e provave reale shenohen ne PROGRES.md. Mos vendos kode verifikimi, fjalekalime ose SMTP keys ne Git, screenshot-e ose chat.

## Burime

- [Supabase: lidhja e nje email-i me guest-in](https://supabase.com/docs/guides/auth/auth-anonymous)
- [Supabase: email templates dhe OTP](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Brevo SMTP per Supabase](https://developers.brevo.com/docs/supabase-smtp-integration)
