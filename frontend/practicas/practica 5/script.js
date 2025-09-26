document.addEventListener('DOMContentLoaded', function (){
  const form = document.getElementById('contactForm');
  const nameField = document.getElementById('name');
  const emailField = document.getElementById('email');
  const messageField = document.getElementById('message');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');
  const modal = document.getElementById('modal');
  const closeModal = document.getElementById('closeModal');
  const confettiContainer = document.getElementById('confetti-container');
  const subscribeBtn = document.getElementById('subscribeBtn');
  const subscribeInline = document.getElementById('subscribeInline');
  document.getElementById('year').textContent = new Date().getFullYear();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateName(){
    const val = nameField.value.trim();
    if(!val){ nameError.textContent = 'El nombre es obligatorio.'; return false; }
    nameError.textContent = ''; return true;
  }
  function validateEmail(){
    const val = emailField.value.trim();
    if(!val){ emailError.textContent = 'El email es obligatorio.'; return false; }
    if(!emailRegex.test(val)){ emailError.textContent = 'Formato de email inválido.'; return false; }
    emailError.textContent = ''; return true;
  }
  function validateMessage(){
    const val = messageField.value.trim();
    if(!val){ messageError.textContent = 'El mensaje no puede estar vacío.'; return false; }
    messageError.textContent = ''; return true;
  }

  nameField.addEventListener('input', validateName);
  emailField.addEventListener('input', validateEmail);
  messageField.addEventListener('input', validateMessage);

  form.addEventListener('submit', function(e){
    e.preventDefault();
    if(validateName() & validateEmail() & validateMessage()){
      openModalWithConfetti();
      form.reset();
    }
  });

  subscribeBtn.addEventListener('click', openModalWithConfetti);
  subscribeInline.addEventListener('click', openModalWithConfetti);
  closeModal.addEventListener('click', closeModalFunc);
  modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModalFunc(); });

  function openModalWithConfetti(){
    modal.setAttribute('aria-hidden','false');
    confettiContainer.innerHTML = '';
    const count = 12;
    for(let i=0;i<count;i++){
      const c = document.createElement('div');
      c.classList.add('confetti');
      const colors = ['#ff6b6b','#ffd166','#6bf5c3','#6b9bff','#b86bff'];
      c.style.background = colors[Math.floor(Math.random()*colors.length)];
      c.style.left = Math.random()*100 + '%';
      const duration = 3000 + Math.random()*2400;
      const delay = Math.random()*300;
      c.style.animationDuration = duration + 'ms';
      c.style.animationDelay = delay + 'ms';
      const w = 8 + Math.random()*10;
      const h = 12 + Math.random()*8;
      c.style.width = w + 'px';
      c.style.height = h + 'px';
      confettiContainer.appendChild(c);
      setTimeout(()=>{ if(c.parentNode) c.parentNode.removeChild(c); }, duration + delay + 400);
    }
  }
  function closeModalFunc(){
    modal.setAttribute('aria-hidden','true');
    confettiContainer.innerHTML = '';
  }
});
