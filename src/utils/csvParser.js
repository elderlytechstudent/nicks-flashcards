import Papa from 'papaparse'

/**
 * Validates that a raw CSV rows has all required FlashCard fields
 * @param {Object} row - raw row from PapaParse
 * @returns {boolean}
 */

function isValidRow(row) {
    const requiredFields = [
        'id', 'tier', 'position', 'english', 'english_sentence', 'italian', 'italian_sentence', 'castilian', 'castilian_pronunciation', 'castilian_sentence', 'latam', 'latam_sentence', 'latin_root', 'category'
    ]
    return requiredFields.every(field => field in row && row[field] !== '')
}

/**
 * Converts a raw CSV row into a FlashCard object
 * @params {Object} row - validated raw row from PapaParse
 * @returns {import('../types').FlashCard}
 */
function rowToCard(row) {
    return {
        id: row.id.trim(),
        tier: Number(row.tier),
        position: Number(row.position),
        english: row.english.trim(),
        english_sentence: row.english_sentence.trim(),
        italian: row.italian.trim(),
        italian_sentence: row.italian_sentence.trim(),
        castilian: row.castilian.trim(),
        castilian_pronunciation: row.castilian_pronunciation.trim(),
        castilian_sentence: row.castilian_sentence.trim(),
        latam: row.latam.trim(),
        latam_sentence: row.latam_sentence.trim(),
        latin_root: row.latin_root.trim(),
        category: row.category.trim()
    }
}

/**
 * Parses a CSV file into an array of FlashCard objects
 * @param {File} file
 * @returns {Promise<import('../types').FlashCard[]>}
 */

export function parseCSVFile(file) {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const validRows = results.data.filter(isValidRow)
                const invalidCount = results.data.length - validRows.length

                if (invalidCount > 0) {
                    console.warn(`Skipped ${invalidCount} invalid rows in ${file.name}`)
                }

                const cards = validRows.map(rowToCard)
                resolve(cards)
            },
            error: (error) => {
                reject(new Error(`Failed to parse ${file.name}: ${error.message}`))
            }
        })
    })
}

/**
 * Parses multiple CSV files and merges them into one sorted deck
 * @param {File[]} files - array of File objects
 * @returns {Promise<ImportAssertions('../types').FlashCard[]>}
 */

export async function parseMultipleCSVFiles(files) {
    const results = await Promise.all(files.map(parseCSVFile))
    const allCards = results.flat()
    return allCards.sort((a, b) => a.tier - b.tier || a.position - b.position)
}