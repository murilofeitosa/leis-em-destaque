# 🏛️ Jurisprudência em Destaque - Versão 2.0

## 📸 Destaque do Redesenho

Este projeto foi completamente redesenhado com:
- ✨ **Design Premium** com gradientes sofisticados e animações fluidas
- 🎨 **Paleta Jurídica** elegante com azul profissional e ouro
- 📱 **Responsividade Total** para desktop, tablet e mobile
- ⌨️ **Atalhos de Teclado** para navegação rápida
- ❤️ **Sistema de Favoritos** com persistência local
- 📋 **Novo Layout** moderno e intuitivo
- ⚡ **Performance Otimizada** com CSS Variables e estado organizado

---

## 🚀 Como Usar

### Instalação Rápida
1. Baixe todos os arquivos (mantendo a mesma pasta)
2. Coloque em um servidor web ou GitHub Pages
3. Acesse via navegador

### Estrutura de Arquivos
```
seu-projeto/
├── index.html          # Estrutura HTML
├── style.css           # Estilos (14.7 KB)
├── script.js           # Lógica JavaScript
├── dados.json          # Base de dados de leis
└── README.md           # Este arquivo
```

### Requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Servidor web (não funciona com `file://`)
- Nenhuma dependência externa (vanilla JS)

---

## 🎯 Funcionalidades

### ✅ Navegação
- **Botão Próximo/Anterior**: Navega entre leis
- **Aleatório**: Mostra uma lei aleatória
- **Play/Pause**: Controla rotação automática (30s)
- **Atalhos de Teclado**:
  - `→` Próxima lei
  - `←` Lei anterior
  - `Espaço` Pausar/Retomar

### ❤️ Favoritos
- Clique no ícone de bookmark para salvar leis
- Favoritos são salvos localmente no navegador
- Acesso rápido às leis importantes

### 📋 Utilitários
- **Copiar**: Copia lei formatada para área de transferência
- **Link Planalto**: Acessa texto integral no Planalto
- **Contador**: Mostra qual lei você está vendo
- **Barra de Progresso**: Indica tempo até próxima lei

### 📱 Responsividade
- Desktop: Interface completa
- Tablet: Otimizado para 768px
- Mobile: Ícones sem texto, botões maiores

---

## 🎨 Customização

### Mudar Cores
Edite as variáveis CSS em `style.css`:

```css
:root {
    --color-accent: #0f4c7a;        /* Azul principal */
    --color-accent-light: #1e88d5;  /* Azul claro */
    --color-gold: #d4af37;          /* Ouro/destaque */
    --color-dark: #1a1a2e;          /* Fundo escuro */
    /* ... mais variáveis */
}
```

### Mudar Intervalo
Em `script.js`, altere:
```javascript
const CONFIG = {
    INTERVALO_MILISSEGUNDOS: 30000  // Mude para 20000 = 20 segundos
};
```

### Adicionar Novas Leis
Edite `dados.json` mantendo a estrutura:
```json
[
  {
    "id": "sua-lei-id",
    "titulo": "Título da Lei",
    "texto": "Texto integral...",
    "ramo": "Ramo Jurídico",
    "link": "https://www.planalto.gov.br/...",
    "ano": "2024",
    "tipo": "Lei"
  }
]
```

### Adicionar Novo Ramo
No CSS, adicione:
```css
.ramo-seu-ramo {
    background: linear-gradient(135deg, #cor1, #cor2) !important;
}
```

---

## 🎯 Estrutura de Dados (dados.json)

### Campos Obrigatórios
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string | Identificador único (sem espaços) |
| `titulo` | string | Título da disposição legal |
| `texto` | string | Texto principal |
| `ramo` | string | Ramo jurídico |
| `link` | string | URL para texto integral |

### Campos Opcionais
| Campo | Tipo | Padrão |
|-------|------|--------|
| `ano` | string | "—" |
| `tipo` | string | "—" |

### Exemplo Completo
```json
{
  "id": "cc-2002-art-1",
  "titulo": "Código Civil - Artigo 1º",
  "texto": "Toda pessoa é capaz de direitos e deveres na ordem civil.",
  "ramo": "Civil",
  "link": "https://www.planalto.gov.br/ccivil_03/leis/2002/l10406.htm",
  "ano": "2002",
  "tipo": "Código Civil"
}
```

---

## 🔧 Estrutura do Código JavaScript

