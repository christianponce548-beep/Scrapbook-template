const deliveryScene = document.querySelector('#delivery-scene');
const envelopeButton = document.querySelector('#open-letter');
const letterView = document.querySelector('#letter-view');
const letterTitle = document.querySelector('#letter-title');
const progressFill = document.querySelector('#reading-progress-fill');
const toast = document.querySelector('#toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2400);
}

envelopeButton.addEventListener('click', () => {
  if (deliveryScene.classList.contains('is-opening')) return;
  envelopeButton.disabled = true;
  deliveryScene.classList.add('is-opening');
  const openingDelay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 780;
  window.setTimeout(() => {
    deliveryScene.hidden = true;
    letterView.hidden = false;
    letterTitle.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateProgress();
  }, openingDelay);
});

const postscriptToggle = document.querySelector('#postscript-toggle');
const postscriptNote = document.querySelector('#postscript-note');
postscriptToggle.addEventListener('click', () => {
  const isOpen = postscriptToggle.getAttribute('aria-expanded') === 'true';
  postscriptToggle.setAttribute('aria-expanded', String(!isOpen));
  postscriptNote.hidden = isOpen;
});

const photoPicker = document.querySelector('#photo-picker');
const photoDropzone = document.querySelector('#photo-dropzone');
const photoWall = document.querySelector('#photo-wall');
const emptyDropzone = document.querySelector('#dropzone-empty');
const choosePhotos = document.querySelector('#choose-photos');
let addedPhotos = 0;

choosePhotos.addEventListener('click', (event) => {
  event.stopPropagation();
  photoPicker.click();
});
photoDropzone.addEventListener('click', (event) => {
  if (event.target.closest('button, input, .photo-card')) return;
  photoPicker.click();
});
photoDropzone.addEventListener('keydown', (event) => {
  if ((event.key === 'Enter' || event.key === ' ') && event.target === photoDropzone) {
    event.preventDefault();
    photoPicker.click();
  }
});
photoPicker.addEventListener('change', () => {
  addPhotos(photoPicker.files);
  photoPicker.value = '';
});

function addPhotos(files) {
  const images = [...files].filter((file) => file.type.startsWith('image/'));
  const room = 8 - addedPhotos;
  if (!room) {
    showToast('This little album is full — it holds up to 8 photos.');
    return;
  }
  images.slice(0, room).forEach((file) => {
    const card = document.createElement('figure');
    card.className = 'photo-card';
    card.style.setProperty('--tilt', `${(Math.random() * 3 - 1.5).toFixed(1)}deg`);
    const image = document.createElement('img');
    image.src = URL.createObjectURL(file);
    image.alt = file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ');
    const caption = document.createElement('input');
    caption.type = 'text';
    caption.maxLength = 60;
    caption.placeholder = 'Add a little caption…';
    caption.setAttribute('aria-label', `Caption for ${image.alt || 'photo'}`);
    const remove = document.createElement('button');
    remove.className = 'remove-photo';
    remove.type = 'button';
    remove.setAttribute('aria-label', `Remove ${image.alt || 'photo'}`);
    remove.textContent = '×';
    remove.addEventListener('click', () => {
      URL.revokeObjectURL(image.src);
      card.remove();
      addedPhotos -= 1;
      emptyDropzone.hidden = addedPhotos > 0;
    });
    card.append(image, caption, remove);
    photoWall.append(card);
    addedPhotos += 1;
  });
  emptyDropzone.hidden = addedPhotos > 0;
  if (images.length > room) showToast('The album is full now — it holds up to 8 photos.');
  else if (!images.length) showToast('Please choose image files for your memory album.');
  else showToast(`${images.length === 1 ? 'Photo' : 'Photos'} added to your letter.`);
}

['dragenter', 'dragover'].forEach((eventName) => {
  photoDropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    photoDropzone.classList.add('is-dragging');
  });
});
['dragleave', 'drop'].forEach((eventName) => {
  photoDropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    photoDropzone.classList.remove('is-dragging');
  });
});
photoDropzone.addEventListener('drop', (event) => addPhotos(event.dataTransfer.files));

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressFill.style.width = `${Math.min(100, Math.max(0, progress))}%`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);

document.querySelector('#copy-letter').addEventListener('click', async () => {
  const signature = document.querySelector('.letter-signoff .handwriting').textContent;
  const letterText = `Dear Adviser,\n\n${document.querySelector('#letter-copy').innerText}\n\nWith all our appreciation,\n${signature}`;
  try {
    await navigator.clipboard.writeText(letterText);
    showToast('The letter has been copied to your clipboard.');
  } catch {
    const temporary = document.createElement('textarea');
    temporary.value = letterText;
    temporary.style.position = 'fixed';
    temporary.style.opacity = '0';
    document.body.append(temporary);
    temporary.select();
    document.execCommand('copy');
    temporary.remove();
    showToast('The letter has been copied to your clipboard.');
  }
});

document.querySelector('#print-letter').addEventListener('click', () => window.print());

document.querySelector('#send-heart').addEventListener('click', () => {
  const colors = ['#d78884', '#a87793', '#eaa78f', '#c4a67b'];
  const burst = document.querySelector('#heart-burst');
  for (let index = 0; index < 12; index += 1) {
    const heart = document.createElement('span');
    heart.className = 'burst-heart';
    heart.textContent = index % 3 === 0 ? '✦' : '♥';
    heart.style.setProperty('--x', `${8 + Math.random() * 84}%`);
    heart.style.setProperty('--size', `${12 + Math.random() * 16}px`);
    heart.style.setProperty('--heart-color', colors[index % colors.length]);
    heart.addEventListener('animationend', () => heart.remove(), { once: true });
    burst.append(heart);
  }
  showToast('A little love is on its way. ♥');
});

document.querySelector('#letter-date').textContent = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date()).toUpperCase();
