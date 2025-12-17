// One-Day Quote Generator
// Fetches random quotes from Quotable (https://api.quotable.io/random)
// Features: New Quote, Copy, Tweet, loading & error handling

const API_URL = 'https://api.quotable.io/random';

const el = {
  loading: document.getElementById('loading'),
  quoteBlock: document.getElementById('quote'),
  quoteText: document.getElementById('quote-text'),
  quoteAuthor: document.getElementById('quote-author'),
  error: document.getElementById('error'),
  newBtn: document.getElementById('new-quote'),
  copyBtn: document.getElementById('copy-quote'),
  tweetBtn: document.getElementById('tweet-quote'),
};

async function fetchQuote() {
  showLoading(true);
  showError('');
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    displayQuote(data);
  } catch (err) {
    showError('Could not load a quote. Try again.');
    console.error(err);
  } finally {
    showLoading(false);
  }
}

function displayQuote({ content, author }) {
  el.quoteText.textContent = content;
  el.quoteAuthor.textContent = author ? `— ${author}` : '— Unknown';
  el.quoteBlock.hidden = false;
}

function showLoading(isLoading) {
  el.loading.style.display = isLoading ? 'block' : 'none';
  el.quoteBlock.hidden = isLoading;
}

function showError(msg) {
  if (!msg) {
    el.error.hidden = true;
    el.error.textContent = '';
    return;
  }
  el.error.textContent = msg;
  el.error.hidden = false;
}

// Copy current quote text to clipboard
async function copyQuote() {
  const text = `${el.quoteText.textContent} ${el.quoteAuthor.textContent}`;
  if (!text.trim()) return;
  try {
    await navigator.clipboard.writeText(text);
    el.copyBtn.textContent = 'Copied!';
    setTimeout(() => (el.copyBtn.textContent = 'Copy'), 1500);
  } catch (err) {
    console.error('Clipboard error', err);
    showError('Copy failed. Your browser may not support clipboard.');
  }
}

// Open Twitter intent with the quote
function tweetQuote() {
  const text = `${el.quoteText.textContent} ${el.quoteAuthor.textContent}`;
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

// Event bindings
el.newBtn.addEventListener('click', fetchQuote);
el.copyBtn.addEventListener('click', copyQuote);
el.tweetBtn.addEventListener('click', tweetQuote);

// Load immediately
fetchQuote();