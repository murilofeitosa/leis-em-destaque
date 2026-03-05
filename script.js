/* ========== CONFIGURAÇÃO E ESTADO ========== */
const CONFIG = {
    INTERVALO_MILISSEGUNDOS: 30000,
    ARQUIVO_DADOS: 'dados.json',
    STORAGE_KEY: 'leis-favoritas'
};

const STATE = {
    leisImportantes: [],
    indiceAtual: 0,
    intervaloTimer: null,
    estaPausado: false,
    favoritosLocais: []
};

/* ========== ELEMENTOS DOM ========== */
const DOM = {
    // Títulos e Textos
    titulo: document.getElementById('lei-titulo'),
    texto: document.getElementById('lei-texto'),
    ramo: document.getElementById('lei-ramo'),
    anoValor: document.getElementById('lei-ano-valor'),
    tipoValor: document.getElementById('lei-tipo-valor'),
    link: document.getElementById('lei-link'),
    
    // Card e Containers
    card: document.getElementById('display-lei'),
    counter: document.getElementById('lei-counter'),
    
    // Barra de progresso
    progressBar: document.getElementById('progress-bar'),
    progressContainer: document.getElementById('progress-bar-container'),
    
    // Botões principais
    btnProximo: document.getElementById('btn-proximo'),
    btnAnterior: document.getElementById('btn-anterior'),
    btnAleatorio: document.getElementById('btn-aleatorio'),
    btnPlayPause: document.getElementById('btn-play-pause'),
    btnBookmark: document.getElementById('btn-bookmark'),
    btnCopy: document.getElementById('btn-copy'),
    btnLista: document.getElementById('btn-lista'),
    btnSettings: document.getElementById('btn-settings'),
    
    // Toast notification
    toast: document.getElementById('toast-notification'),
    toastMessage: document.getElementById('toast-message'),
    
    // Textos dinâmicos
    playPauseText: document.getElementById('play-pause-text')
};

/* ========== INICIALIZAÇÃO ========== */
document.addEventListener('DOMContentLoaded', () => {
    carregarDados();
    carregarFavoritos();
    configurarEventListeners();
});

/* ========== FUNÇÕES DE DADOS ========== */
async function carregarDados() {
    try {
        const response = await fetch(CONFIG.ARQUIVO_DADOS);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        STATE.leisImportantes = await response.json();
        
        if (!Array.isArray(STATE.leisImportantes) || STATE.leisImportantes.length === 0) {
            mostrarErro('Erro: Lista de leis vazia ou formato inválido.');
            return;
        }
        
        // Verifica se há um ID na URL para carregar uma lei específica
        const hashId = window.location.hash.substring(1);
        let indiceInicial = 0;
        
        if (hashId) {
            const indiceHash = STATE.leisImportantes.findIndex(lei => lei.id === hashId);
            if (indiceHash !== -1) {
                indiceInicial = indiceHash;
            }
        }
        
        exibirLei(indiceInicial);
        iniciarIntervalo();
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        mostrarErro('Erro ao carregar os dados. Verifique o arquivo "dados.json".');
    }
}

function carregarFavoritos() {
    try {
        const favoritos = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (favoritos) {
            STATE.favoritosLocais = JSON.parse(favoritos);
        }
    } catch (error) {
        console.warn('Erro ao carregar favoritos:', error);
        STATE.favoritosLocais = [];
    }
}

function salvarFavoritos() {
    try {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(STATE.favoritosLocais));
    } catch (error) {
        console.warn('Erro ao salvar favoritos:', error);
    }
}

/* ========== FUNÇÕES DE EXIBIÇÃO ========== */
function formatarRamo(ramo) {
    return 'ramo-' + ramo.toLowerCase()
        .replace(/á/g, 'a')
        .replace(/é/g, 'e')
        .replace(/ã/g, 'a')
        .replace(/ô/g, 'o')
        .replace(/\s+/g, '-')
        .trim();
}

