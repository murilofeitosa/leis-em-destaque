import google.generativeai as genai
import feedparser
import os

# 1. Configuração da IA (Utiliza o Secret salvo no GitHub)
genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel('gemini-1.5-flash')

def buscar_fontes_juridicas():
    # Fontes oficiais: Câmara dos Deputados e STF
    urls = [
        "https://www.camara.leg.br/rss/noticias",
        "https://portal.stf.jus.br/noticias/rss.asp"
    ]
    texto_consolidado = ""
    for url in urls:
        feed = feedparser.parse(url)
        for entry in feed.entries[:5]: # Pega as 5 notícias mais recentes de cada
            texto_consolidado += f"Título: {entry.title}\nResumo: {entry.summary}\n\n"
    return texto_consolidado

def processar_com_ia(conteudo):
    prompt = f"""
    Você é um assistente jurídico especializado para Murilo Feitosa, Diretor de Gabinete Criminal.
    Analise estas notícias: {conteudo}
    
    Tarefa:
    1. Filtre apenas o que for relevante para Direito Penal, Processo Penal ou cotidiano de uma Vara Criminal.
    2. Para cada notícia relevante, crie um card HTML usando a classe CSS 'card-ia'.
    3. No card, inclua o título e um parágrafo chamado 'Insight do Gabinete' explicando o impacto prático.
    4. Se não houver nada relevante, retorne: '<p class="text-muted">Sem atualizações criminais urgentes no momento.</p>'
    
    Importante: Retorne APENAS o código HTML puro, sem blocos de código markdown (```html).
    """
    response = model.generate_content(prompt)
    # Limpeza de segurança para garantir que o HTML seja inserido corretamente
    return response.text.replace("```html", "").replace("```", "").strip()

def atualizar_index(novo_conteudo):
    if not os.path.exists("index.html"):
        print("Erro: index.html não encontrado.")
        return

    with open("index.html", "r", encoding="utf-8") as f:
        html_antigo = f.read()

    # Marcador exato para a substituição
    marcador = ""
    
    if marcador in html_antigo:
        # Divide o arquivo nos marcadores e injeta o conteúdo no meio
        partes = html_antigo.split(marcador)
        # Reconstroi o arquivo mantendo os marcadores para a próxima execução
        novo_html = partes[0] + marcador + "\n" + novo_conteudo + "\n" + marcador + partes[2]
        
        with open("index.html", "w", encoding="utf-8") as f:
            f.write(novo_html)
        print("Site atualizado com sucesso!")
    else:
        print("Erro: Marcador não encontrado no index.html")

if __name__ == "__main__":
    noticias = buscar_fontes_juridicas()
    cards_html = processar_com_ia(noticias)
    atualizar_index(cards_html)
