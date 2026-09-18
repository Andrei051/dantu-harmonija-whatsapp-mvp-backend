import zipfile
from pathlib import Path
from xml.sax.saxutils import escape

out = Path(r"C:\Users\semio\DH\DH-WhatsApp-Clinic-Review-LT-v1.xlsx")

rows = []


def add(section, item, current, kind="text"):
    rows.append((section, item, current, kind))


add("1. Veikimo principas", "Atsakyti į bendrus klausimus apie kliniką", "Asistentas gali", "text")
add("1. Veikimo principas", "Pateikti informaciją apie klinikos paslaugas", "Asistentas gali", "text")
add("1. Veikimo principas", "Pateikti patvirtintas / paskelbtas kainas", "Asistentas gali", "text")
add("1. Veikimo principas", "Pateikti adresą, darbo laiką ir kontaktus", "Asistentas gali", "text")
add("1. Veikimo principas", "Paaiškinti pagrindinę informaciją apie pirmą vizitą", "Asistentas gali", "text")
add("1. Veikimo principas", "Atsakyti lietuvių arba anglų kalba", "Asistentas gali", "text")
add("1. Veikimo principas", "Diagnozuoti ar vertinti paciento sveikatos būklės", "Asistentas negali", "text")
add("1. Veikimo principas", "Teikti medicininių ar gydymo rekomendacijų", "Asistentas negali", "text")
add("1. Veikimo principas", "Parinkti ar rekomenduoti gydymo", "Asistentas negali", "text")
add("1. Veikimo principas", "Registruoti, keisti ar atšaukti vizitų", "Asistentas negali", "text")
add("1. Veikimo principas", "Matyti ar nurodyti laisvų vizito laikų", "Asistentas negali", "text")
add("1. Veikimo principas", "Pateikti informacijos, kurios klinika nėra patvirtinusi", "Asistentas negali", "text")

add(
    "2. Kai reikalingas darbuotojas",
    "Registracija / laisvi laikai",
    "Asistentas nukreipia į kliniką (tel., el. paštas, svetainė) — nesako, kad žinutę jau peržiūrėjo darbuotojas",
    "text",
)
add(
    "2. Kai reikalingas darbuotojas",
    "Galima žinutė pacientui (tik jei stebima WhatsApp)",
    "„Ačiū už žinutę. Komandos narys peržiūrės pranešimą ir atsakys artimiausiu metu.“",
    "text",
)
add(
    "2. Kai reikalingas darbuotojas",
    "Ar klinikoje kas nors reguliariai peržiūrės šiuo numeriu gautas WhatsApp žinutes ir galės į jas atsakyti?",
    "Pasirinkite dešinėje: Taip = galime informuoti, kad žinutę peržiūrės darbuotojas; Ne = asistentas tik pateikia kontaktus",
    "taip_ne",
)

add("3. Klinikos informacija", "Klinika", "Dantų Harmonija", "text")
add("3. Klinikos informacija", "Adresas", "Olimpiečių g. 1A-24, LT-09235 Vilnius", "text")
add(
    "3. Klinikos informacija",
    "Darbo laikas",
    "Darbo dienomis 08:00–20:00; šeštadieniais 09:00–14:00 tik su išankstine registracija; sekmadieniais nedirbama",
    "text",
)
add("3. Klinikos informacija", "Telefonai", "+370 610 11 222 / (8-5) 27 222 11", "text")
add("3. Klinikos informacija", "El. paštas", "klinika@dantuharmonija.lt", "text")
add("3. Klinikos informacija", "Svetainė", "dantuharmonija.lt", "text")

services = [
    "Profesionali burnos higiena",
    "Dantų implantacija",
    "Ortodontinis gydymas",
    "Dantų balinimas",
    "Fizioterapija / žandikaulio terapija",
    "Vaikų odontologija",
    "Konsultacijos ir diagnostika",
    "Dantų plombavimas",
    "Dantų šaknų kanalų gydymas",
    "Dantų šalinimas",
    "Dantų laminatės",
    "Periodontologinis gydymas",
    "Dantų protezavimas",
    "Anestezija",
    "Dantų technikos laboratorija",
]
for name in services:
    add("4. Paslaugos", name, "Įtraukta į asistento sąrašą", "text")

