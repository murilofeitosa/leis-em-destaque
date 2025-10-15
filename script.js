// A base de dados das Leis e Artigos importantes.
// Você pode adicionar quantos itens quiser aqui!
const leisImportantes = [
  {
    titulo: "Constituição Federal - Art. 5º, Caput (Direitos Fundamentais)",
    texto: "Todos são iguais perante a lei, sem distinção de qualquer natureza, garantindo-se aos brasileiros e aos estrangeiros residentes no País a inviolabilidade do direito à vida, à liberdade, à igualdade, à segurança e à propriedade...",
    link: "http://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm"
  },
  {
    titulo: "Constituição Federal - Art. 37 (Princípios da Administração Pública)",
    texto: "A administração pública direta e indireta de qualquer dos Poderes da União, dos Estados, do Distrito Federal e dos Municípios obedecerá aos princípios de legalidade, impessoalidade, moralidade, publicidade e eficiência e, também, ao seguinte: ...",
    link: "http://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm#art37"
  },
  {
    titulo: "Código Penal - Art. 121 (Homicídio)",
    texto: "Matar alguém: Pena - reclusão, de seis a vinte anos.",
    link: "http://www.planalto.gov.br/ccivil_03/decreto-lei/del2848compilado.htm"
  },
  {
    titulo: "CLT - Art. 7º, XIII (Jornada de Trabalho)",
    texto: "Duração do trabalho normal não superior a oito horas diárias e quarenta e quatro semanais, facultada a compensação de horários e a redução da jornada, mediante acordo ou convenção coletiva de trabalho.",
    link: "http://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm"
  },
  {
    titulo: "Código de Defesa do Consumidor - Art. 6º (Direitos Básicos do Consumidor)",
    texto: "São direitos básicos do consumidor: I - a proteção da vida, saúde e segurança contra os riscos provocados por práticas no fornecimento de produtos e serviços considerados perigosos ou nocivos; II - a educação e divulgação sobre o consumo adequado dos produtos e serviços, asseguradas a liberdade de escolha e a igualdade nas contratações; ...",
    link: "http://www.planalto.gov.br/ccivil_03/leis/l8078.htm"
  }
];

// Função para selecionar um item aleatório
function selecionarLeiAleatoria() {
  const indice = Math.floor(Math.random() * leisImportantes.length);
  return leisImportantes[indice];
}

// Função para atualizar a tela com a lei selecionada
function exibirLei() {
  const lei = selecionarLeiAleatoria();
  
  // Elementos HTML
  const tituloElemento = document.getElementById('lei-titulo');
  const textoElemento = document.getElementById('lei-texto');
  const linkElemento = document.getElementById('lei-link');
  const cardElemento = document.getElementById('display-lei');

  // Aplicar a classe de transição para o efeito visual de mudança
  cardElemento.style.opacity = 0;

  // Espera um momento (300ms) para a opacidade sumir antes de trocar o conteúdo
  setTimeout(() => {
    tituloElemento.textContent = lei.titulo;
    textoElemento.textContent = lei.texto;
    linkElemento.href = lei.link;
    
    // Faz o novo conteúdo aparecer
    cardElemento.style.opacity = 1;
  }, 300);
}

// 1. Executa a função imediatamente ao carregar
exibirLei();

// 2. Configura a execução periódica a cada 30 segundos (30000 milissegundos)
setInterval(exibirLei, 30000);
