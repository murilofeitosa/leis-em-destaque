import google.generativeai as genai
import json
import os

# Configuração da IA
genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel('gemini-1.5-flash')

def atualizar_mural():
    # 1. Lê as leis que você já tem no dados.json
    with open('dados.json', 'r', encoding='utf-8') as f:
        leis = json.load(f)

    # 2. Pede para a IA criar um resumo jurídico para a página única
    # Vamos focar em uma lei específica ou nas últimas adicionadas
    prompt = f"Analise estas leis: {leis}. Crie um resumo curto (3 linhas) focado no impacto prático para um Gabinete Criminal. Formate como HTML elegante."
    
    response = model.generate_content(prompt)
    resumo_ia = response.text

    # 3. Atualiza o index.html (insere o resumo da IA no topo)
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Aqui o script substitui um marcador que você criará no HTML
    novo_html = html.replace("", resumo_ia)
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(novo_html)

if __name__ == "__main__":
    atualizar_mural()
