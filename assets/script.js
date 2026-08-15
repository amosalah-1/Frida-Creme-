// Basic interactions: mobile menu, counters, carousel, lightbox, WhatsApp
document.addEventListener('DOMContentLoaded', function(){
  // Lucide icons init
  if(window.lucide) lucide.init();

  // AOS init (moved from inline)
  if(window.AOS) AOS.init({duration:600,once:true});

  // Mobile menu
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  mobileBtn?.addEventListener('click', ()=> mobileNav.classList.toggle('hidden'));

  // Counters when in viewport
  const counters = document.querySelectorAll('.counter');
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el = entry.target; const target = +el.dataset.target || 100;
        let n = 0; const step = Math.ceil(target/100);
        const t = setInterval(()=>{ n+=step; el.textContent = n>target?target:n; if(n>=target) clearInterval(t); }, 15);
        observer.unobserve(el);
      }
    });
  }, {threshold:0.4});
  counters.forEach(c=>observer.observe(c));

  // Testimonials simple carousel
  const track = document.querySelector('.carousel-items');
  if(track){
    let idx = 0; const items = track.children.length; const slide = ()=>{ idx = (idx+1)%items; const width = track.children[0].getBoundingClientRect().width; track.style.transform = `translateX(${-idx*width}px)`; };
    setInterval(slide, 4000);
    window.addEventListener('resize', ()=>{ track.style.transform = `translateX(${-idx*track.children[0].getBoundingClientRect().width}px)`; });
  }

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  document.querySelectorAll('[data-img]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const src = btn.getAttribute('data-img'); lightboxImg.src = src; lightbox.classList.add('show');
    });
  });
  document.getElementById('lightboxClose')?.addEventListener('click', ()=>{ lightbox.classList.remove('show'); lightboxImg.src=''; });
  lightbox?.addEventListener('click', (e)=>{ if(e.target===lightbox) { lightbox.classList.remove('show'); lightboxImg.src=''; } });

  // WhatsApp floating button
  const whatsappBtn = document.getElementById('floatingWhatsApp');
  const whatsappContactBtn = document.getElementById('whatsappBtn');
  const phone = '0117446801';
  const defaultMsg = encodeURIComponent('Hello, I found your website and I would like to know more about your services.');
  const waUrl = (num)=> `https://wa.me/${num.replace(/\D/g,'')}?text=${defaultMsg}`;
  whatsappBtn?.addEventListener('click', ()=>{ if(phone.includes('ENTER')) alert('Please update your WhatsApp number in the site files.'); else window.open(waUrl(phone),'_blank'); });
  whatsappContactBtn?.addEventListener('click', (e)=>{ e.preventDefault(); if(phone.includes('ENTER')) alert('Please update your WhatsApp number in the site files.'); else window.open(waUrl(phone),'_blank'); });

  // Contact form client-side validation and mailto fallback
  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', (e)=>{
    e.preventDefault(); const fd = new FormData(form); const data = Object.fromEntries(fd.entries());
    if(!data.name || !data.email || !data.phone){ alert('Please fill name, email and phone.'); return; }
    const body = `Name: ${data.name}%0APhone: ${data.phone}%0AEmail: ${data.email}%0AService: ${data.service}%0A%0AMessage:%0A${(data.message||'')}`;
    window.location.href = `mailto:${encodeURIComponent('[ENTER EMAIL]')}?subject=${encodeURIComponent('New contact from website')}&body=${body}`;
  });

  // Update year
  document.getElementById('year').textContent = new Date().getFullYear();
});
