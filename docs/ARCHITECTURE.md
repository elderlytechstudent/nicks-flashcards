App
├── Header
│   ├── AppTitle
│   ├── ModeToggle (IT / ES / EN)
│   └── StatsBar (streak, accuracy%, cards reviewed)
│
├── SetupScreen               ← shown when no session is active
│   ├── FileUploader          ← drag-and-drop + click-to-attach
│   ├── TierSelector          ← checkboxes: Tier 1–4
│   └── StartButton
│
├── StudyScreen               ← main study view
│   ├── DeckProgress          ← "12 / 47 cards"
│   ├── FlashCard             ← the star component
│   │   ├── CardFront
│   │   └── CardBack
│   ├── CardControls          ← Flip / Again / Got It
│   └── DeckControls          ← Shuffle, End Session
│
└── StatsScreen               ← end-of-session or persistent view
    ├── SessionSummary
    ├── TierBreakdown
    └── ResetButton



**Step 2 — Types + CSV parser** — define the types above, write the `parseCSV` utility

**Step 3 — Zustand store** — full app state with localStorage persistence

**Step 4 — FileUploader component** — drag & drop + file input, emits parsed cards

**Step 5 — SetupScreen** — tier selector + start button

**Step 6 — FlashCard component** — flip animation, mode-aware front/back rendering

**Step 7 — CardControls + SM-2 logic** — Again / Got It updates the algorithm

**Step 8 — StatsBar + StatsScreen**

**Step 9 — Polish** — transitions between screens, keyboard shortcuts (Space to flip, arrow keys to grade)

---

## Wireframe Sketch

┌─────────────────────────────────────────┐
│  Nick's Flashcards    [IT] [ES] [EN]     │
│  🔥 5  |  Accuracy: 82%  |  14 reviewed │
├─────────────────────────────────────────┤
│                                         │
│  ████████████░░░░░░░░  12/47            │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │         essere                    │  │ ← FRONT (Italian mode)
│  │   Oggi sono molto stanco.         │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│         [ Flip Card ]                   │
│                                         │
│  ────── after flip ──────               │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  to be (state)                    │  │
│  │                                   │  │
│  │  🇪🇸 ser/estar                     │  │
│  │  Hoy estoy muy _____.             │  │ ← underlined word
│  │                                   │  │
│  │  🌎 ser/estar                     │  │
│  │  Hoy estoy muy _____.             │  │
│  │                                   │  │
│  │  Latin: esse                      │  │
│  └───────────────────────────────────┘  │
│                                         │
│      [ Again ]        [ Got It ✓ ]      │
└─────────────────────────────────────────┘


