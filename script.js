const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random';
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');
const correctWordsElement = document.getElementById('correctWords');
const incorrectWordsElement = document.getElementById('incorrectWords');

quoteInputElement.addEventListener('input', () => {
    const arrayQuote = quoteDisplayElement.querySelectorAll('span');
    const arrayValue = quoteInputElement.value.split('');

    let correct = true;
    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index];
        if (character == null) {
            characterSpan.classList.remove('correct');
            characterSpan.classList.remove('incorrect');
            correct = false;
        } else if (character === characterSpan.innerText) {
            characterSpan.classList.add('correct');
            characterSpan.classList.remove('incorrect');
        } else {
            characterSpan.classList.remove('correct');
            characterSpan.classList.add('incorrect');
            correct = false;
        }
    });

    countWords(); // Call the countWords function

    if (correct) renderNewQuote();
});

function getRandomQuote() {
    return fetch(RANDOM_QUOTE_API_URL)
        .then(response => response.json())
        .then(data => data.content);
}

async function renderNewQuote() {
    const quote = await getRandomQuote();
    quoteDisplayElement.innerHTML = '';
    quote.split('').forEach(character => {
        const characterSpan = document.createElement('span');
        characterSpan.innerText = character;
        quoteDisplayElement.appendChild(characterSpan);
    });
    quoteInputElement.value = null;
    startTimer();
}

let startTime;
function startTimer() {
    timerElement.innerText = 0;
    startTime = new Date();
    setInterval(() => {
        timerElement.innerText = getTimerTime();
    }, 1000);
}

function getTimerTime() {
    return Math.floor((new Date() - startTime) / 1000);
}

function countWords() {
    const quoteText = quoteDisplayElement.innerText.trim();
    const inputText = quoteInputElement.value.trim();

    const quoteWords = quoteText.split(' ');
    const inputWords = inputText.split(' ');

    let correctWords = 0;
    let incorrectWords = 0;

    quoteWords.forEach((word, index) => {
        if (inputWords[index] === word) {
            correctWords++;
        } else if (inputWords[index] !== undefined) {
            incorrectWords++;
        }
    });

    incorrectWords += inputWords.length > quoteWords.length ? inputWords.length - quoteWords.length : 0;

    correctWordsElement.innerText = `Correct Words: ${correctWords}`;
    incorrectWordsElement.innerText = `Incorrect Words: ${incorrectWords}`;
}

renderNewQuote();
