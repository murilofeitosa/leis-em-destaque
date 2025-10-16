const INTERVALO_MILISSEGUNDOS = 30000; // 30 segundos
let leisImportantes = [];
let indiceAtual = 0;
let intervaloTimer;
let estaPausado = false;

// Elementos DOM
const tituloElemento = document.getElementById('lei-titulo');
const textoElemento = document.getElementById('lei-texto');
const linkElemento = document.getElementById('lei-link');
const cardElemento = document.getElementById('display-lei');
const progressBar = document.getElementById('progress-bar');
const btnPlayPause = document.getElementById('btn-play-pause');

// --- 1. Funções de Exibição e Navegação ---

function exibirLei(indice) {
    if (!leisImportantes.length) return;

    // Normaliza o índice (volta ao início ou fim da lista)
    indiceAtual = (indice + leisImportantes.length) % leisImportantes.length;
    const lei = leisImportantes[indiceAtual];
    
    // Efeito de transição suave
    cardElemento.style.opacity = 0;

    setTimeout(() => {
        // Atualiza o conteúdo
        tituloElemento.textContent = lei.titulo;
        textoElemento.textContent = lei.texto;
        linkElemento.href = lei.link;
        cardElemento.style.opacity = 1;
        
        // Reinicia a barra de progresso se não estiver pausado
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
    // Limpa qualquer timer existente
    if (intervaloTimer) clearInterval(intervaloTimer);
    
    // Inicia o timer e o progresso
    intervaloTimer = setInterval(proximaLei, INTERVALO_MILISSEGUNDOS);
    iniciarProgressBar();
    estaPausado = false;
    
    // Atualiza o botão para "Pausar" (vermelho)
    btnPlayPause.innerHTML = '<i class="fas fa-pause"></i> Pausar';
    btnPlayPause.classList.remove('play');
}

function pausarIntervalo() {
    clearInterval(intervaloTimer);
    estaPausado = true;
    
    // Pausa a animação da barra de progresso via CSS
    progressBar.style.width = getComputedStyle(progressBar).width; // Congela a largura atual
    progressBar.style.transition = 'none';
    
    // Atualiza o botão para "Continuar" (verde)
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
        tituloElemento.textContent = "Carregando...";
        
        // Faz a requisição ao novo arquivo JSON
        const response = await fetch('dados.json');
        leisImportantes = await response.json();
        
        if (leisImportantes.length > 0) {
            // Inicia o carrossel com o primeiro item
            exibirLei(0);
            iniciarIntervalo(); 
        } else {
            tituloElemento.textContent = "Erro: Lista de leis vazia.";
        }
    } catch (error) {
        console.error("Erro ao carregar os dados:", error);
        tituloElemento.textContent = "Erro ao carregar os dados.";
        textoElemento.textContent = "Verifique se o arquivo 'dados.json' existe e está formatado corretamente.";
        linkElemento.style.display = 'none'; // Esconde o link
    }
}

// --- 4. Event Listeners (Botões) ---

document.getElementById('btn-proximo').addEventListener('click', proximaLei);
document.getElementById('btn-anterior').addEventListener('click', leiAnterior);

btnPlayPause.addEventListener('click', () => {
    if (estaPausado) {
        iniciarIntervalo();
    } else {
        pausarIntervalo();
    }
});

// Inicializa o projeto
carregarDados();
