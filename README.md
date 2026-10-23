# Luna di Stelle — sito di oroscopi

Sito statico responsive in italiano con 12 segni, finestra di lettura, contenuti mensili e workflow per generare automaticamente nuovi testi.

## File inclusi
- `index.html`, `styles.css`, `app.js`: sito web.
- `horoscopes.json`: contenuti mostrati dal sito.
- `scripts/generate_horoscopes.py`: genera testi originali per il mese corrente.
- `.github/workflows/monthly.yml`: esegue il generatore il giorno 1 di ogni mese alle 06:17 UTC; puoi anche avviarlo manualmente da GitHub Actions.

## Anteprima sul computer
Apri un terminale nella cartella ed esegui:
```bash
python -m http.server 8000
```
Poi visita `http://localhost:8000`. Non aprire `index.html` direttamente come file: il browser potrebbe bloccare il caricamento di `horoscopes.json`.

## Attivare l'aggiornamento automatico
1. Crea un repository GitHub e carica tutti i file.
2. In GitHub vai su **Settings → Secrets and variables → Actions → New repository secret**.
3. Crea un secret chiamato `OPENAI_API_KEY` con una chiave API valida. L'uso dell'API può comportare costi separati da ChatGPT.
4. In **Settings → Pages**, scegli **Deploy from a branch**, branch `main`, cartella `/(root)`, quindi salva.
5. In **Actions**, abilita i workflow se GitHub lo richiede. Il workflow mensile aggiorna `horoscopes.json` con testi originali e li salva nel repository.
6. Se il repository è privato o le impostazioni dell'organizzazione limitano GitHub Actions, controlla i permessi di scrittura e le policy.

GitHub Pages pubblica il contenuto del branch. L'aggiornamento mensile avviene quando GitHub Actions è abilitato e la chiave API è configurata correttamente. Il job usa un modello API indicato nel workflow; se quel modello non è disponibile per il tuo account, modifica `OPENAI_MODEL` nel workflow.

## Dominio personalizzato
1. Registra il dominio tramite un registrar.
2. In **Settings → Pages → Custom domain**, inserisci il dominio e segui le istruzioni DNS fornite da GitHub.
3. Attendi la propagazione DNS e verifica HTTPS. La disponibilità di `LunadiStelle.it` non è stata verificata e il dominio non è stato acquistato da questo progetto.

## Prima della pubblicazione
- Sostituisci o completa le pagine privacy/cookie con informazioni coerenti con i servizi effettivamente usati.
- Il modulo newsletter è solo una demo: non salva né invia email. Collega un servizio newsletter e aggiungi consenso, informativa e gestione disiscrizione prima di raccogliere contatti.
- Controlla i testi generati prima di renderli pubblici, almeno durante la fase iniziale.
- Non copiare articoli di altri siti: il generatore crea testi originali usando temi generali e non esegue scraping.
- Aggiungi contatti, informazioni editoriali, banner cookie ove richiesto e dati legali applicabili al tuo caso.
