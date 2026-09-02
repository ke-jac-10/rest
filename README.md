# 💶 Resto Perfetto

Una piccola web app per allenarsi a dare il resto giusto, usando le vere monete e banconote in euro che si usano in Italia.

**Demo:** https://ke-jac-10.github.io/rest/

## Come funziona

Ogni volta compare un cliente casuale (nome, faccina, articolo acquistato) che deve pagare un prezzo casuale e paga con una banconota o moneta reale. Il compito è cliccare sulle monete e banconote del cassetto per comporre esattamente il resto dovuto, usando il minor numero possibile di pezzi.

Dopo la conferma, l'app dice se il resto è:

- **corretto e ottimale** — l'importo è giusto e hai usato il numero minimo di pezzi;
- **corretto ma non ottimale** — l'importo è giusto ma potevi usare meno pezzi;
- **sbagliato** — l'importo dato non corrisponde al resto dovuto.

C'è anche un pulsante "Mostra soluzione" per chi resta bloccato, e un punteggio con serie di risposte perfette e record.

## Caratteristiche

- Solo le monete e banconote realmente in circolazione per il resto: banconote da 5, 10, 20, 50, 100 €; monete da 5, 10, 20, 50 centesimi, 1 € e 2 €.
- Prezzi sempre multipli di 5 centesimi, come previsto dalla legge italiana sull'arrotondamento dei pagamenti in contanti (dal 2018).
- Algoritmo che calcola la combinazione ottimale (numero minimo di pezzi) per confrontarla con la scelta dell'utente.
- Punteggio, serie di risposte perfette e record, salvati nel browser.
- Interfaccia responsive, pensata anche per l'uso da smartphone.
- Nessuna dipendenza esterna a parte i font (Google Fonts): un solo file HTML autosufficiente.

## Uso in locale

Non serve alcuna build o server: basta clonare il repository e aprire `index.html` in un browser.

```
git clone https://github.com/ke-jac-10/rest.git
cd rest
```

Poi apri semplicemente il file `index.html` con doppio click, oppure trascinalo in una finestra del browser.

## Struttura del progetto

```
index.html   — l'intera web app: markup, stile e logica di gioco in un unico file
```

## Pubblicazione

Il sito è pubblicato con GitHub Pages direttamente dal branch `main` (cartella `/`). Ogni push su `main` aggiorna automaticamente la versione online in pochi minuti.
