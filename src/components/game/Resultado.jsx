export default function Resultado({ reiniciar }) {
    return (
        <div className="p-6 text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Parabéns!</h2>
            <p className="text-gray-700 mb-6">
                Você concluiu os desafios da Semana do Jovem Trabalhador!
                Esperamos que tenha se divertido e aprendido mais sobre suas habilidades e possibilidades no mundo do trabalho.
            </p>
            <button
                onClick={reiniciar}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
                Jogar novamente
            </button>
        </div>
    );
}