function exibirLei(indice) {
    if (!STATE.leisImportantes.length) return;
    
    // Normaliza o índice
    STATE.indiceAtual = (indice + STATE.leisImportantes.length) % STATE.leisImportantes.length;
    const lei = STATE.leisImportantes[STATE.indiceAtual];
    
    // Efeito de transição suave
    DOM.card.style.opacity = '0';
    
    setTimeout(() => {
        // Atualiza conteúdo principal
        DOM.titulo.textContent = lei.titulo;
        DOM.texto.textContent = lei.texto;
        DOM.link.href = lei.link;
        DOM.ramo.textContent = lei.ramo.toUpperCase();
        DOM.ramo.className = 'lei-badge-premium ' + formatarRamo(lei.ramo);
        
        // Atualiza metadata
        if (lei.ano) {
            DOM.anoValor.textContent = lei.ano;
        } else {
            DOM.anoValor.textContent = '—';
        }
        
        if (lei.tipo) {
            DOM.tipoValor.textContent = lei.tipo;
        } else {
            DOM.tipoValor.textContent = '—';
        }
        
        // Atualiza contador
        const numeroLei = STATE.indiceAtual + 1;
        DOM.counter.textContent = `Lei ${numeroLei} de ${STATE.leisImportantes.length}`;
        
        // Atualiza botão de favorito
        atualizarEstadoBookmark();
        
        // Exibe o card
        DOM.card.style.opacity = '1';
        
        // Atualiza URL com permalink
        history.pushState(null, '', `#${lei.id}`);
        
        // Reinicia a barra de progresso se não estiver pausado
        if (!STATE.estaPausado) {
            iniciarProgressBar();
        }
        
    }, 300);
}

function atualizarEstadoBookmark() {
    const isFavorito = STATE.favoritosLocais.includes(STATE.leisImportantes[STATE.indiceAtual].id);
    
    if (isFavorito) {
        DOM.btnBookmark.classList.add('active');
        DOM.btnBookmark.innerHTML = '<i class="fas fa-bookmark"></i>';
    } else {
        DOM.btnBookmark.classList.remove('active');
        DOM.btnBookmark.innerHTML = '<i class="far fa-bookmark"></i>';
    }
}

/* ========== FUNÇÕES DE NAVEGAÇÃO ========== */
function proximaLei() {
    exibirLei(STATE.indiceAtual + 1);
    reiniciarIntervalo();
}

function leiAnterior() {
    exibirLei(STATE.indiceAtual - 1);
    reiniciarIntervalo();
}

function leiAleatoria() {
    let novoIndice;
    do {
        novoIndice = Math.floor(Math.random() * STATE.leisImportantes.length);
    } while (novoIndice === STATE.indiceAtual && STATE.leisImportantes.length > 1);
    
    exibirLei(novoIndice);
    reiniciarIntervalo();
}

/* ========== FUNÇÕES DE TIMER E PROGRESSO ========== */
function iniciarProgressBar() {
    DOM.progressBar.style.transition = 'none';
    DOM.progressBar.style.width = '0%';
    
    requestAnimationFrame(() => {
        DOM.progressBar.style.transition = `width ${CONFIG.INTERVALO_MILISSEGUNDOS / 1000}s linear`;
        DOM.progressBar.style.width = '100%';
    });
}

function iniciarIntervalo() {
    if (STATE.intervaloTimer) clearInterval(STATE.intervaloTimer);
    
    STATE.intervaloTimer = setInterval(proximaLei, CONFIG.INTERVALO_MILISSEGUNDOS);
    iniciarProgressBar();
    STATE.estaPausado = false;
    
    DOM.btnPlayPause.innerHTML = '<i class="fas fa-pause"></i>';
    DOM.playPauseText.textContent = 'Pausar';
    DOM.btnPlayPause.classList.remove('paused');
}

