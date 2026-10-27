# Maxora — La isla, en tiempo real

App gratuita con mappa live delle strade di Fuerteventura: incidenti, traffico, pericoli, lavori, zone con presenza polizia (solo per zona), più luoghi da visitare e attività locali.

## Struttura

| Percorso | Cosa contiene |
| --- | --- |
| `index.html` | App pubblica (mappa, arco "prossimo avviso", segnalazioni, voti, avvisi di prossimità) |
| `admin/` | Centro di controllo (solo admin) |
| `assets/config.js` | Indirizzo Supabase e chiave pubblica |
| `assets/theme.css` | Colori chiaro/scuro condivisi |
| `supabase/001_base.sql` | Database completo (tabelle, regole, permessi) |

## Indirizzi

- App: `https://stocked-app.github.io/MAXORA/`
- Admin: `https://stocked-app.github.io/MAXORA/admin/`

## Note

- La chiave in `config.js` è la chiave *publishable*: è fatta per stare nel browser. I permessi veri sono nelle regole del database.
- Mappe di base: CARTO (Positron / Dark Matter). Prima del lancio commerciale verificare la licenza o passare a MapLibre con tile proprie.
