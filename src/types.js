/**
 * @fileoverview
 */

/**
 * A single flashcard as parsed from CSV
 * @typedef {Object} flashcard
 * @property {string} id
 * @property {number} tier
 * @property {number} position
 * @property {string} english
 * @property {string} english_sentence
 * @property {string} italian
 * @property {string} italian_sentence
 * @property {string} castilian
 * @property {string} castilian_pronunciation
 * @property {string} castilian_sentence
 * @property {string} latam
 * @property {string} latam_sentence
 * @property {string} latin_root
 * @property {string} category
 */

/**
 * SM-2 spaced repetition block for one card in one mode
 * @typedef {Object} SM2Block
 * @property {number} interval - days until next review, starts at 1
 * @property {number} repetitions - consecutive correct answers
 * @property {number} easeFactor - starts at 2.5
 * @property {string} nextReview - ISO date string
 * @property {string} correct - lifetime correct count
 * @property {string} incorrect - lifetime incorrect count
 */

/**
 * Full progress entry for one card across all three modes
 * @typedef {Object} CardProgress
 * @property {string} cardId
 * @property {SM2Block} italian
 * @property {SM2Block} spanish
 * @property {SM2Block} english
 */

/**
 * Session statistics for the current study session
 * @typedef {Object} SessionStats
 * @property {number} reviewed
 * @property {number} correct
 * @property {number} streak
 */


/**
 * Global app state shape (managed by Zustand store) 
 * @typedef {Object} AppState
 * @property {'italian' | 'spanish' | 'english'} mode
 * @property {FlashCard[]} deck
 * @property {number[]} activeTiers
 * @property{Object.<string, CardProgress>} progress
 * @property {SessionStats} sessionStats
 */