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
    {w:'bot',t:'¡Hola Marco! 👋 Soy RecepIA, tu asistente virtual. ¿En qué te puedo ayudar?'},
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
  var canvas=document.getElementById('flowCanvas'),inner=document.getElementById('canvasInner'),
    svg=document.getElementById('canvasSvg'),hint=document.getElementById('canvasHint'),
    resetBtn=document.getElementById('canvasReset');
  if(!canvas||!inner||!svg)return;

  function drawConnectors(){
    var nodes=inner.querySelectorAll('.cn');
    if(!nodes.length)return;
    var innerRect=inner.getBoundingClientRect();
    var w=inner.scrollWidth,h=inner.clientHeight;
    svg.setAttribute('width',w); svg.setAttribute('height',h);
    var paths='';
    for(var i=0;i<nodes.length-1;i++){
      var a=nodes[i],b=nodes[i+1];
      var ra=a.getBoundingClientRect(),rb=b.getBoundingClientRect();
      var x1=ra.right-innerRect.left, y1=ra.top-innerRect.top+ra.height/2;
      var x2=rb.left-innerRect.left, y2=rb.top-innerRect.top+rb.height/2;
      var mx=(x1+x2)/2;
      var cls=b.classList.contains('live')?'live':(b.classList.contains('product')?'product':'');
      paths+='<path class="'+cls+'" d="M'+x1+','+y1+' C'+mx+','+y1+' '+mx+','+y2+' '+x2+','+y2+'"></path>';
    }
    svg.innerHTML=paths;
  }

  function hideHint(){ if(hint) hint.classList.add('hide'); }

  var isDown=false,startX=0,startScroll=0,moved=0;
  canvas.addEventListener('pointerdown',function(e){
    isDown=true; moved=0; startX=e.clientX; startScroll=canvas.scrollLeft;
    canvas.classList.add('grabbing');
    try{canvas.setPointerCapture(e.pointerId);}catch(err){}
  });
  canvas.addEventListener('pointermove',function(e){
    if(!isDown)return;
    var dx=e.clientX-startX;
    moved=Math.max(moved,Math.abs(dx));
    canvas.scrollLeft=startScroll-dx;
    hideHint();
  });
  ['pointerup','pointercancel','pointerleave'].forEach(function(ev){
    canvas.addEventListener(ev,function(){isDown=false;canvas.classList.remove('grabbing');});
  });
  canvas.addEventListener('click',function(e){
    if(moved>6){ e.preventDefault(); e.stopPropagation(); }
  },true);
  canvas.addEventListener('scroll',hideHint);

  if(resetBtn){
    resetBtn.addEventListener('click',function(){
      canvas.scrollTo({left:0,behavior:'smooth'});
    });
  }

  window.addEventListener('resize',drawConnectors);
  window.addEventListener('load',drawConnectors);
  setTimeout(drawConnectors,50);
  setTimeout(drawConnectors,400);
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