### CONFIG
Configurações globais e constantes:
```javascript
const CONFIG = {
    INTERVALO_MILISSEGUNDOS: 30000,
    ARQUIVO_DADOS: 'dados.json',
    STORAGE_KEY: 'leis-favoritas'
};
```

### STATE
Estado da aplicação:
```javascript
const STATE = {
    leisImportantes: [],      // Array de leis
    indiceAtual: 0,           // Lei atual
    estaPausado: false,       // Estado do timer
    favoritosLocais: []       // IDs dos favoritos
};
```

### DOM
Cache de elementos:
```javascript
const DOM = {
    titulo: document.getElementById('lei-titulo'),
    texto: document.getElementById('lei-texto'),
    // ... mais elementos
};
```

---

## 🎨 Esquema de Cores

### Paleta Principal
- **Azul Jurídico**: #0f4c7a (principal)
- **Azul Claro**: #1e88d5 (acentos)
- **Ouro**: #d4af37 (destaque)
- **Cinza Claro**: #f5f7fa (fundo)
- **Texto Escuro**: #2c3e50 (contraste)

### Ramos Jurídicos
- **Constitucional**: Vermelho (#e74c3c)
- **Administrativo**: Azul (#3498db)
- **Penal**: Roxo (#9b59b6)
- **Tributário**: Laranja (#f39c12)
- **Civil**: Verde (#27ae60)
- **Processual**: Verde água (#1abc9c)
- **Trabalhista**: Laranja escuro (#e67e22)

---

## 📱 Responsividade

### Desktop (>768px)
- Navegação completa
- Todos os textos visíveis
- Layout 2-3 colunas

### Tablet (481px - 768px)
- Botões compactos
- Textos reduzidos
- Layout adaptado

### Mobile (<480px)
- Ícones sem textos
- Botões full-width
- Navegação vertical
- Toque-friendly

---

## ⌨️ Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `→` (Seta Direita) | Próxima lei |
| `←` (Seta Esquerda) | Lei anterior |
| `Espaço` | Pausar/Retomar |

---

## 🐛 Troubleshooting

### "Erro ao carregar dados"
- Verifique se `dados.json` existe
- Valide o JSON (use [jsonlint.com](https://jsonlint.com))
- Certifique-se que está em servidor web

### Favoritos não salvam
- Verifique se localStorage está ativado
- Modo privado desativa localStorage
- Limite de 5-10MB por origem

### Layout quebrado em mobile
- Limpe cache do navegador (Ctrl+Shift+Delete)
- Teste em modo responsivo do DevTools
- Atualize a página

### Botões não respondem
- Verifique console (F12)
- Valide se JavaScript está ativo
- Tente outro navegador

---

## 📊 Performance

### Tamanhos dos Arquivos
| Arquivo | Tamanho | Descrição |
|---------|---------|-----------|
| index.html | 6.4 KB | Estrutura |
| style.css | 15 KB | Estilos |
| script.js | 11 KB | Lógica |
| dados.json | 28 KB | Dados |
| **TOTAL** | **60 KB** | Tudo minificado |

### Otimizações
- ✅ CSS Variables em vez de cores duplicadas
- ✅ Transições CSS em vez de JS
- ✅ Lazy loading de imagens
- ✅ Sem frameworks (vanilla)

---

## 🚀 Deploy

### GitHub Pages
1. Coloque arquivos em repositório
2. Ative GitHub Pages nas configurações
3. Acesse `seu-usuario.github.io/seu-repo`

### Netlify
1. Conecte repositório do GitHub
2. Deploy automático
3. HTTPS incluído

### Servidor Próprio
1. Upload via FTP
2. Certifique-se de HTTPS
3. Configure headers CORS se necessário

---

## 📄 Licença

Este projeto é baseado no trabalho original de Murilo Feitosa.
Versão 2.0 - Redesenho Completo - 2025

---

## 🙏 Créditos

- **Projeto Original**: Murilo Feitosa
- **Redesenho V2.0**: 2025
- **Fontes**: Google Fonts (Playfair Display, Source Serif Pro)
- **Ícones**: Font Awesome 6.4.2

---

## 📞 Suporte

Dúvidas ou sugestões?

1. Verifique a documentação em `ANALISE_E_MELHORIAS.md`
2. Consulte o console (F12) para erros
3. Valide dados em `dados.json`

---

**Aproveite a nova versão!** 🎉

Agora com design profissional, mais funcionalidades e código limpo para fácil manutenção.