prices = [
    ("Profesionali burnos higiena", "80–100 EUR"),
    ("Dantų implantacija", "nuo 860 EUR"),
    (
        "Ortodontinis gydymas",
        "Konsultacija: 50–80 EUR; metaliniai breketai: nuo 750 EUR / žandikaulį; kapos (aligneriai): apie 4000–5000 EUR",
    ),
    ("Dantų balinimas", "Kapomis: 200 EUR; Zoom: 299 EUR; po procedūros kapomis: 100 EUR"),
    (
        "Fizioterapija / žandikaulio terapija",
        "Konsultacija: 75 EUR; TMJ gydymas: 65 EUR; miofunkcinė terapija: 55 EUR",
    ),
    (
        "Vaikų odontologija",
        "Konsultacija: 40–50 EUR; gydymas priklauso nuo procedūros (pvz. plombavimas 60–120 EUR)",
    ),
    (
        "Konsultacijos ir diagnostika",
        "Konsultacija: 50 EUR; rentgenas: 10 EUR; panoraminis: 30 EUR; KT: 100 EUR",
    ),
    (
        "Dantų plombavimas",
        "Dažniausiai 60–150 EUR už paviršių; estetinis priekinis: apie 50–120 EUR",
    ),
    (
        "Dantų šaknų kanalų gydymas",
        "nuo 150 EUR iki 400 EUR (priklauso nuo danties ir sudėtingumo)",
    ),
    ("Dantų šalinimas", "Paprastas: nuo 50 EUR; chirurginis: nuo 150 EUR"),
    ("Dantų laminatės", "nuo 300 EUR už dantį"),
    ("Periodontologinis gydymas", "Skalinimas / higiena: nuo 80 EUR; toliau — pagal dantenų būklę"),
    ("Dantų protezavimas", "Vainikelis: nuo 350 EUR; tiltas: nuo 600 EUR; protezas: nuo 900 EUR"),
    ("Anestezija", "Vietinė: 10–15 EUR; bendroji narkozė: 150–550 EUR"),
    ("Dantų technikos laboratorija", "Atskiros kainos asistentas neturi"),
]
for name, price in prices:
    add("5. Kainos", name, price, "text")

add(
    "5. Kainos",
    "Pastaba prie kainų",
    "„Pateikiamos kainos yra orientacinės. Tikslią kainą gydytojas pasako po individualios konsultacijos.“",
    "text",
)

add(
    "6. Pirmas vizitas",
    "Prieš pirmą vizitą",
    "Atvykti 10–15 min. anksčiau, turėti asmens dokumentą ir, jei reikia, iš anksto pasiruošti klausimus.",
    "text",
)
add(
    "6. Pirmas vizitas",
    "Vizito metu",
    "Registratūroje užpildoma anketa ir pasirašoma sutartis; gydytojas atlieka apžiūrą; jei reikia, skiriama diagnostika; gydymo variantai ir kainos aptariami po įvertinimo. Galutinis gydymo planas ir kaina priklauso nuo individualios konsultacijos.",
    "text",
)


def col_letter(n: int) -> str:
    return chr(ord("A") + n - 1)


def cell_ref(r: int, c: int) -> str:
    return f"{col_letter(c)}{r}"


header_row = 10
first_data = 11
taip_ne_rows = [first_data + i for i, r in enumerate(rows) if r[3] == "taip_ne"]

ssi: dict[str, int] = {}
slist: list[str] = []


def s(text: str) -> int:
    if text not in ssi:
        ssi[text] = len(slist)
        slist.append(text)
    return ssi[text]


def t_cell(r: int, c: int, text: str, style=None) -> str:
    idx = s(text)
    attrs = f' r="{cell_ref(r, c)}"'
    if style is not None:
        attrs += f' s="{style}"'
    return f'<c{attrs} t="s"><v>{idx}</v></c>'


def empty_cell(r: int, c: int, style=None) -> str:
    attrs = f' r="{cell_ref(r, c)}"'
    if style is not None:
        attrs += f' s="{style}"'
    return f"<c{attrs}/>"


