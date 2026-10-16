const officerIdDialog = document.querySelector('#officerIdDialog');
const officerIdClose = document.querySelector('#officerIdClose');
const officerIdCard = document.querySelector('#officerIdCard');
const officerIdFlip = document.querySelector('#officerIdFlip');
const officerIdPhoto = document.querySelector('#officerIdPhoto');
const officerIdName = document.querySelector('#officerIdName');
const officerIdNumber = document.querySelector('#officerIdNumber');
const officerIdRole = document.querySelector('#officerIdRole');
const officerIdDob = document.querySelector('#officerIdDob');
const officerIdService = document.querySelector('#officerIdService');
const officerIdSignature = document.querySelector('#officerIdSignature');
const officerIdBackNumber = document.querySelector('#officerIdBackNumber');

function showOfficerFront() {
  officerIdCard.classList.remove('is-flipped');
  officerIdCard.setAttribute('aria-label', 'Officer government card front. Activate to turn it over.');
  document.querySelector('.officer-id-front').setAttribute('aria-hidden', 'false');
  document.querySelector('.officer-id-back').setAttribute('aria-hidden', 'true');
  officerIdFlip.querySelector('span').textContent = 'Turn card over';
}

function showOfficerBack() {
  officerIdCard.classList.add('is-flipped');
  officerIdCard.setAttribute('aria-label', 'Officer government card back. Activate to return to the front.');
  document.querySelector('.officer-id-front').setAttribute('aria-hidden', 'true');
  document.querySelector('.officer-id-back').setAttribute('aria-hidden', 'false');
  officerIdFlip.querySelector('span').textContent = 'Back to front';
}

function toggleOfficerCard() {
  if (officerIdCard.classList.contains('is-flipped')) showOfficerFront();
  else showOfficerBack();
}

function loadOfficerCard(profile) {
  const roleText = profile.querySelector('.officer-role')?.textContent.trim() || 'OFFICER';
  const roleParts = roleText.match(/^(\d+)\s*[·.]\s*(.+)$/);
  const officerNumber = roleParts?.[1] || '00';
  const role = roleParts?.[2] || roleText;
  const name = profile.querySelector('.officer-info h3')?.textContent.trim() || 'Officer name';
  const photo = profile.querySelector('.officer-photo img');
  const service = profile.querySelector('.officer-info p');

  officerIdName.textContent = name;
  officerIdNumber.textContent = `OFFICER ID · SG-${officerNumber}`;
  officerIdRole.textContent = role;
  officerIdDob.textContent = profile.dataset.dob || 'Add date of birth';
  officerIdService.textContent = service?.textContent.trim() || 'A promise to serve the St George section with care.';
  officerIdSignature.textContent = profile.dataset.signature || 'Add signature';
  officerIdBackNumber.textContent = `SG · ${officerNumber}`;
  officerIdPhoto.src = photo?.getAttribute('src') || 'photos/061a1b6c-5de7-44f4-b438-6c76773b02de.jfif';
  officerIdPhoto.alt = photo?.alt || `${name} officer portrait`;
  showOfficerFront();
}

document.querySelectorAll('.officer-review-open').forEach((button) => {
  button.addEventListener('click', () => {
    const profile = button.closest('.officer-card');
    if (!profile) return;
    loadOfficerCard(profile);
    officerIdDialog.showModal();
  });
});

officerIdClose.addEventListener('click', () => officerIdDialog.close());
officerIdFlip.addEventListener('click', toggleOfficerCard);
officerIdCard.addEventListener('click', toggleOfficerCard);
officerIdCard.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  toggleOfficerCard();
});

officerIdDialog.addEventListener('click', (event) => {
  if (event.target === officerIdDialog) officerIdDialog.close();
});
