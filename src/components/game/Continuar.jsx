function avaliarPontuacao(pontos) {
    if (pontos === 10) {
        return {
            titulo: '💼 Jovem Mestre!',
            mensagem: 'Você dominou o jogo! Está pronto para qualquer desafio no mundo do trabalho!',
            cor: 'text-green-600'
        };
    } else if (pontos >= 7) {
        return {
            titulo: '🚀 Mandou bem!',
            mensagem: 'Você está no caminho certo. Continue aprendendo e se desenvolvendo!',
            cor: 'text-blue-600'
        };
    } else if (pontos >= 4) {
        return {
            titulo: '🛠️ Em construção...',
            mensagem: 'Você tem uma boa base, mas pode melhorar. Que tal rever alguns conteúdos?',
            cor: 'text-yellow-600'
        };
    } else {
        return {
            titulo: '📚 Vamos tentar de novo?',
            mensagem: 'Todo mundo começa de algum lugar. Continue tentando e aprendendo!',
            cor: 'text-red-600'
        };
    }
}

export default function Resultado({ pontuacao, reiniciar, continuar }) {
    const resultado = avaliarPontuacao(pontuacao);

    return (
        <div className="text-center p-6 max-w-xl mx-auto">
            <h2 className={`text-3xl font-bold mb-4 ${resultado.cor}`}>
                {resultado.titulo}
            </h2>
            <p className="mb-6 text-gray-700">{resultado.mensagem}</p>
            <div className="flex gap-10 justify-center mb-4">

            <button
                onClick={reiniciar}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                Tentar novamente
            </button>
            <button
                onClick={continuar}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                Continuar
            </button>
                </div>
        </div>
    );
}
