// Cambiar entre pestañas Lunes/Viernes
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// Desplegar info de RIR y detalles de ejercicio
document.getElementById('toggle-rir').addEventListener('click', () => {
  document.getElementById('content-rir').classList.toggle('hidden');
});

document.querySelectorAll('.details-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const details = btn.nextElementSibling;
    details.classList.toggle('hidden');
  });
});

// Temporizador de descanso
let timerInterval;

function completeSet(btn, seconds) {
  btn.classList.toggle('done');
  
  if (btn.classList.contains('done')) {
    startTimer(seconds);
  }
  saveData();
}

function startTimer(seconds) {
  clearInterval(timerInterval);
  const timerBar = document.getElementById('timer-bar');
  const timerDisplay = document.getElementById('timer-display');
  
  timerBar.classList.remove('hidden');
  let timeLeft = seconds;

  function updateDisplay() {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    timerDisplay.textContent = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }

  updateDisplay();

  timerInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft >= 0) {
      updateDisplay();
    } else {
      clearInterval(timerInterval);
      timerBar.classList.add('hidden');
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    }
  }, 1000);
}

document.getElementById('timer-cancel').addEventListener('click', () => {
  clearInterval(timerInterval);
  document.getElementById('timer-bar').classList.add('hidden');
});

// Guardar y cargar datos en el teléfono
function saveData() {
  const data = {};
  document.querySelectorAll('.exercise-card').forEach(card => {
    const id = card.dataset.id;
    const weight = card.querySelector('.input-weight')?.value || '';
    const reps = card.querySelector('.input-reps')?.value || '';
    const sets = Array.from(card.querySelectorAll('.btn-check')).map(b => b.classList.contains('done'));
    data[id] = { weight, reps, sets };
  });
  localStorage.setItem('gym_routine_data', JSON.stringify(data));
}

function loadData() {
  const saved = localStorage.getItem('gym_routine_data');
  if (!saved) return;
  const data = JSON.parse(saved);

  document.querySelectorAll('.exercise-card').forEach(card => {
    const id = card.dataset.id;
    if (data[id]) {
      if (card.querySelector('.input-weight')) card.querySelector('.input-weight').value = data[id].weight;
      if (card.querySelector('.input-reps')) card.querySelector('.input-reps').value = data[id].reps;
      
      const btns = card.querySelectorAll('.btn-check');
      data[id].sets.forEach((isDone, index) => {
        if (isDone && btns[index]) btns[index].classList.add('done');
      });
    }
  });
}

document.querySelectorAll('input').forEach(input => input.addEventListener('input', saveData));
window.addEventListener('DOMContentLoaded', loadData);