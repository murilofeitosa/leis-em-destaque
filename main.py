import google.generativeai as genai
import feedparser
import os

# 1. Configuração da IA
genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel('gemini-1.5-flash')

def buscar_fontes_juridicas():
    urls = [
        "[https://www.camara.leg.br/rss/noticias](https://www.camara.leg.br/rss/noticias)",
        "[https://portal.stf.jus.br/noticias/rss.asp](https://portal.stf.jus.br/noticias/rss.asp)"
    ]
    texto_consolidado = ""
    for url in urls:
        feed = feedparser.parse(url)
        for entry in feed.entries[:5]:
            texto_consolidado += f"Título: {entry.title}\nResumo: {entry.summary}\n\n"
    return texto_consolidado

def processar_com_ia(conteudo):
    prompt = f"""
    Você é um assistente jurídico para Murilo Feitosa, Diretor de Gabinete Criminal.
    Analise estas notícias: {conteudo}
    Tarefa:
    1. Filtre apenas o que for relevante para Direito Penal ou Processo Penal.
    2. Crie cards HTML usando as classes CSS: 'card-ia'.
    3. No card, inclua o título da notícia e um 'Insight do Gabinete'.
    Retorne apenas o HTML, sem as tags ```html.
    """
    response = model.generate_content(prompt)
    texto = response.text
    # Limpeza de segurança para evitar que o markdown da IA apareça no site
    return texto.replace("```html", "").replace("```", "").strip()

def atualizar_index(novo_conteudo):
    with open("index.html", "r", encoding="utf-8") as f:
        html_antigo = f.read()

    # O marcador deve ser EXATAMENTE o que está no seu index.html
    marcador = ""
    
    if marcador in html_antigo:
        partes = html_antigo.split(marcador)
        # Monta o HTML preservando os marcadores para a próxima rodada
        novo_html = partes[0] + marcador + "\n" + novo_conteudo + "\n" + marcador + partes[2]
        
        with open("index.html", "w", encoding="utf-8") as f:
            f.write(novo_html)

if __name__ == "__main__":
    noticias = buscar_fontes_juridicas()
    cards_html = processar_com_ia(noticias)
    atualizar_index(cards_html)
