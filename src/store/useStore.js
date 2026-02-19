import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Creates a fresh SM2Block with default values
 * @returns {import('../types').SM2Block}
 */
function createSM2Block() {
  return {
    interval: 1,
    repetitions: 0,
    easeFactor: 2.5,
    nextReview: new Date().toISOString(),
    correct: 0,
    incorrect: 0,
  }
}

/**
 * Creates a fresh CardProgress entry for a given card id
 * @param {string} cardId
 * @returns {import('../types').CardProgress}
 */
function createCardProgress(cardId) {
  return {
    cardId,
    italian: createSM2Block(),
    spanish: createSM2Block(),
    english: createSM2Block(),
  }
}

/**
 * Runs the SM-2 algorithm on a single block
 * @param {import('../types').SM2Block} block - current SM2 state
 * @param {boolean} correct - whether the user got it right
 * @returns {import('../types').SM2Block} updated block
 */
function applyS2M(block, correct) {
  let { interval, repetitions, easeFactor, correct: c, incorrect: inc } = block

  if (correct) {
    c += 1
    if (repetitions === 0) interval = 1
    else if (repetitions === 1) interval = 6
    else interval = Math.round(interval * easeFactor)

    easeFactor = Math.max(1.3, easeFactor + 0.1)
    repetitions += 1
  } else {
    inc += 1
    interval = 1
    repetitions = 0
    easeFactor = Math.max(1.3, easeFactor - 0.2)
  }

  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + interval)

  return {
    interval,
    repetitions,
    easeFactor,
    nextReview: nextReview.toISOString(),
    correct: c,
    incorrect: inc,
  }
}

const useStore = create(
  persist(
    (set, get) => ({
      // --- State ---
      mode: 'italian',
      deck: [],
      activeTiers: [1, 2, 3, 4],
      progress: {},
      sessionStats: { reviewed: 0, correct: 0, streak: 0 },
      sessionActive: false,

      // --- Actions ---

      /**
       * Sets the active study mode
       * @param {'italian' | 'spanish' | 'english'} mode
       */
      setMode: (mode) => set({ mode }),

      /**
       * Loads parsed cards into the deck and initializes progress for any new cards
       * @param {import('../types').FlashCard[]} cards
       */
      loadDeck: (cards) => {
        const existingProgress = get().progress
        const newProgress = { ...existingProgress }

        cards.forEach(card => {
          if (!newProgress[card.id]) {
            newProgress[card.id] = createCardProgress(card.id)
          }
        })

        set({ deck: cards, progress: newProgress })
      },

      /**
       * Toggles a tier on or off in the active tiers list
       * @param {number} tier
       */
      toggleTier: (tier) => {
        const current = get().activeTiers
        const updated = current.includes(tier)
          ? current.filter(t => t !== tier)
          : [...current, tier]
        set({ activeTiers: updated })
      },

      /**
       * Starts a study session
       */
      startSession: () => set({
        sessionActive: true,
        sessionStats: { reviewed: 0, correct: 0, streak: 0 }
      }),

      /**
       * Ends the current study session
       */
      endSession: () => set({ sessionActive: false }),

      /**
       * Records a card answer and updates SM-2 progress
       * @param {string} cardId
       * @param {boolean} correct
       */
      recordAnswer: (cardId, correct) => {
        const { mode, progress, sessionStats } = get()
        const cardProgress = progress[cardId] || createCardProgress(cardId)
        const updatedBlock = applyS2M(cardProgress[mode], correct)

        const updatedProgress = {
          ...progress,
          [cardId]: {
            ...cardProgress,
            [mode]: updatedBlock,
          }
        }

        const updatedStats = {
          reviewed: sessionStats.reviewed + 1,
          correct: sessionStats.correct + (correct ? 1 : 0),
          streak: correct ? sessionStats.streak + 1 : 0,
        }

        set({ progress: updatedProgress, sessionStats: updatedStats })
      },

      /**
       * Shuffles the current deck in place
       */
      shuffleDeck: () => {
        const shuffled = [...get().deck].sort(() => Math.random() - 0.5)
        set({ deck: shuffled })
      },

      /**
       * Resets all progress and stats
       */
      resetProgress: () => set({ progress: {}, sessionStats: { reviewed: 0, correct: 0, streak: 0 } }),
    }),
    {
      name: 'nicks-flashcards-storage',
    }
  )
)

export default useStore