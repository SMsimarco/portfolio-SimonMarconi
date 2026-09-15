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
  var WEB3FORMS_KEY='bfb6b7dc-a252-4226-a91d-0be83a3974c0';
  var form=document.getElementById('contactForm');
  if(!form)return;
  var status=document.getElementById('formStatus');
  function isEn(){ return document.documentElement.getAttribute('lang')==='en'; }
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var nombre=document.getElementById('n').value.trim();
    var email=document.getElementById('e').value.trim();
    var msg=document.getElementById('m').value.trim();
    var btn=form.querySelector('button[type="submit"]');
    var original=btn.textContent;
    btn.disabled=true; btn.textContent=isEn()?'Sending…':'Enviando…';
    if(status){ status.textContent=''; status.className='form-status'; }
    fetch('https://api.web3forms.com/submit',{
      method:'POST',
      headers:{'Content-Type':'application/json',Accept:'application/json'},
      body:JSON.stringify({
        access_key:WEB3FORMS_KEY,
        subject:'Contacto desde el portfolio - '+nombre,
        name:nombre,
        email:email,
        message:msg
      })
    }).then(function(r){ return r.json(); }).then(function(data){
      btn.disabled=false; btn.textContent=original;
      if(!data.success) throw new Error(data.message||'error');
      form.reset();
      if(status){
        status.textContent=isEn()?"Message sent — I'll get back to you soon.":'Mensaje enviado, te respondo a la brevedad.';
        status.className='form-status ok';
      }
    }).catch(function(){
      btn.disabled=false; btn.textContent=original;
      if(status){
        status.textContent=isEn()?'Something went wrong — email me directly instead.':'Algo falló al enviar. Escribime directo por mail.';
        status.className='form-status err';
      }
    });
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
    document.querySelectorAll('[data-en-href]').forEach(function(el){
      if(el.dataset.esHref===undefined) el.dataset.esHref=el.getAttribute('href')||'';
      el.setAttribute('href', lang==='en' ? el.dataset.enHref : el.dataset.esHref);
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
(function(){
  var btn=document.getElementById('navToggle'),menu=document.getElementById('mobileMenu');
  if(!btn||!menu)return;
  function close(){ btn.setAttribute('aria-expanded','false'); menu.classList.remove('open'); }
  function open(){ btn.setAttribute('aria-expanded','true'); menu.classList.add('open'); }
  btn.addEventListener('click',function(){
    (btn.getAttribute('aria-expanded')==='true') ? close() : open();
  });
  menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click',close); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') close(); });
  document.addEventListener('click',function(e){
    if(menu.classList.contains('open') && !menu.contains(e.target) && e.target!==btn && !btn.contains(e.target)) close();
  });
})();
(function(){
  var toggles=document.querySelectorAll('.cv-toggle');
  if(!toggles.length)return;
  function closeAll(){
    toggles.forEach(function(b){ b.setAttribute('aria-expanded','false'); b.nextElementSibling.classList.remove('open'); });
  }
  toggles.forEach(function(btn){
    var menu=btn.nextElementSibling;
    btn.addEventListener('click',function(e){
      e.stopPropagation();
      var isOpen=btn.getAttribute('aria-expanded')==='true';
      closeAll();
      if(!isOpen){ btn.setAttribute('aria-expanded','true'); menu.classList.add('open'); }
    });
  });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') closeAll(); });
  document.addEventListener('click',function(e){
    if(!e.target.closest('.cv-item')) closeAll();
  });
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
