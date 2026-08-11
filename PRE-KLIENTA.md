# Čo potrebujem od teba, aby sme mohli spustiť e-shop

Ahoj! Toto je vysvetlenie „po ľudsky“ — bez technických skratiek. Web je hotový a
funguje. Chýbajú už len **prístupy k službám** (platby, databáza, e-maily) a
**firemné údaje**, ktoré ti podľa zákona musia byť na stránke.

Nemusíš rozumieť tomu, ako to funguje vnútri. Stačí, keď mi pošleš údaje nižšie.

---

## Najprv odpoveď na tvoju otázku: mám si to vytvoriť sám, alebo to spravíš ty?

**Rozdelíme si to takto:**

| Služba | Kto to musí vytvoriť | Prečo |
|---|---|---|
| **Stripe** (platby kartou) | **Ty (majiteľ firmy)** — nedá sa inak | Overuje totožnosť majiteľa, firemné údaje a bankový účet. Peniaze od zákazníkov chodia na **firemný účet**. Nikto to za teba spraviť nemôže a ani by nemal. |
| **Supabase** (databáza) | Ty založíš, ja nastavím | Účet má byť na teba, aby si oň nikdy neprišiel. Ja len potrebujem prístupové kľúče. |
| **Resend** (e-maily) | Ty založíš, ja nastavím | To isté. |

**Dôležité:** účty majú byť **na tvoje meno / firmu**, nie na moje. Keby boli na
mňa, tak o web a peniaze prídeš vo chvíli, keď spolu prestaneme spolupracovať. Ja
ti s vytvorením pokojne pomôžem cez obrazovku, ale vlastník musíš byť ty.

Ak chceš, prejdeme to spolu naraz — trvá to asi hodinu.

---

## 1. ⚠️ NAJDÔLEŽITEJŠIE: Ste platiteľ DPH?

Toto je jediná vec, ktorú potrebujem vedieť **skôr, než pustíme prvú objednávku**.
Môže to stáť peniaze, ak sa to spraví zle.

**Nezamieňaj si tieto tri veci** — sú to tri rôzne čísla:

| Skratka | Čo to je | Má to každá firma? |
|---|---|---|
| **IČO** | 8-miestne číslo firmy (identifikácia) | Áno |
| **DIČ** | 10-miestne daňové číslo (daň z príjmu) | Áno |
| **IČ DPH** | Číslo platiteľa DPH, tvar `SK` + 10 číslic | **NIE — len ak si sa registroval na DPH** |

👉 **To, že máš DIČ, neznamená, že si platiteľ DPH.** Sú to dve rôzne veci.

**Prečo je to dôležité:** zákon o DPH, §69 ods. 5 hovorí, že *„každá osoba, ktorá
uvedie vo faktúre alebo v inom doklade o predaji daň, je povinná zaplatiť túto
daň“*. Po slovensky: **ak na faktúru napíšeš DPH, aj keď nie si platiteľ, musíš tú
DPH naozaj odviesť štátu** — a nemôžeš si nič odpočítať. Sú to vyhodené peniaze.

