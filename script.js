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
  var body=document.getElementById('waBody'),demo=document.getElementById('waDemo');
  if(!body||!demo)return;
  var msgs=[
    {w:'bot',t:'¡Hola Marco! 👋 Soy tu recepcionista virtual. ¿En qué te puedo ayudar?'},
    {w:'user',t:'Quiero un turno para una limpieza dental mañana'},
    {w:'bot',t:'Perfecto, dejame revisar la disponibilidad…'},
    {w:'bot',t:'Tengo libres 09:45 · 10:30 · 11:15'},
    {w:'user',t:'10:30 me viene perfecto'},
    {w:'bot',t:'✅ Turno creado. Te espero el 24/04 a las 10:30.'}
  ];
  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function play(){
    if(reduced){
      msgs.forEach(function(m){
        var el=document.createElement('div');
        el.className='wa-msg '+m.w; el.textContent=m.t; body.appendChild(el);
      });
      return;
    }
    var i=0;
    function step(){
      if(i>=msgs.length)return;
      var m=msgs[i];
      var typ=document.createElement('div');
      typ.className='wa-typing'; typ.innerHTML='<i></i><i></i><i></i>';
      body.appendChild(typ); body.scrollTop=body.scrollHeight;
      setTimeout(function(){
        typ.remove();
        var el=document.createElement('div');
        el.className='wa-msg '+m.w; el.textContent=m.t; body.appendChild(el);
        body.scrollTop=body.scrollHeight;
        i++; setTimeout(step,i<msgs.length?450:0);
      },650+Math.random()*350);
    }
    step();
  }
  if(!('IntersectionObserver' in window)){play();}
  else{
    var played=false;
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting&&!played){played=true;play();io.disconnect();}
      });
    },{threshold:.5});
    io.observe(demo);
  }
})();
(function(){
  var cards=document.querySelectorAll('.pstack-card');
  if(!cards.length)return;
  if(!('IntersectionObserver' in window)){
    cards.forEach(function(c){c.classList.add('in')});
    return;
  }
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  },{threshold:.12,rootMargin:'0px 0px -8% 0px'});
  cards.forEach(function(c){io.observe(c)});
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
