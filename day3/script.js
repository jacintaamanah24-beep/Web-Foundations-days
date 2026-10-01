let notes = [
    { id: 1, text: "Buy milk and bread", category: "personal" },
    { id: 2, text: "Finish the Day 3 assignment", category: "study" },
    { id: 3, text: "Email the project report to Grace", category: "work" },
    { id: 4, text: "Revise JavaScript arrays", category: "study" },
    { id: 5, text: "Call mum", category: "personal" },
];
function searchNotes(word) {
    return notes.filter((note) =>
        note.text.toLowerCase().includes(word.toLowerCase())
    );
}
console.log(searchNotes("javascript"));
// Expected: [{ id: 4, text: "Revise JavaScript arrays", category: "study" }]

console.log(searchNotes("pizza"));
// Expected: []
function longestNote() {
    if (notes.length === 0) {
        return null;
    }

    return notes.reduce((longest, note) =>
        note.text.length > longest.text.length ? note : longest
    );
}
console.log(longestNote());
// Expected: { id: 3, text: "Email the project report to Grace", category: "work" }
const savedNotes = notes;
notes = [];

console.log(longestNote());
// Expected: null

notes = savedNotes;
function countByCategory() {
    const counts = {};

    notes.forEach((note) => {
        if (counts[note.category]) {
            counts[note.category]++;
        } else {
            counts[note.category] = 1;
        }
    });

    return counts;
}
console.log(countByCategory());
// Expected: { personal: 2, study: 2, work: 1 }
const savedNotesForCategory = notes;
notes = [];

console.log(countByCategory());
// Expected: {}

notes = savedNotesForCategory;
function getSummary() {
    const counts = countByCategory();
    const noteWord = notes.length === 1 ? "note" : "notes";

    return `${notes.length} ${noteWord}: ${counts.personal || 0} personal, ${counts.work || 0} work, ${counts.study || 0} study.`;
}
console.log(getSummary());
// Expected: "5 notes: 2 personal, 1 work, 2 study."
const savedNotesForSummary = notes;
notes = [];

console.log(getSummary());
// Expected: "0 notes: 0 personal, 0 work, 0 study."

notes = savedNotesForSummary;
function isDuplicate(text) {
    const cleanedText = text.trim().toLowerCase();

    return notes.some((note) =>
        note.text.trim().toLowerCase() === cleanedText
    );
}
console.log(isDuplicate("Buy milk and bread"));
// Expected: true
console.log(isDuplicate("  BUY MILK AND BREAD  "));
// Expected: true
console.log(isDuplicate("Go to the gym"));
// Expected: false
function addNote(text, category) {
    const cleanedText = text.trim();

    if (cleanedText.length < 1 || cleanedText.length > 200) {
        console.log("Note rejected: text must be 1-200 characters.");
        return false;
    }

    if (isDuplicate(cleanedText)) {
        console.log("Note rejected: duplicate note.");
        return false;
    }

    const validCategories = ["personal", "work", "study"];

    if (!validCategories.includes(category)) {
        console.log("Note rejected: invalid category.");
        return false;
    }

    const newNote = {
        id: Date.now(),
        text: cleanedText,
        category: category
    };

    notes.push(newNote);

    console.log(`Note added: "${newNote.text}"`);
    return true;
}
const originalNotes = [...notes];

// Test 1: valid note
console.log(addNote("Learn JavaScript functions", "study"));
// Expected: true

// Test 2: duplicate note
console.log(addNote("Buy milk and bread", "personal"));
// Expected: false

// Test 3: invalid category
console.log(addNote("My new work note", "school"));
// Expected: false

// Test 4: empty text
console.log(addNote("", "personal"));
// Expected: false

// Test 5: text longer than 200 characters
console.log(addNote("a".repeat(201), "personal"));
// Expected: false

// Restore original notes after testing
notes = originalNotes;