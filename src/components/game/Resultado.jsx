export default function Resultado({ reiniciar, acertosQuiz, acertosMemoria }) {
    const total = acertosQuiz + acertosMemoria;

    function avaliarPontuacao(total) {
        if (total >= 15) {
            return { titulo: "Excelente!", mensagem: "Você foi incrível!", cor: "text-green-500" };
        } else if (total >= 10) {
            return { titulo: "Bom trabalho!", mensagem: "Você mandou bem!", cor: "text-yellow-500" };
        } else {
            return { titulo: "Continue tentando!", mensagem: "Você pode melhorar!", cor: "text-red-500" };
        }
    }

    const resultado = avaliarPontuacao(total);

    return (
        <div className="text-center p-6 max-w-xl mx-auto">
            <h2 className={`text-3xl font-bold mb-4 ${resultado.cor}`}>
                {resultado.titulo}
            </h2>
            <p className="mb-2 text-gray-700">{resultado.mensagem}</p>
            <p className="mt-4">Quiz: <strong>{acertosQuiz}</strong>/10</p>
            <p className="">Memória: <strong>{acertosMemoria}</strong>/10</p>
            <p className="mt-4 text-xl font-semibold">
                Pontuação Total: <strong>{total}</strong>/20
            </p>
            <button
                onClick={reiniciar}
                className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Tentar novamente
            </button>
        </div>
    );
}