function pausarIntervalo() {
    clearInterval(STATE.intervaloTimer);
    STATE.estaPausado = true;
    
    // Congela a barra de progresso
    DOM.progressBar.style.width = getComputedStyle(DOM.progressBar).width;
    DOM.progressBar.style.transition = 'none';
    
    DOM.btnPlayPause.innerHTML = '<i class="fas fa-play"></i>';
    DOM.playPauseText.textContent = 'Continuar';
    DOM.btnPlayPause.classList.add('paused');
}

function reiniciarIntervalo() {
    if (!STATE.estaPausado) {
        iniciarIntervalo();
    }
}

/* ========== FUNÇÕES AUXILIARES ========== */
function mostrarErro(mensagem) {
    DOM.titulo.textContent = 'Erro';
    DOM.texto.textContent = mensagem;
    DOM.link.style.display = 'none';
}

function copiarTexto() {
    const textoCopia = `${STATE.leisImportantes[STATE.indiceAtual].titulo}\n\n${DOM.texto.textContent}\n\nLeia na íntegra: ${DOM.link.href}`;
    
    navigator.clipboard.writeText(textoCopia).then(() => {
        mostrarToast('Texto copiado com sucesso!');
    }).catch(err => {
        console.error('Erro ao copiar:', err);
        mostrarToast('Erro ao copiar o texto.', 'error');
    });
}

function mostrarToast(mensagem, tipo = 'success') {
    DOM.toastMessage.textContent = mensagem;
    DOM.toast.classList.add('show');
    
    setTimeout(() => {
        DOM.toast.classList.remove('show');
    }, 3000);
}

function alternarFavorito() {
    const lei = STATE.leisImportantes[STATE.indiceAtual];
    const indice = STATE.favoritosLocais.indexOf(lei.id);
    
    if (indice > -1) {
        // Remove dos favoritos
        STATE.favoritosLocais.splice(indice, 1);
        mostrarToast('Removido dos favoritos');
    } else {
        // Adiciona aos favoritos
        STATE.favoritosLocais.push(lei.id);
        mostrarToast('Adicionado aos favoritos!');
    }
    
    salvarFavoritos();
    atualizarEstadoBookmark();
}

/* ========== CONFIGURAÇÃO DE EVENT LISTENERS ========== */
function configurarEventListeners() {
    // Navegação principal
    DOM.btnProximo.addEventListener('click', proximaLei);
    DOM.btnAnterior.addEventListener('click', leiAnterior);
    DOM.btnAleatorio.addEventListener('click', leiAleatoria);
    
    // Play/Pause
    DOM.btnPlayPause.addEventListener('click', () => {
        if (STATE.estaPausado) {
            iniciarIntervalo();
        } else {
            pausarIntervalo();
        }
    });
    
    // Favoritos e Cópia
    DOM.btnBookmark.addEventListener('click', alternarFavorito);
    DOM.btnCopy.addEventListener('click', copiarTexto);
    
    // Botões secundários
    DOM.btnLista.addEventListener('click', mostrarLista);
    DOM.btnSettings.addEventListener('click', mostrarConfigurações);
    
    // Atalhos de teclado
    document.addEventListener('keydown', (e) => {
        if (e.code === 'ArrowRight') {
            proximaLei();
        } else if (e.code === 'ArrowLeft') {
            leiAnterior();
        } else if (e.code === 'Space' && e.target.tagName !== 'BUTTON') {
            e.preventDefault();
            STATE.estaPausado ? iniciarIntervalo() : pausarIntervalo();
        }
    });
}

/* ========== FUNÇÕES FUTURAS ========== */
function mostrarLista() {
    console.log('Funcionalidade "Lista Completa" em desenvolvimento');
    mostrarToast('Lista completa em desenvolvimento', 'info');
}

function mostrarConfigurações() {
    console.log('Funcionalidade "Configurações" em desenvolvimento');
    mostrarToast('Configurações em desenvolvimento', 'info');
}

/* ========== MELHORIAS ADICIONAIS ========== */
// Detecta visibilidade da página
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (!STATE.estaPausado) {
            pausarIntervalo();
        }
    }
});
