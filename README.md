# Open Sunnah

A free, open hadith reader. Ten collections, nine languages, and **every grading shown with the scholar who gave it**.

**opensunnah.org** · sibling of [Open Muṣḥaf](https://openmushaf.org)

---

## Why this exists

Most hadith sites either hide the grading or flatten it into one word. Neither is honest. A hadith is not simply "authentic" — Al-Albani, Zubair Ali Zai, Muhammad Muhyi al-Din and others frequently disagree, and which scholar said what is the substance of the matter.

Here every grading appears with its scholar's name attached, verbatim, in both the reading view and the citation. Quoting a **ḍaʿīf** narration as though it were **ṣaḥīḥ** is the most common sourcing error there is, and this site is built so you cannot do it by accident.

## What it does

| | On screen | For |
|---|---|---|
| **Section** | a whole book of hadith, Arabic beside translation | reading through |
| **Hadith** | one narration, every grading, full citation | study and quoting |

- **Ten collections** — Bukhārī, Muslim, Abū Dāwūd, Tirmidhī, Nasāʾī, Ibn Mājah, Muwaṭṭaʾ Mālik, Nawawī's Forty, Forty Ḥadīth Qudsī, Dehlawī's Forty
- **The wheel** — collections by size on the outside, sections of the current collection inside them, and at the centre the **grading distribution of the section you are reading**. Nobody else visualises that.
- **Citation** — Short, Full, Block and Markdown, and the grading travels with every one of them
- **Nine interface languages**, right-to-left where it belongs

## Grade colours

Colours are a **display aid only**. The exact wording and the scholar's name are always shown verbatim beside them.

| | |
|---|---|
| green | ṣaḥīḥ |
| blue | ḥasan |
| red | ḍaʿīf, munkar, mawḍūʿ and the other weak categories |
| plain | anything the bucketer cannot classify — shown as written |

Grade strings are free text and vary by scholar; `Sahih Bukhari (1224) Sahih Muslim (570)` is a cross-reference, not a simple verdict. When in doubt the site shows you the string and lets you judge.

## Privacy

No server, no account, no analytics, no cookies. The Content-Security-Policy in `_headers` permits exactly three hosts and nothing else — open devtools and check.

## Honest limits

- **Hadith text exists in nine languages**, not the twenty-six of Open Muṣḥaf. The interface offers only those nine, because a UI language with no content behind it is a false promise.
- **A collection loads once, then works offline.** Bukhārī and Muslim are large files; the Forty collections are instant.
- **Eight of nine interface translations have not been reviewed by a native speaker.** The UI says so, in that language.
- **Grade bucketing is approximate.** See above.

## Sources

Text, translations and gradings from [fawazahmed0/hadith-api](https://github.com/fawazahmed0/hadith-api) via jsDelivr. Nothing here is machine-translated — every translation is a published work.

## Licence

Code: MIT, © Al Arabi — see [LICENSE](LICENSE).

Hadith text, translations and gradings are **not** covered by that licence. They belong to their sources, translators and the scholars who issued the gradings.

## Support

Open Sunnah costs about $37 a year to run — domain, hosting and technical support. The code is open.

[Support development](https://ko-fi.com/openmushaf)
