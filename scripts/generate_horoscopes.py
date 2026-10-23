#!/usr/bin/env python3
"""Generate original monthly horoscope copy. Requires OPENAI_API_KEY."""
import json, os, calendar
from datetime import date
from pathlib import Path
from openai import OpenAI

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "horoscopes.json"
MONTHS = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"]
SIGNS = [
("Ariete","♈","21 marzo – 19 aprile","coral"),("Toro","♉","20 aprile – 20 maggio","teal"),
("Gemelli","♊","21 maggio – 20 giugno","gold"),("Cancro","♋","21 giugno – 22 luglio","blue"),
("Leone","♌","23 luglio – 22 agosto","orange"),("Vergine","♍","23 agosto – 22 settembre","green"),
("Bilancia","♎","23 settembre – 22 ottobre","purple"),("Scorpione","♏","23 ottobre – 21 novembre","plum"),
("Sagittario","♐","22 novembre – 21 dicembre","cyan"),("Capricorno","♑","22 dicembre – 19 gennaio","brown"),
("Acquario","♒","20 gennaio – 18 febbraio","sky"),("Pesci","♓","19 febbraio – 20 marzo","mint")]
def main():
    today = date.today()
    month_name = MONTHS[today.month-1].capitalize()
    month_label = f"{month_name} {today.year}"
    prompt = f"""
Scrivi testi ORIGINALI in italiano per un sito di intrattenimento astrologico. Produci SOLO JSON valido con chiavi:
intro (2 frasi, max 50 parole), signs (array di 12 oggetti).
Ogni oggetto deve avere name, symbol, dates, color, love, work, wellbeing, fortune, advice.
Usa esattamente questi segni/metadati nell'ordine: {json.dumps(SIGNS, ensure_ascii=False)}.
Il mese è {month_label}. Per ogni campo testuale scrivi 1-2 frasi, tono umano, colloquiale, caloroso e non generico, come un piccolo blog personale. Varia ritmo e immagini. Non copiare né parafrasare articoli identificabili di altri siti e non citare fonti specifiche; crea idee nuove a partire da temi generali. Niente promesse, predizioni certe, consigli medici/finanziari o affermazioni che inducano a decisioni importanti. Presenta l'astrologia come intrattenimento e spunto di riflessione. Non includere Markdown.
"""
    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    response = client.chat.completions.create(
        model=os.environ.get("OPENAI_MODEL", "gpt-4.1-mini"),
        messages=[{"role":"system","content":"Sei un redattore italiano esperto di contenuti originali e rispettosi del lettore. Rispondi con JSON valido."},{"role":"user","content":prompt}],
        response_format={"type":"json_object"},
        temperature=0.9,
    )
    data = json.loads(response.choices[0].message.content)
    data["month"] = month_label
    if len(data.get("signs", [])) != 12:
        raise ValueError("Il modello non ha restituito esattamente 12 segni.")
    expected = [x[0] for x in SIGNS]
    if [x.get("name") for x in data["signs"]] != expected:
        raise ValueError("Ordine o nomi dei segni non validi.")
    DATA_FILE.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Aggiornato {DATA_FILE} per {month_label}")
if __name__ == "__main__":
    main()
