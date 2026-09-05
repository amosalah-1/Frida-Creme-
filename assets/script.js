// Basic interactions: mobile menu, counters, carousel, lightbox, WhatsApp, newsletter
document.addEventListener('DOMContentLoaded', function(){
  // Lucide icons init
  if(window.lucide) lucide.init();

  // AOS init - ensure content is visible even if AOS fails
  try {
    if(window.AOS) {
      AOS.init({duration:600,once:true});
    } else {
      // Fallback: make all data-aos elements visible immediately
      document.querySelectorAll('[data-aos]').forEach(el => {
        el.style.opacity = '1';
      });
    }
  } catch(e) {
    console.log('AOS initialization failed, elements will still be visible');
    document.querySelectorAll('[data-aos]').forEach(el => {
      el.style.opacity = '1';
    });
  }

  // Mobile menu
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');

  const toggleMobileMenu = () => {
    if (!mobileNav || !mobileBtn) return;

    const isOpen = !mobileNav.classList.contains('hidden');
    if (isOpen) {
      mobileNav.classList.add('hidden');
      mobileNav.classList.remove('max-h-96', 'opacity-100');
      mobileNav.classList.add('max-h-0', 'opacity-0');
      mobileBtn.setAttribute('aria-expanded', 'false');
      return;
    }

    mobileNav.classList.remove('hidden');
    requestAnimationFrame(() => {
      mobileNav.classList.remove('max-h-0', 'opacity-0');
      mobileNav.classList.add('max-h-96', 'opacity-100');
    });

    mobileBtn.setAttribute('aria-expanded', 'true');
  };

  mobileBtn?.addEventListener('click', toggleMobileMenu);
  mobileNav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.add('hidden');
      mobileNav.classList.remove('max-h-96', 'opacity-100');
      mobileNav.classList.add('max-h-0', 'opacity-0');
      mobileBtn.setAttribute('aria-expanded', 'false');
    });
  });

  window.addEventListener('scroll', () => {
    if (mobileNav && !mobileNav.classList.contains('hidden')) {
      mobileNav.classList.remove('hidden');
      mobileNav.classList.remove('max-h-0', 'opacity-0');
      mobileNav.classList.add('max-h-96', 'opacity-100');
    }
  }, { passive: true });

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
  const phone = '+254117446801';
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
    window.location.href = `mailto:${encodeURIComponent('fridahcremebales@gmail.com')}?subject=${encodeURIComponent('New contact from website')}&body=${body}`;
  });

  // Newsletter signup
  window.handleNewsletterSignup = function(e) {
    e.preventDefault();
    const email = document.querySelector('#newsletterForm input[name="email"]').value;
    alert('Thank you for subscribing! Check your email for confirmations and offers.');
    document.getElementById('newsletterForm').reset();
    // In production, send this to your backend/email service
    return false;
  };
  });

  // Update year
  document.getElementById('year').textContent = new Date().getFullYear();
});
