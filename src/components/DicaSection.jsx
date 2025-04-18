import { useState } from "react";

function DicaSection({ id, title, icon, children }) {
    // Estado separado para cada item do acordeão
    const [openItems, setOpenItems] = useState({});

    // Função para alternar o estado de um item específico
    const toggleAccordion = (index) => {
        setOpenItems((prevState) => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };

    return (
        <section id={id} className="mb-8">
            <h3 className="text-2xl font-semibold mb-4 flex items-center">
                {icon} {title}
            </h3>

            {/* Renderiza o conteúdo como acordeão */}
            <div className="accordion rounded-2xl">
                {children && Array.isArray(children) ? (
                    children.map((item, index) => (
                        <div key={index} className="accordion-item">
                            {/* Título do Acordeão */}
                            <h2 className="accordion-header">
                                <button
                                    onClick={() => toggleAccordion(index)} // Passa o index para identificar qual acordeão deve ser aberto
                                    className={`accordion-button w-full p-4 text-left ${openItems[index]
                                            ? "bg-gray-200 dark:bg-zinc-800"
                                            : "bg-gray-100 dark:bg-zinc-700"
                                        } hover:bg-gray-300 dark:hover:bg-zinc-600 flex items-center justify-between`}
                                    type="button"
                                    aria-expanded={openItems[index] ? "true" : "false"}
                                    aria-controls={`collapse-${index}`}
                                >
                                    <span className="font-bold">{item.title}</span>
                                    {/* Exibindo ícone à direita do título */}
                                    <span className={`transition-transform ${openItems[index] ? 'rotate-180' : ''}`}>
                                        ▼
                                    </span>
                                </button>
                            </h2>

                            {/* Conteúdo do Acordeão */}
                            <div
                                id={`collapse-${index}`}
                                className={`accordion-collapse transition-all duration-300 ease-in-out ${openItems[index] ? "max-h-screen p-4" : "max-h-0 overflow-hidden"
                                    }`}
                                aria-labelledby={`heading-${index}`}
                            >
                                <div className="accordion-body p-4 bg-gray-100 dark:bg-zinc-700 dark:text-gray-300">
                                    {item.content}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>{children}</p> // Caso não haja conteúdo, renderiza um parágrafo normal
                )}
            </div>
        </section>
    );
}

export default DicaSection;
