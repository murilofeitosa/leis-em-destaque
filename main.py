import google.generativeai as genai
import feedparser
import os
from bs4 import BeautifulSoup

# 1. Configuração da IA (Pegando a chave que você salvou nos Secrets)
genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel('gemini-1.5-flash')

def buscar_fontes_juridicas():
    # Fontes: Câmara (Projetos/Leis) e STF (Jurisprudência)
    urls = [
        "https://www.camara.leg.br/rss/noticias",
        "https://portal.stf.jus.br/noticias/rss.asp"
    ]
    texto_consolidado = ""
    for url in urls:
        feed = feedparser.parse(url)
        for entry in feed.entries[:5]: # Pega as 5 mais recentes de cada
            texto_consolidado += f"Título: {entry.title}\nResumo: {entry.summary}\n\n"
    return texto_consolidado

def processar_com_ia(conteudo):
    prompt = f"""
    Você é um assistente jurídico de alto nível para Murilo Feitosa, Diretor de Gabinete Criminal.
    Analise estas notícias:
    {conteudo}

    Tarefa:
    1. Filtre apenas o que for relevante para Direito Penal, Processo Penal ou Organização Judiciária.
    2. Se houver algo relevante, crie um card HTML usando Bootstrap.
    3. No card, inclua um 'Insight do Gabinete' explicando a importância prática daquela norma ou decisão.
    4. Se não houver nada relevante, retorne apenas: '<p class="text-muted">Sem atualizações legislativas relevantes nas últimas horas.</p>'
    
    Retorne apenas o código HTML, sem blocos de markdown (```html).
    """
    response = model.generate_content(prompt)
    return response.text

def atualizar_index(novo_conteudo):
    with open("index.html", "r", encoding="utf-8") as f:
        html_antigo = f.read()

    # O script procura por esta tag no seu HTML e substitui pelo conteúdo novo
    marcador = ""
    
    # Mantém o marcador para a próxima atualização
    partes = html_antigo.split(marcador)
    if len(partes) > 1:
        novo_html = partes[0] + marcador + "\n" + novo_conteudo + "\n" + partes[1].split(marcador)[-1]
        
        with open("index.html", "w", encoding="utf-8") as f:
            f.write(novo_html)

if __name__ == "__main__":
    noticias = buscar_fontes_juridicas()
    cards_html = processar_com_ia(noticias)
    atualizar_index(cards_html)
