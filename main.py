import google.generativeai as genai
import feedparser # Biblioteca para ler sites de notícias oficiais
import os

genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel('gemini-1.5-flash')

def buscar_novas_leis():
    # Exemplo: RSS da Câmara dos Deputados (Projetos e Leis)
    url_feed = "https://www.camara.leg.br/rss/noticias" 
    feed = feedparser.parse(url_feed)
    
    novidades = ""
    for entry in feed.entries[:5]: # Pega as 5 notícias mais recentes
        novidades += f"Título: {entry.title}\nResumo: {entry.summary}\n\n"
    
    return novidades

def atualizar_site():
    dados_brutos = buscar_novas_leis()
    
    prompt = f"""
    Como especialista jurídico para o Diretor de Gabinete Murilo Feitosa, 
    analise estas notícias e leis: {dados_brutos}.
    Se houver algo sobre Direito Penal ou Processo Penal, crie um card HTML.
    Se não houver nada relevante, diga 'Sem novidades urgentes'.
    """
    
    response = model.generate_content(prompt)
    # ... código para salvar no index.html (como vimos antes)
