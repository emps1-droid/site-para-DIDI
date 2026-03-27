document.addEventListener('DOMContentLoaded', () => {
    const mainPage = document.getElementById('main-page');
    const secretPage = document.getElementById('secret-page');
    const webButton = document.getElementById('web-button');
    const nextPageBtn = document.getElementById('next-page-btn');
    const backBtn = document.getElementById('back-btn');
    const canvas = document.getElementById('spider-canvas');
    const ctx = canvas.getContext('2d');

    let isAnimating = false;

    // Ajustar tamanho do canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Navegação
    nextPageBtn.addEventListener('click', () => {
        mainPage.classList.add('hidden');
        secretPage.classList.remove('hidden');
    });

    backBtn.addEventListener('click', () => {
        secretPage.classList.add('hidden');
        mainPage.classList.remove('hidden');
    });

    // Efeito de Teia de Aranha - Versão Otimizada
    webButton.addEventListener('click', () => {
        if (isAnimating) return; // Evita múltiplas animações ao mesmo tempo
        
        isAnimating = true;
        webButton.disabled = true;

        const webs = [];
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const numWebs = 12;
        let animationFrame = null;
        let startTime = Date.now();
        const duration = 1000; // 1 segundo para desenhar as teias

        // Criar pontos para as teias
        for (let i = 0; i < numWebs; i++) {
            webs.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                angle: (i / numWebs) * Math.PI * 2
            });
        }

        function drawWebs() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.8 * (1 - progress * 0.3)})`;
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // Desenhar as linhas das teias
            webs.forEach(web => {
                ctx.beginPath();
                ctx.moveTo(web.x, web.y);
                
                // Calcular ponto final interpolado
                const currentX = web.x + (centerX - web.x) * progress;
                const currentY = web.y + (centerY - web.y) * progress;
                
                ctx.lineTo(currentX, currentY);
                ctx.stroke();
            });

            // Desenhar círculos concêntricos para efeito de teia
            if (progress > 0.3) {
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 * (1 - progress)})`;
                for (let i = 1; i <= 4; i++) {
                    const radius = (progress * 200) - (i * 40);
                    if (radius > 0) {
                        ctx.beginPath();
                        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                }
            }

            if (progress < 1) {
                animationFrame = requestAnimationFrame(drawWebs);
            } else {
                // Iniciar desaparecimento
                fadeOut();
            }
        }

        function fadeOut() {
            let opacity = 0.8;
            const fadeInterval = setInterval(() => {
                opacity -= 0.1;
                
                if (opacity <= 0) {
                    clearInterval(fadeInterval);
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    isAnimating = false;
                    webButton.disabled = false;
                } else {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.lineWidth = 2;
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';

                    // Redesenhar as teias com opacidade menor
                    webs.forEach(web => {
                        ctx.beginPath();
                        ctx.moveTo(web.x, web.y);
                        ctx.lineTo(centerX, centerY);
                        ctx.stroke();
                    });

                    // Desenhar círculos
                    for (let i = 1; i <= 4; i++) {
                        const radius = 200 - (i * 40);
                        if (radius > 0) {
                            ctx.beginPath();
                            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                            ctx.stroke();
                        }
                    }
                }
            }, 100);
        }

        drawWebs();
    });
});