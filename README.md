# Victoria Apartment Palermo

Sito vetrina statico per Victoria Apartment Palermo, pronto per deploy su Vercel.

## File principali

- `index.html`: struttura e contenuti della landing page
- `styles.css`: design responsive e animazioni
- `script.js`: menu mobile, slider recensioni, lightbox gallery
- `vercel.json`: configurazione Vercel e security headers
- `robots.txt`: indicazioni base per motori di ricerca
- `sitemap.xml`: sitemap da aggiornare con il dominio definitivo

## Anteprima locale

```powershell
python -m http.server 5173
```

Poi apri:

```text
http://localhost:5173
```

## Deploy su Vercel

### Da dashboard

1. Apri Vercel
2. Crea un nuovo progetto
3. Carica o importa questa cartella
4. Framework: `Other`
5. Build command: lascia vuoto
6. Output directory: lascia vuoto o `./`
7. Deploy

### Da terminale

Se hai Vercel CLI installata e sei loggato:

```powershell
vercel
```

Per pubblicare in produzione:

```powershell
vercel --prod
```

## Dopo il deploy

Aggiorna in `sitemap.xml` il dominio `https://victoria-apartment-palermo.vercel.app` con il dominio reale pubblicato da Vercel.
