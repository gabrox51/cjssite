// Filtro de produtos
document.addEventListener('DOMContentLoaded', function() {
    const filtros = document.querySelectorAll('.filtro');
    const produtos = document.querySelectorAll('.produto-card');

    filtros.forEach(filtro => {
        filtro.addEventListener('click', function() {
            // Remove active de todos
            filtros.forEach(f => f.classList.remove('active'));
            // Adiciona active no clicado
            this.classList.add('active');

            const categoria = this.dataset.filter;

            produtos.forEach(produto => {
                if (categoria === 'todos' || produto.dataset.category === categoria) {
                    produto.style.display = 'block';
                    produto.style.animation = 'fadeIn 0.5s ease';
                } else {
                    produto.style.display = 'none';
                }
            });
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    });

    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animação de entrada dos cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.produto-card, .diferencial-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Swipe nos carrosséis de produtos
    inicializarSwipeCarrosseis();

    // Swipe no lightbox
    inicializarSwipeLightbox();
});

// === SWIPE PARA CARROSSÉIS DE PRODUTOS ===
function inicializarSwipeCarrosseis() {
    document.querySelectorAll('.carrossel').forEach(function(carrossel) {
        var touchStartX = 0;
        var touchEndX = 0;
        var minSwipe = 40; // distância mínima em px para considerar swipe

        carrossel.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carrossel.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            var diff = touchStartX - touchEndX;

            if (Math.abs(diff) > minSwipe) {
                var slides = carrossel.querySelectorAll('.carrossel-slide');
                var dots = carrossel.querySelectorAll('.dot');
                var atual = 0;
                slides.forEach(function(s, i) { if (s.classList.contains('ativo')) atual = i; });

                var direcao = diff > 0 ? 1 : -1; // swipe esquerda = próximo, swipe direita = anterior

                slides[atual].classList.remove('ativo');
                dots[atual].classList.remove('ativo');
                atual = (atual + direcao + slides.length) % slides.length;
                slides[atual].classList.add('ativo');
                dots[atual].classList.add('ativo');
            }
        }, { passive: true });
    });
}

// === SWIPE PARA LIGHTBOX ===
function inicializarSwipeLightbox() {
    var lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    var touchStartX = 0;
    var touchEndX = 0;
    var minSwipe = 40;

    lightbox.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        var diff = touchStartX - touchEndX;

        if (Math.abs(diff) > minSwipe && lightboxImagens.length > 1) {
            var direcao = diff > 0 ? 1 : -1;
            lightboxNav(direcao);
        }
    }, { passive: true });
}

// Carrossel de imagens
function mudarSlide(btn, direcao) {
    event.stopPropagation();
    const carrossel = btn.closest('.carrossel');
    const slides = carrossel.querySelectorAll('.carrossel-slide');
    const dots = carrossel.querySelectorAll('.dot');
    let atual = 0;
    slides.forEach((s, i) => { if (s.classList.contains('ativo')) atual = i; });
    slides[atual].classList.remove('ativo');
    dots[atual].classList.remove('ativo');
    atual = (atual + direcao + slides.length) % slides.length;
    slides[atual].classList.add('ativo');
    dots[atual].classList.add('ativo');
}

function irParaSlide(dot, indice) {
    event.stopPropagation();
    const carrossel = dot.closest('.carrossel');
    const slides = carrossel.querySelectorAll('.carrossel-slide');
    const dots = carrossel.querySelectorAll('.dot');
    slides.forEach(s => s.classList.remove('ativo'));
    dots.forEach(d => d.classList.remove('ativo'));
    slides[indice].classList.add('ativo');
    dots[indice].classList.add('ativo');
}

// Lightbox - abrir e fechar imagem com carrossel
var lightboxImagens = [];
var lightboxIndice = 0;

function abrirImagem(src, alt) {
    var imgElement = event ? event.target : null;
    var lightbox = document.getElementById('lightbox');
    var img = document.getElementById('lightbox-img');
    var legenda = document.getElementById('lightbox-legenda');
    var btnPrev = document.getElementById('lightbox-prev');
    var btnNext = document.getElementById('lightbox-next');

    // Verificar se a imagem faz parte de um carrossel
    lightboxImagens = [];
    lightboxIndice = 0;

    if (imgElement) {
        var carrossel = imgElement.closest('.carrossel');
        if (carrossel) {
            var slides = carrossel.querySelectorAll('.carrossel-slide');
            slides.forEach(function(s, i) {
                lightboxImagens.push({ src: s.src, alt: s.alt });
                if (s.src === src) lightboxIndice = i;
            });
        }
    }

    // Se nao tem carrossel, so uma imagem
    if (lightboxImagens.length === 0) {
        lightboxImagens.push({ src: src, alt: alt });
        lightboxIndice = 0;
    }

    // Mostrar/esconder setas
    if (lightboxImagens.length > 1) {
        btnPrev.classList.add('visivel');
        btnNext.classList.add('visivel');
    } else {
        btnPrev.classList.remove('visivel');
        btnNext.classList.remove('visivel');
    }

    img.src = src;
    img.alt = alt;
    legenda.textContent = alt;
    lightbox.classList.add('ativo');
    document.body.style.overflow = 'hidden';
}

function lightboxNav(direcao) {
    if (lightboxImagens.length <= 1) return;
    lightboxIndice = (lightboxIndice + direcao + lightboxImagens.length) % lightboxImagens.length;
    var img = document.getElementById('lightbox-img');
    var legenda = document.getElementById('lightbox-legenda');
    img.src = lightboxImagens[lightboxIndice].src;
    img.alt = lightboxImagens[lightboxIndice].alt;
    legenda.textContent = lightboxImagens[lightboxIndice].alt;
}

function fecharImagem() {
    var lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('ativo');
        document.body.style.overflow = '';
        lightboxImagens = [];
        lightboxIndice = 0;
    }
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') fecharImagem();
    if (e.key === 'ArrowLeft') lightboxNav(-1);
    if (e.key === 'ArrowRight') lightboxNav(1);
});

// Adiciona keyframes para animação
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
