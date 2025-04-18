import { useState } from "react";

export default function DicaSection({ id, title, icon, children }) {
    // Controle para abrir/fechar o acordeão
    const [isOpen, setIsOpen] = useState(false);

    // Função que alterna o estado do acordeão (aberto/fechado)
    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <section id={id} className="mb-8">
            <h3 className="text-2xl font-semibold mb-4 flex items-center">
                {icon} {title}
            </h3>

            {/* Conteúdo do acordeão */}
            <div className="space-y-4">
                {/* Renderiza o conteúdo como um acordeão */}
                {children && Array.isArray(children) ? (
                    children.map((item, index) => (
                        <div key={index} className="border rounded-md mb-2">
                            {/* Título do Acordeão */}
                            <button
                                onClick={toggleAccordion}
                                className="w-full p-4 text-left bg-gray-200 dark:bg-zinc-800 dark:text-white hover:bg-gray-300"
                            >
                                <span className="font-bold">{item.title}</span>
                            </button>

                            {/* Conteúdo do Acordeão */}
                            {isOpen && (
                                <div className="p-4 bg-gray-100 dark:bg-zinc-700 dark:text-gray-300">
                                    {item.content}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>{children}</p>  // Caso não haja conteúdo, renderiza um parágrafo normal
                )}
            </div>
        </section>
    );
}


