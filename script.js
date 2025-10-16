const INTERVALO_MILISSEGUNDOS = 30000; // 30 segundos
let leisImportantes = [];
let indiceAtual = 0;
let intervaloTimer;
let estaPausado = false;

// Elementos DOM
const tituloElemento = document.getElementById('lei-titulo');
const textoElemento = document.getElementById('lei-texto');
const linkElemento = document.getElementById('lei-link');
const ramoElemento = document.getElementById('lei-ramo'); // Novo
const cardElemento = document.getElementById('display-lei');
const progressBar = document.getElementById('progress-bar');
const btnPlayPause = document.getElementById('btn-play-pause');
const btnAleatorio = document.getElementById('btn-aleatorio'); // Novo

// --- 1. Funções de Exibição e Navegação ---

function formatarRamo(ramo) {
    // Remove acentos e espaços para uso em classes CSS
    return 'ramo-' + ramo.toLowerCase().replace(/á/g, 'a').replace(/é/g, 'e').replace(/\s/g, '-');
}

function exibirLei(indice) {
    if (!leisImportantes.length) return;

    // Normaliza o índice (volta ao início ou fim da lista)
    indiceAtual = (indice + leisImportantes.length) % leisImportantes.length;
    const lei = leisImportantes[indiceAtual];
    
    // Efeito de transição suave
    cardElemento.style.opacity = 0;

    setTimeout(() => {
        // 1. Atualiza o Conteúdo
        tituloElemento.textContent = lei.titulo;
        textoElemento.textContent = lei.texto;
        linkElemento.href = lei.link;
        
        // 2. Atualiza Categoria (Ramo)
        ramoElemento.textContent = lei.ramo.toUpperCase();
        ramoElemento.className = 'lei-badge ' + formatarRamo(lei.ramo);

        // 3. Exibe o Card
        cardElemento.style.opacity = 1;
        
        // 4. (Futura Melhoria: Permalinks) Atualiza a URL com o ID
        history.pushState(null, '', `#${lei.id}`);

        // 5. Reinicia a barra de progresso se não estiver pausado
        if (!estaPausado) {
            iniciarProgressBar();
        }

    }, 300); // Tempo para a opacidade sumir
}

function proximaLei() {
    exibirLei(indiceAtual + 1);
    reiniciarIntervalo();
}

function leiAnterior() {
    exibirLei(indiceAtual - 1);
    reiniciarIntervalo();
}

function leiAleatoria() {
    // Garante que a lei atual não seja a mesma
    let novoIndice;
    do {
        novoIndice = Math.floor(Math.random() * leisImportantes.length);
    } while (novoIndice === indiceAtual && leisImportantes.length > 1);

    exibirLei(novoIndice);
    reiniciarIntervalo();
}


// --- 2. Controle do Timer e Pausa ---

function iniciarProgressBar() {
    // Reset o estado visual da barra
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    
    // Força o browser a aplicar o reset antes da próxima animação
    requestAnimationFrame(() => {
        progressBar.style.transition = `width ${INTERVALO_MILISSEGUNDOS / 1000}s linear`;
        progressBar.style.width = '100%';
    });
}

function iniciarIntervalo() {
    if (intervaloTimer) clearInterval(intervaloTimer);
    
    intervaloTimer = setInterval(proximaLei, INTERVALO_MILISSEGUNDOS);
    iniciarProgressBar();
    estaPausado = false;
    
    btnPlayPause.innerHTML = '<i class="fas fa-pause"></i> Pausar';
    btnPlayPause.classList.remove('play');
}

function pausarIntervalo() {
    clearInterval(intervaloTimer);
    estaPausado = true;
    
    // Congela a barra de progresso
    progressBar.style.width = getComputedStyle(progressBar).width; 
    progressBar.style.transition = 'none';
    
    btnPlayPause.innerHTML = '<i class="fas fa-play"></i> Continuar';
    btnPlayPause.classList.add('play');
}

function reiniciarIntervalo() {
    if (!estaPausado) {
        iniciarIntervalo();
    }
}

// --- 3. Carregamento dos Dados e Inicialização ---

async function carregarDados() {
    try {
        const response = await fetch('dados.json');
        leisImportantes = await response.json();
        
        if (leisImportantes.length > 0) {
            // Verifica se há um ID na URL para carregar uma lei específica
            const hashId = window.location.hash.substring(1);
            let indiceInicial = 0;

            if (hashId) {
                const indiceHash = leisImportantes.findIndex(lei => lei.id === hashId);
                if (indiceHash !== -1) {
                    indiceInicial = indiceHash;
                }
            }

            exibirLei(indiceInicial);
            iniciarIntervalo(); 
        } else {
            tituloElemento.textContent = "Erro: Lista de leis vazia.";
        }
    } catch (error) {
        console.error("Erro ao carregar os dados:", error);
        tituloElemento.textContent = "Erro ao carregar os dados.";
        textoElemento.textContent = "Verifique se o arquivo 'dados.json' existe e está formatado corretamente.";
        linkElemento.style.display = 'none'; 
    }
}

// --- 4. Event Listeners (Botões) ---

document.getElementById('btn-proximo').addEventListener('click', proximaLei);
document.getElementById('btn-anterior').addEventListener('click', leiAnterior);
document.getElementById('btn-aleatorio').addEventListener('click', leiAleatoria); // Novo

btnPlayPause.addEventListener('click', () => {
    if (estaPausado) {
        iniciarIntervalo();
    } else {
        pausarIntervalo();
    }
});

// Inicializa o projeto
carregarDados();
