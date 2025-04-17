from bs4 import BeautifulSoup

# HTML de exemplo (você pode pegar esse HTML de um arquivo ou de uma requisição)
html = '''
<div class="eael-adv-accordion" id="eael-adv-accordion-75d2add" data-scroll-on-click="no" data-scroll-speed="300" data-accordion-id="75d2add" data-accordion-type="accordion" data-toogle-speed="300">
    <div class="eael-accordion-list">
        <div id="braslia-df" class="elementor-tab-title eael-accordion-header show-this active" tabindex="0" data-tab="1" aria-controls="elementor-tab-content-1231"><span class="eael-accordion-tab-title">BRASÍLIA - DF</span></div>
        <div id="elementor-tab-content-1231" class="eael-accordion-content clearfix" data-tab="1" aria-labelledby="braslia-df">SHC/SW, EQSW 304/504 Edifício CIEE – Lote 02, St. Sudoeste, Brasília – DF, 70673-450</div>
    </div>
    <div class="eael-accordion-list">
        <div id="campo-grande-ms" class="elementor-tab-title eael-accordion-header" tabindex="0" data-tab="2" aria-controls="elementor-tab-content-1232"><span class="eael-accordion-tab-title">CAMPO GRANDE - MS</span></div>
        <div id="elementor-tab-content-1232" class="eael-accordion-content clearfix" data-tab="2" aria-labelledby="campo-grande-ms">Rua Rio Grande do Sul, 210-220, Jd dos Estados, Campo Grande/MS – CEP:79020-010</div>
    </div>
    <div class="eael-accordion-list">
        <div id="cuiab-mt" class="elementor-tab-title eael-accordion-header" tabindex="0" data-tab="3" aria-controls="elementor-tab-content-1233"><span class="eael-accordion-tab-title">CUIABÁ - MT</span></div>
        <div id="elementor-tab-content-1233" class="eael-accordion-content clearfix" data-tab="3" aria-labelledby="cuiab-mt">Av. Mato Grosso, nº 226, Centro Norte, Cuiabá/MT. CEP 78.005-030</div>
    </div>
    <!-- Outras listas de endereços -->
</div>
'''

# Analisando o HTML
soup = BeautifulSoup(html, 'html.parser')

# Encontrando todas as listas de endereços
enderecos = soup.find_all('div', class_='eael-accordion-list')

# Extraindo os nomes dos lugares e os endereços
resultado = []
for endereco in enderecos:
    nome_lugar = endereco.find('span', class_='eael-accordion-tab-title').text.strip()
    endereco_texto = endereco.find('div', class_='eael-accordion-content').text.strip()
    resultado.append({
        'nome': nome_lugar,
        'endereco': endereco_texto
    })

# Exibindo o resultado
for item in resultado:
    print(f"Nome: {item['nome']}")
    print(f"Endereço: {item['endereco']}")
    print("-" * 40)
