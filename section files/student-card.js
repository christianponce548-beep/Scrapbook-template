const reviewDialog = document.querySelector('#studentCardDialog');
const closeReviewButton = document.querySelector('#studentCardClose');
const reviewCard = document.querySelector('#studentReviewCard');
const flipButton = document.querySelector('#studentCardFlip');
const reviewPhoto = document.querySelector('#studentReviewPhoto');
const reviewNumber = document.querySelector('#studentReviewNumber');
const reviewName = document.querySelector('#studentReviewName');
const reviewDob = document.querySelector('#studentReviewDob');
const reviewQuote = document.querySelector('#studentReviewQuote');
const reviewSignature = document.querySelector('#studentReviewSignature');

function showFront() {
  reviewCard.classList.remove('is-flipped');
  reviewCard.setAttribute('aria-label', 'Student ID front. Activate to turn it over.');
  document.querySelector('.student-review-front').setAttribute('aria-hidden', 'false');
  document.querySelector('.student-review-back').setAttribute('aria-hidden', 'true');
  flipButton.querySelector('span').textContent = 'Turn over';
}

function showBack() {
  reviewCard.classList.add('is-flipped');
  reviewCard.setAttribute('aria-label', 'Student ID back. Activate to return to the front.');
  document.querySelector('.student-review-front').setAttribute('aria-hidden', 'true');
  document.querySelector('.student-review-back').setAttribute('aria-hidden', 'false');
  flipButton.querySelector('span').textContent = 'Back to front';
}

function toggleCardSide() {
  if (reviewCard.classList.contains('is-flipped')) showFront();
  else showBack();
}

function renderStudent(entry) {
  const number = entry.querySelector('.student-number')?.textContent.trim() || 'STUDENT';
  const name = entry.querySelector('.student-info h3')?.textContent.trim() || 'Student name';
  const photo = entry.querySelector('.student-photo img');
  const quote = entry.querySelector('.student-info blockquote');

  reviewNumber.textContent = number;
  reviewName.textContent = name;
  reviewDob.textContent = entry.dataset.dob || 'Add date of birth';
  reviewQuote.textContent = quote?.textContent.trim() || 'Add a quote they love here.';
  reviewSignature.textContent = entry.dataset.signature || 'Add signature';
  reviewPhoto.src = photo?.getAttribute('src') || 'photos/061a1b6c-5de7-44f4-b438-6c76773b02de.jfif';
  reviewPhoto.alt = photo?.alt || `${name} portrait`;
  showFront();
}

document.querySelectorAll('.student-review-open').forEach((button) => {
  button.addEventListener('click', () => {
    const entry = button.closest('.student-card');
    if (!entry) return;
    renderStudent(entry);
    reviewDialog.showModal();
  });
});

closeReviewButton.addEventListener('click', () => reviewDialog.close());
flipButton.addEventListener('click', toggleCardSide);
reviewCard.addEventListener('click', toggleCardSide);
reviewCard.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  toggleCardSide();
});

reviewDialog.addEventListener('click', (event) => {
  if (event.target === reviewDialog) reviewDialog.close();
});