# Seed instruction strings
for text in [
    "Dantų Harmonija WhatsApp asistento informacijos peržiūra",
    "Skirta: Aušrai / Mariui  ·  2026-09-17",
    "Tikslas: trumpai patvirtinti, kaip asistentas turėtų veikti ir kokią klinikos informaciją jis gali naudoti.",
    "Šioje peržiūroje tikrinama tik žemiau pateikta informacija. Išsamesni paslaugų aprašymai ir bendri tekstai apie kliniką į šią peržiūrą neįtraukti.",
    "Jei informacija teisinga, nieko žymėti nereikia. Pildykite tik tas eilutes, kuriose reikia pakeitimų.",
    "Jei viskas tinka — užtenka atsakyti el. laišku „Informacija tinka.“",
    "Jei reikia pakeitimų — galite juos įrašyti stulpelyje „Jei reikia pakeisti“ arba tiesiog parašyti el. laiške.",
    "Tik vienas klausimas prašo pasirinkimo: 2 skyriuje pasirinkite „Taip“ arba „Ne“.",
    "Skyrius",
    "Informacija",
    "Šiuo metu naudojama",
    "Jei reikia pakeisti",
    "Pasirinkite: Taip / Ne",
]:
    s(text)

for section, item, current, _kind in rows:
    s(section)
    s(item)
    s(current)

sheet_rows_xml = []
sheet_rows_xml.append(
    f'<row r="1" ht="22" customHeight="1">{t_cell(1, 1, "Dantų Harmonija WhatsApp asistento informacijos peržiūra", 1)}</row>'
)
sheet_rows_xml.append(f'<row r="2">{t_cell(2, 1, "Skirta: Aušrai / Mariui  ·  2026-09-17", 2)}</row>')
sheet_rows_xml.append(
    f'<row r="3">{t_cell(3, 1, "Tikslas: trumpai patvirtinti, kaip asistentas turėtų veikti ir kokią klinikos informaciją jis gali naudoti.", 2)}</row>'
)
sheet_rows_xml.append(
    f'<row r="4" ht="36" customHeight="1">{t_cell(4, 1, "Šioje peržiūroje tikrinama tik žemiau pateikta informacija. Išsamesni paslaugų aprašymai ir bendri tekstai apie kliniką į šią peržiūrą neįtraukti.", 2)}</row>'
)
sheet_rows_xml.append(
    f'<row r="5" ht="36" customHeight="1">{t_cell(5, 1, "Jei informacija teisinga, nieko žymėti nereikia. Pildykite tik tas eilutes, kuriose reikia pakeitimų.", 3)}</row>'
)
sheet_rows_xml.append(
    f'<row r="6">{t_cell(6, 1, "Jei viskas tinka — užtenka atsakyti el. laišku „Informacija tinka.“", 2)}</row>'
)
sheet_rows_xml.append(
    f'<row r="7">{t_cell(7, 1, "Jei reikia pakeitimų — galite juos įrašyti stulpelyje „Jei reikia pakeisti“ arba tiesiog parašyti el. laiške.", 2)}</row>'
)
sheet_rows_xml.append(
    f'<row r="8">{t_cell(8, 1, "Tik vienas klausimas prašo pasirinkimo: 2 skyriuje pasirinkite „Taip“ arba „Ne“.", 2)}</row>'
)
sheet_rows_xml.append('<row r="9"/>')
sheet_rows_xml.append(
    f'<row r="{header_row}">'
    f'{t_cell(header_row, 1, "Skyrius", 4)}'
    f'{t_cell(header_row, 2, "Informacija", 4)}'
    f'{t_cell(header_row, 3, "Šiuo metu naudojama", 4)}'
    f'{t_cell(header_row, 4, "Jei reikia pakeisti", 4)}'
    f"</row>"
)

for i, (section, item, current, kind) in enumerate(rows):
    r = first_data + i
    style_a = 5 if i % 2 == 0 else 6
    if kind == "taip_ne":
        d_cell = t_cell(r, 4, "Pasirinkite: Taip / Ne", 7)
    else:
        d_cell = empty_cell(r, 4, 7)
    sheet_rows_xml.append(
        f'<row r="{r}" ht="30" customHeight="1">'
        f"{t_cell(r, 1, section, style_a)}"
        f"{t_cell(r, 2, item, style_a)}"
        f"{t_cell(r, 3, current, style_a)}"
        f"{d_cell}"
        f"</row>"
    )

sheet_data = "\n".join(sheet_rows_xml)

si_parts = [f'<si><t xml:space="preserve">{escape(text)}</t></si>' for text in slist]
shared = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    f'<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
    f'count="{len(slist)}" uniqueCount="{len(slist)}">'
    + "".join(si_parts)
    + "</sst>"
)

dv_parts = []
for r in taip_ne_rows:
    dv_parts.append(
        '<dataValidation type="list" allowBlank="1" showDropDown="0" showErrorMessage="1" '
        'errorTitle="Pasirinkimas" error="Pasirinkite Taip arba Ne." '
        f'sqref="D{r}"><formula1>"Taip,Ne"</formula1></dataValidation>'
    )
