import React from "react";

export default function Historias() {
    return (
        <div className="p-6 space-y-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center">📜 História do Dia do Trabalho no Brasil</h1>
            <p className="text-lg text-center text-muted-foreground">
                Descubra como o 1º de maio deixou de ser apenas um dia de protestos e se transformou em símbolo nacional da classe trabalhadora.
            </p>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">🔥 Das Ruas de Chicago ao Brasil</h2>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>1886 - EUA:</strong> Greve histórica em Chicago exigia jornada de 8h. Terminou com violência, prisões e mortes.</li>
                    <li><strong>1889 - Paris:</strong> Congresso Socialista transforma o 1º de maio em símbolo mundial das lutas trabalhistas.</li>
                    <li><strong>Fim do século XIX - Brasil:</strong> Trabalhadores imigrantes trazem o 1º de maio ao país, com greves e protestos em SP e RJ.</li>
                </ul>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">📅 Quando virou feriado?</h2>
                <p><strong>1925 –</strong> Presidente <strong>Artur Bernardes</strong> oficializa o <strong>1º de maio</strong> como feriado nacional.</p>
                <div className="bg-yellow-100 p-4 rounded-xl shadow-inner">
                    🟨 <em>Curiosidade:</em> A oficialização ocorreu, mas as manifestações já aconteciam há mais de 30 anos!
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">🧓 Era Vargas: o 1º de Maio vira palco político</h2>
                <p>
                    A partir de 1930, <strong>Getúlio Vargas</strong> transforma a data em um evento oficial com <strong>discursos, festas e leis</strong>.
                </p>
                <p>
                    <strong>1943 –</strong> Em pleno 1º de maio, Vargas anuncia a criação da <strong>CLT</strong> (Consolidação das Leis do Trabalho), que garante direitos como:
                </p>
                <ul className="list-disc list-inside space-y-1">
                    <li>Férias remuneradas</li>
                    <li>Carteira assinada</li>
                    <li>Jornada de trabalho de 8h</li>
                </ul>
                <div className="bg-green-100 p-4 rounded-xl shadow-inner">
                    🟩 <em>Interativo:</em><br />
                    💬 <strong>"Você sabia que muitos direitos que temos hoje foram anunciados num 1º de maio por Vargas? Se você vivesse naquela época, o que acharia disso?"</strong>
                    <div className="mt-2">
                        <input type="text" placeholder="Digite sua resposta..." className="w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">🎯 Conclusão: mais que um feriado</h2>
                <p>
                    O Dia do Trabalho no Brasil mostra como uma data internacional se fundiu com a política nacional, criando uma tradição que mistura <strong>luta, conquista e propaganda</strong>.
                </p>
                <div className="bg-blue-100 p-4 rounded-xl shadow-inner">
                    🔵 <em>Curiosidade:</em> Até hoje, muitos presidentes escolhem o 1º de maio para anunciar reajustes e programas voltados ao trabalhador.
                </div>
            </section>
        </div>
    );
}


