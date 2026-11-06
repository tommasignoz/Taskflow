# 💾 TaskFlow v1.0 - Retrò Task Manager

> Un'applicazione di gestione task in puro stile retrò anni '90 / MS-DOS / Windows 95, con effetti sonori a 8-bit sintetizzati via Web Audio API, temi CRT e gestione completa dello stato con persistenza locale.

---

## 📸 Caratteristiche Principali

- 🕹️ **Interfaccia Retrò Anni '90**: Finestre con bordi 3D bevel, barre del titolo con gradiente, font pixel art (`VT323` e `Press Start 2P`) ed effetto CRT Scanlines attivabile.
- 🎨 **Temi Multipli**:
  - **Classico 95**: Stile desktop grigio/blu classico Windows.
  - **CRT Verde**: Fosfori verdi stile terminale hacker/mainframe.
  - **CRT Ambra**: Terminali ambra stile primi anni '80.
  - **Cyber Arcade**: Neon viola e ciano arcade anni '80/'90.
- 🔊 **Effetti Sonori 8-bit Integrati**: Generati dinamicamente nel browser con **Web Audio API** (nessun file audio esterno richiesto):
  - *Click Meccanico* alla pressione dei tasti
  - *Ding* armonico al completamento di una task
  - Toni dedicati per aggiunta, modifica, cancellazione e ripristino
  - Tasto Mute/Audio per attivare o disattivare i suoni in qualsiasi momento.
- ⚡ **Gestione Attività Completa (CRUD)**:
  - Creazione attività con priorità (Alta, Media, Bassa) e categoria
  - Modifica rapida inline
  - Completamento singolo o massivo (Toggle All)
  - Eliminazione con notifica e pulsante di **Ripristino rapido (Undo)**
  - Pulizia automatica delle completate
- 🔍 **Filtri e Ricerca**:
  - Ricerca testuale istantanea in tempo reale
  - Filtro per stato: *Tutte*, *Attive*, *Completate*
  - Filtro per priorità: *Alta*, *Media*, *Bassa*
  - Ordinamento per data di creazione, priorità o titolo
- 📊 **Dashboard & Statistiche**:
  - Banner di stato con conteggio totale, attive, completate
  - Barra di avanzamento stile pixel-art retrò
  - Barra di stato inferiore con orologio di sistema e log delle ultime azioni
- 💾 **Persistenza Dati**: Salvataggio automatico in `localStorage` con dati demo ripristinabili.

---

## 🛠️ Stack Tecnologico

- **Frontend**: [React 19](https://react.dev/)
- **Bundler**: [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Audio Engine**: Web Audio API (sintesi di oscillatori Sine, Square e White Noise)
- **Linter**: [Oxlint](https://oxc.rs/)

---

## 🚀 Avvio Rapido

### Prerequisiti

- [Node.js](https://nodejs.org/) (versione 18 o superiore raccomandata)
- [npm](https://www.npmjs.com/)

### Installazione

1. Clona la repository:
   ```bash
   git clone https://github.com/tommasignoz/Taskflow.git
   cd Taskflow
   ```

2. Installa le dipendenze:
   ```bash
   npm install
   ```

3. Avvia il server di sviluppo:
   ```bash
   npm run dev
   ```

4. Apri il browser all'indirizzo indicato nel terminale (solitamente `http://localhost:5173`).

---

## 📜 Script Disponibili

- `npm run dev`: Avvia il server di sviluppo Vite con Hot Module Replacement (HMR).
- `npm run build`: Compila l'applicazione per la produzione nella cartella `dist/`.
- `npm run preview`: Avvia un server locale per visualizzare in anteprima la build di produzione.
- `npm run lint`: Esegue il controllo del codice con Oxlint ad alte prestazioni.

---

## 📂 Struttura del Progetto

```
├── public/                 # Asset statici (icone SVG, favicon)
├── src/
│   ├── assets/             # Immagini e grafica
│   ├── components/         # Componenti UI modulari
│   │   ├── StatsBanner.jsx # Banner riepilogo e barra di progresso
│   │   ├── StatusBar.jsx   # Barra di stato con orologio e log
│   │   ├── TaskFilters.jsx # Ricerca, filtri e ordinamento
│   │   ├── TaskForm.jsx    # Form inserimento nuova task
│   │   ├── TaskItem.jsx    # Singola riga task con controlli inline
│   │   └── TopBar.jsx      # Barra del titolo della finestra con comandi
│   ├── hooks/
│   │   └── useTaskManager.js # Hook custom con logica CRUD e localStorage
│   ├── utils/
│   │   └── soundEffects.js   # Sintetizzatore sonoro Web Audio API
│   ├── App.css             # Regole CSS retrò, scanlines e animazioni
│   ├── App.jsx             # Componente root principale
│   ├── index.css           # Configurazione Tailwind v4 e variabili tema
│   └── main.jsx            # Entry point dell'applicazione React
├── index.html              # Template HTML con font retrò Google Fonts
├── package.json            # Metadati del progetto e dipendenze
└── vite.config.js          # Configurazione di Vite con plugin React e Tailwind
```

---

## 📄 Licenza

Distribuito sotto licenza MIT.