data_validations = (
    f'<dataValidations count="{len(dv_parts)}">{"".join(dv_parts)}</dataValidations>'
    if dv_parts
    else ""
)

cols = """
<cols>
  <col min="1" max="1" width="28" customWidth="1"/>
  <col min="2" max="2" width="55" customWidth="1"/>
  <col min="3" max="3" width="70" customWidth="1"/>
  <col min="4" max="4" width="40" customWidth="1"/>
</cols>
"""

merges = """
<mergeCells count="8">
  <mergeCell ref="A1:D1"/>
  <mergeCell ref="A2:D2"/>
  <mergeCell ref="A3:D3"/>
  <mergeCell ref="A4:D4"/>
  <mergeCell ref="A5:D5"/>
  <mergeCell ref="A6:D6"/>
  <mergeCell ref="A7:D7"/>
  <mergeCell ref="A8:D8"/>
</mergeCells>
"""

worksheet = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
 xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheetViews>
    <sheetView tabSelected="1" workbookViewId="0">
      <pane ySplit="{header_row}" topLeftCell="A{header_row + 1}" activePane="bottomLeft" state="frozen"/>
      <selection pane="bottomLeft"/>
    </sheetView>
  </sheetViews>
  <sheetFormatPr defaultRowHeight="15"/>
  {cols}
  <sheetData>
  {sheet_data}
  </sheetData>
  {merges}
  {data_validations}
  <pageMargins left="0.5" right="0.5" top="0.75" bottom="0.75" header="0.3" footer="0.3"/>
</worksheet>
"""

styles = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="5">
    <font><sz val="11"/><color theme="1"/><name val="Calibri"/></font>
    <font><b/><sz val="16"/><color theme="1"/><name val="Calibri"/></font>
    <font><sz val="11"/><color theme="1"/><name val="Calibri"/></font>
    <font><b/><sz val="12"/><color rgb="FF833C0C"/><name val="Calibri"/></font>
    <font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
  </fonts>
  <fills count="6">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFFFF2CC"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF1F4E79"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFF2F2F2"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFFFFFFF"/><bgColor indexed="64"/></patternFill></fill>
  </fills>
  <borders count="2">
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <border>
      <left style="thin"><color rgb="FFB4B4B4"/></left>
      <right style="thin"><color rgb="FFB4B4B4"/></right>
      <top style="thin"><color rgb="FFB4B4B4"/></top>
      <bottom style="thin"><color rgb="FFB4B4B4"/></bottom>
    </border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="8">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>
    <xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment wrapText="1"/></xf>
    <xf numFmtId="0" fontId="3" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment wrapText="1" vertical="center"/></xf>
    <xf numFmtId="0" fontId="4" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment wrapText="1" vertical="center"/></xf>
    <xf numFmtId="0" fontId="0" fillId="4" borderId="1" xfId="0" applyFill="1" applyBorder="1" applyAlignment="1"><alignment wrapText="1" vertical="top"/></xf>
    <xf numFmtId="0" fontId="0" fillId="5" borderId="1" xfId="0" applyFill="1" applyBorder="1" applyAlignment="1"><alignment wrapText="1" vertical="top"/></xf>
    <xf numFmtId="0" fontId="0" fillId="2" borderId="1" xfId="0" applyFill="1" applyBorder="1" applyAlignment="1"><alignment wrapText="1" vertical="center"/></xf>
  </cellXfs>
</styleSheet>
"""

content_types = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  <Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>
</Types>
"""

rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>
"""

workbook = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
 xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Peržiūra" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>
"""

wb_rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>
</Relationships>
"""

with zipfile.ZipFile(out, "w", compression=zipfile.ZIP_DEFLATED) as z:
    z.writestr("[Content_Types].xml", content_types)
    z.writestr("_rels/.rels", rels)
    z.writestr("xl/workbook.xml", workbook)
    z.writestr("xl/_rels/workbook.xml.rels", wb_rels)
    z.writestr("xl/worksheets/sheet1.xml", worksheet)
    z.writestr("xl/styles.xml", styles)
    z.writestr("xl/sharedStrings.xml", shared)

print(f"Wrote {out}")
print(f"Data rows: {len(rows)}")
print(f"Taip/Ne dropdown on rows: {taip_ne_rows}")
