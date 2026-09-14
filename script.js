(function(){
  var nav=document.querySelector('.nav'),hero=document.getElementById('hero');
  if(!nav||!hero||!('IntersectionObserver' in window))return;
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){ nav.classList.toggle('scrolled', !e.isIntersecting); });
  },{rootMargin:'-72px 0px 0px 0px',threshold:0});
  io.observe(hero);
})();
(function(){
  var items=document.querySelectorAll('.tlx li'),ents=document.querySelectorAll('.ent');
  if(!('IntersectionObserver' in window)||!ents.length)return;
  var io=new IntersectionObserver(function(l){
    l.forEach(function(en){
      if(!en.isIntersecting)return;
      var i=Array.prototype.indexOf.call(ents,en.target);
      items.forEach(function(li,j){li.classList.toggle('on',j===i)});
    });
  },{rootMargin:'-50% 0px -50% 0px'});
  ents.forEach(function(e){io.observe(e)});
})();
(function(){
  var form=document.getElementById('contactForm');
  if(!form)return;
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var nombre=document.getElementById('n').value.trim();
    var email=document.getElementById('e').value.trim();
    var msg=document.getElementById('m').value.trim();
    var subject='Contacto desde el portfolio - '+nombre;
    var body='Nombre: '+nombre+'\nEmail: '+email+'\n\n'+msg;
    window.location.href='mailto:ssimonmarconi@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  });
})();
(function(){
  var root=document.documentElement;
  var btn=document.getElementById('themeToggle');
  if(localStorage.getItem('theme')==='light') root.setAttribute('data-theme','light');
  if(!btn)return;
  btn.addEventListener('click',function(){
    var isLight=root.getAttribute('data-theme')==='light';
    if(isLight){ root.removeAttribute('data-theme'); localStorage.setItem('theme','dark'); }
    else{ root.setAttribute('data-theme','light'); localStorage.setItem('theme','light'); }
  });
})();
(function(){
  var root=document.documentElement;
  var toggle=document.getElementById('langToggle');
  function applyLang(lang){
    document.querySelectorAll('[data-en]').forEach(function(el){
      if(el.dataset.es===undefined) el.dataset.es=el.textContent;
      el.textContent = lang==='en' ? el.dataset.en : el.dataset.es;
    });
    document.querySelectorAll('[data-en-placeholder]').forEach(function(el){
      if(el.dataset.esPlaceholder===undefined) el.dataset.esPlaceholder=el.getAttribute('placeholder')||'';
      el.setAttribute('placeholder', lang==='en' ? el.dataset.enPlaceholder : el.dataset.esPlaceholder);
    });
    root.setAttribute('lang', lang);
    if(toggle) toggle.innerHTML = lang==='en' ? 'ES / <b>EN</b>' : '<b>ES</b> / EN';
    localStorage.setItem('lang', lang);
  }
  if(toggle){
    toggle.addEventListener('click',function(){
      applyLang(root.getAttribute('lang')==='en' ? 'es' : 'en');
    });
  }
  applyLang(localStorage.getItem('lang') || 'es');
})();
function openCert(imgId){
  var src=document.getElementById(imgId).getAttribute('src');
  document.getElementById('certModalImg').setAttribute('src',src);
  var m=document.getElementById('certModal');
  m.classList.add('open'); m.setAttribute('aria-hidden','false');
}
function closeCert(){
  var m=document.getElementById('certModal');
  m.classList.remove('open'); m.setAttribute('aria-hidden','true');
}
document.addEventListener('keydown',function(e){ if(e.key==='Escape') closeCert(); });
