import googlemaps
import time
import json

# ========================
# Lê os dados do JSON
# ========================
try:
    with open("./dadosLocais.json", "r", encoding="utf-8") as file:
        locais = json.load(file)
except FileNotFoundError:
    print("Arquivo 'dadosLocais.json' não encontrado.")
    exit(1)
except json.JSONDecodeError:
    print("Erro ao decodificar o JSON do arquivo.")
    exit(1)

# ========================
# Sua chave da API
# ========================
API_KEY = "AIzaSyDWdvIiI913bEwygJqP4HPaaWa0ySm8JHk"
gmaps = googlemaps.Client(key=API_KEY)

# ========================
# Aguarda entre requisições
# ========================
def aguardar_intervalo():
    time.sleep(1)  # recomendado: 1 segundo entre chamadas para evitar limites

# ========================
# Busca coordenadas com googlemaps
# ========================
def buscar_coordenadas_endereco(endereco):
    try:
        resultado = gmaps.geocode(endereco)
        aguardar_intervalo()
        
        if resultado and 'geometry' in resultado[0]:
            location = resultado[0]['geometry']['location']
            return location['lat'], location['lng']
        else:
            print(f"[X] Endereço não encontrado: {endereco}")
            return None
    except Exception as e:
        print(f"[X] Erro ao buscar '{endereco}': {e}")
        return None

# ========================
# Atualiza os locais
# ========================
def atualizar_posicao_locais(locais):
    for i, local in enumerate(locais, 1):
        endereco = local.get('endereco')
        print(f"[{i}/{len(locais)}] Buscando: {endereco}")
        posicao = buscar_coordenadas_endereco(endereco)
        if posicao:
            local['posicao'] = posicao
            print(f"    ✓ Coordenadas: {posicao}")
        else:
            print("    ⚠ Posição não encontrada.")
    return locais

# ========================
# Executa e salva
# ========================
locais_atualizados = atualizar_posicao_locais(locais)

try:
    with open('locais_atualizados.json', 'w', encoding='utf-8') as f:
        json.dump(locais_atualizados, f, ensure_ascii=False, indent=4)
    print("\n✅ Arquivo 'locais_atualizados.json' foi salvo com sucesso!")
except Exception as e:
    print(f"\n❌ Erro ao salvar o arquivo: {e}")

# ========================
# Atribuição
# ========================
print("\n📌 Atribuição: Dados de geolocalização fornecidos pela Google Maps Platform")
