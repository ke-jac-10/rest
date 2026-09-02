#  Resto Perfetto

Una piccola web app per allenarsi a dare il resto giusto, usando le vere monete e banconote in euro che si usano in Italia.

**Demo:** https://ke-jac-10.github.io/rest/ (GitHub Pages) — l'account e la classifica funzionano solo sulla versione Netlify, che sola ha le funzioni per il salvataggio.

## Come funziona

Ogni volta compare un cliente casuale (nome, faccina, articolo acquistato) che deve pagare un prezzo casuale e paga con una banconota o moneta reale. Il compito è cliccare sulle monete e banconote del cassetto per comporre esattamente il resto dovuto, usando il minor numero possibile di pezzi.

Dopo la conferma, l'app dice se il resto è:

- **corretto e ottimale** — l'importo è giusto e hai usato il numero minimo di pezzi;
- **corretto ma non ottimale** — l'importo è giusto ma potevi usare meno pezzi;
- **sbagliato** — l'importo dato non corrisponde al resto dovuto.

C'è anche un pulsante "Mostra soluzione" per chi resta bloccato, e un punteggio con serie di risposte perfette e record.

## Account e classifica

Con "Accedi" / "Registrati" si crea un account (nome utente + password): punteggio, serie, record e traguardi vengono salvati sul server invece che solo nel browser, quindi si ritrovano su qualunque dispositivo facendo di nuovo login. C'è anche una classifica pubblica con i migliori punteggi e un pannello "Profilo" con dei badge da sbloccare (prima risposta perfetta, serie da 5/10/20, clienti serviti, punteggio raggiunto).

Senza account, il gioco funziona comunque: punteggio e serie restano salvati solo nel browser usato (`localStorage`), come prima.

**Nota di sicurezza:** le password sono salvate come hash con salt (scrypt), mai in chiaro. È un progetto hobbistico: non c'è recupero password né verifica email, e il punteggio inviato al server non è protetto da chi modifica il codice del browser — va bene per un gioco personale, non per una gara con premi in palio.

## Caratteristiche

- Solo le monete e banconote realmente in circolazione per il resto: banconote da 5, 10, 20, 50, 100 €; monete da 5, 10, 20, 50 centesimi, 1 € e 2 €.
- Prezzi sempre multipli di 5 centesimi, come previsto dalla legge italiana sull'arrotondamento dei pagamenti in contanti (dal 2018).
- Algoritmo che calcola la combinazione ottimale (numero minimo di pezzi) per confrontarla con la scelta dell'utente.
- Account con punteggio, serie, record e badge sincronizzati su ogni dispositivo, più classifica pubblica.
- Interfaccia responsive, pensata anche per l'uso da smartphone.
- Nessuna build necessaria per il sito statico; il backend è una manciata di funzioni serverless.

## Uso in locale

Il file `index.html` funziona da solo aprendolo in un browser (senza account, in modalità locale):

```
git clone https://github.com/ke-jac-10/rest.git
cd rest
```

Poi apri semplicemente `index.html` con doppio click, oppure trascinalo in una finestra del browser.

Per provare anche account e classifica in locale serve la Netlify CLI (`netlify dev`), che avvia sito e funzioni insieme.

## Struttura del progetto

```
index.html                     — l'intera interfaccia: markup, stile e logica di gioco
package.json                   — dipendenza @netlify/blobs per le funzioni serverless
netlify.toml                   — configurazione build/funzioni e redirect /api/*
netlify/functions/register.mjs — crea un nuovo account (username + password con hash scrypt)
netlify/functions/login.mjs    — verifica le credenziali e apre una sessione
netlify/functions/me.mjs       — restituisce i dati dell'utente autenticato
netlify/functions/sync.mjs     — salva punteggio/serie aggiornati (o li azzera, su richiesta)
netlify/functions/leaderboard.mjs — classifica pubblica dei migliori punteggi
```

I dati (account e sessioni) sono salvati con Netlify Blobs, incluso nel piano Netlify del sito, senza bisogno di un database esterno.

## Pubblicazione

Il sito statico (`index.html`) è pubblicato con **GitHub Pages** dal branch `main`. Le funzioni account/classifica funzionano solo dove gira anche il backend, cioè sulla versione pubblicata su **Netlify** (collegata allo stesso repository GitHub): ogni push su `main` aggiorna entrambe le versioni in pochi minuti.