**Čo s tým:**
1. Over si to zadarmo tu:
   [financnasprava.sk – overenie IČ DPH](https://www.financnasprava.sk/sk/elektronicke-sluzby/verejne-sluzby/overovanie-ic-dph)
2. Opýtaj sa účtovníčky/účtovníka: *„Sme platiteľ DPH?“*
3. Napíš mi **áno / nie**.

Zatiaľ som web nastavil na **bezpečnú možnosť: DPH sa nikde nezobrazuje.** Ceny sú
konečné, čo je pre neplatiteľa DPH správne. Keď mi potvrdíš, že platiteľ ste,
prepnem to jedným nastavením (ceny sa **nezmenia**, len pribudne riadok „z toho DPH“).

---

## 2. Firemné údaje (na pätičku webu a faktúry)

Zo zákona musí e-shop zverejniť, kto ho prevádzkuje. Pošli mi presne:

- **Obchodné meno firmy** (presne ako v obchodnom/živnostenskom registri)
- **IČO**
- **DIČ**
- **IČ DPH** — ak ste platiteľ DPH (ak nie, napíš „nie sme platiteľ“)
- **Sídlo** — ulica, číslo, PSČ, mesto
- **Zápis v registri** — napr. „Okresný súd …, oddiel Sro, vložka č. …“
  (alebo číslo živnostenského registra, ak si živnostník)

📌 **Adresu prevádzky mám** z tvojho Google profilu: *Zámocká 65/1, 901 01 Malacky* —
tú som už na web doplnil. Ale **sídlo firmy v registri môže byť iná adresa** a do
pätičky patrí to sídlo. Preto ho potrebujem od teba.

📌 Aj **telefón (+421 944 771 325)** a **e-mail (agamaprint3d@gmail.com)** už na webe sú.

---

## 3. Stripe — platby kartou

**Čo to je:** služba, cez ktorú ti zákazníci zaplatia kartou (aj Apple Pay).
Peniaze idú na tvoj firemný účet, zvyčajne s pár dňovým oneskorením.

**Čo treba:** založiť účet na [stripe.com](https://stripe.com) — musíš ty, lebo si
overujú totožnosť.

**Priprav si:**
- doklad totožnosti (OP / pas)
- firemné údaje (IČO, DIČ, sídlo)
- **IBAN firemného účtu** (nie súkromného!)

**Čo mi potom pošli** (nájdeš v Stripe → Developers → API keys):
- `Publishable key` — začína `pk_...`
- `Secret key` — začína `sk_...` ⚠️ **toto je heslo, pošli mi to bezpečne, nie
  cez Messenger/Discord** (ideálne cez správu, ktorú potom zmažeš)

Ešte v Stripe zapneme **Stripe Tax** (počíta dane) a pridám tzv. *webhook* — to už
spravím ja, len k tomu potrebujem prístup.

---

## 4. Supabase — databáza a prihlasovanie

**Čo to je:** miesto, kde sa ukladajú objednávky, zákaznícke účty a nahraté 3D
modely. Bez toho si zákazník nevie vytvoriť účet ani pozrieť svoje objednávky.

**Čo treba:** založiť projekt na [supabase.com](https://supabase.com) — **zadarmo**.
Pri zakladaní vyber región **v EÚ** (napr. Frankfurt) kvôli GDPR.

**Čo mi pošli** (Project Settings → API):
- `Project URL`
- `anon` / `publishable` key — tento je verejný, nevadí
- `service_role` / `secret` key — ⚠️ **toto je heslo, pošli bezpečne**

A ešte vytvor úložisko na súbory: **Storage → New bucket → názov `custom-models`**
(sem sa budú ukladať 3D modely od zákazníkov). Ak si netrúfaš, spravím to ja.

---

## 5. Resend — automatické e-maily

**Čo to je:** posiela zákazníkovi potvrdenie objednávky. Bez toho zákazník po
zaplatení nedostane žiaden e-mail.

**Čo treba:** účet na [resend.com](https://resend.com) — zadarmo do 3 000 e-mailov
mesačne (max. 100 denne).

⚠️ **Dôležité a asi nečakané:** **nedá sa posielať z `agamaprint3d@gmail.com`.**
Žiadna takáto služba to neumožní (nie je to obmedzenie Resendu — Gmail to blokuje).

Potrebuješ **vlastnú doménu**, napr. `agamaprint3d.sk` (stojí cca **10–20 € / rok**).
Potom sa e-maily posielajú napr. z `objednavky@agamaprint3d.sk` a **odpovede si
nastavíme tak, aby ti chodili do bežného Gmailu** — takže nič nestrácaš.

Doménu aj tak budeš potrebovať pre samotný web, takže to nie je zbytočný výdavok.

**Čo mi pošli:** `API key` (začína `re_...`) ⚠️ **bezpečne**.

---

## 6. Doprava — ceny a dopravcovia

Momentálne mám na webe **dočasné ceny** (Packeta 2,99 € / Slovenská pošta 3,90 € /
kuriér 4,90 € / osobný odber zadarmo, nad 60 € doprava zadarmo). **Sú vymyslené ako
odhad — treba ich nahradiť tvojimi skutočnými.**

Ceny, ktoré vidíš na weboch dopravcov, sú **orientačné pre občasné zásielky**.
E-shopy dostávajú zmluvné (nižšie) ceny podľa objemu. Takže:

| Dopravca | Ako sa zaregistrovať |
|---|---|
| **Packeta / Zásielkovňa** | Jediný, kde sa dá zaregistrovať sám online: [client.packeta.com](https://client.packeta.com) — zadarmo, schvaľujú do ~3 prac. dní. Budú chcieť IČO, DIČ, IČ DPH (ak máš), IBAN. |
| **Slovenská pošta** | Ceny pre e-shopy nezverejňujú — treba zavolať a dohodnúť sa: [posta.sk – e-shop riešenia](https://www.posta.sk/biznis-riesenia/e-shop-riesenia) |
| **GLS / DPD / SPS** | Nemajú samoobslužnú registráciu — vypíš formulár a ozve sa obchodník s ponukou. |

**Čo mi pošli:** ktorých dopravcov chceš ponúkať + **koľko chceš účtovať zákazníkovi
za každého** (nemusí to byť presne tvoja nákupná cena) + od akej sumy má byť doprava
zadarmo.

⚠️ Pozor na príplatky — Packeta má napr. palivový príplatok, ktorý sa mení. Preto si
cenu radšej over priamo u nich, nie z článkov na internete.

---

## 7. Ešte niečo, čo sa oplatí vedieť (opýtaj sa účtovníka)

Nie sú to veci, ktoré potrebujem ja — ale ušetria ti problémy:

- **eKasa:** ak budeš pri osobnom odbere brať **hotovosť**, pravdepodobne
  potrebuješ registračnú pokladňu (eKasa). Pri platbe kartou/prevodom to neplatí.
- **§7a DPH:** ak si neplatiteľ a kúpiš si reklamu na Google/Meta (fakturujú z
  Írska), vzniká ti registračná povinnosť **bez ohľadu na obrat** — a to *pred*
  objednaním reklamy.
- **Obaly:** e-shop, ktorý posiela tovar v obaloch, sa musí registrovať ako
  „výrobca obalov“ a mať zmluvu s OZV.
- **Ochrana osobných údajov:** budeme potrebovať cookie lištu a v zásadách ochrany
  údajov vymenovať služby (Stripe, Supabase, Resend, dopravca).

---

## Zhrnutie — čo mi poslať

- [ ] **Sme platiteľ DPH? áno / nie** ← najdôležitejšie
- [ ] Obchodné meno, IČO, DIČ, IČ DPH (ak je), sídlo, zápis v registri
- [ ] Stripe: `pk_...` a `sk_...`
- [ ] Supabase: URL, `anon` key, `service_role` key
- [ ] Resend: `re_...` + či chceš doménu (napr. `agamaprint3d.sk`)
- [ ] Doprava: ktorí dopravcovia + ceny pre zákazníka + limit na dopravu zadarmo
- [ ] Otváracie hodiny (na webe mám teraz Po–Pia 9:00–17:00, na Google máš do 16:00
      — ktoré platia?)

⚠️ **Heslá a tajné kľúče (`sk_...`, `service_role`, `re_...`) mi neposielaj cez
verejný chat.** Pošli ich samostatne a potom správu zmaž.

Ak čomukoľvek nerozumieš, napíš — prejdeme to spolu. 👍
