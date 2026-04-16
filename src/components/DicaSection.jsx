import { useState } from "react";

function DicaSection({ id, title, icon, children }) {
    const [openItems, setOpenItems] = useState({});

    const toggleAccordion = (index) => {
        setOpenItems((prevState) => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };

    return (
        <section id={id} data-scroll-section className="section scroll-mt-28 border-t border-gray-200 pt-8 first:border-t-0 first:pt-0 dark:border-zinc-800">
            <div className="mb-5 flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xl dark:bg-blue-950" aria-hidden="true">
                    {icon}
                </span>
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">Guia de carreira</p>
                    <h3 className="mt-1 text-2xl font-bold text-gray-950 dark:text-white">
                        {title}
                    </h3>
                </div>
            </div>

            <div className="accordion overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                {children && Array.isArray(children) ? (
                    children.map((item, index) => (
                        <div key={index} className="accordion-item border-t border-gray-200 first:border-t-0 dark:border-zinc-800">
                            <h2 className="accordion-header">
                                <button
                                    id={`${id}-heading-${index}`}
                                    onClick={() => toggleAccordion(index)}
                                    className={`accordion-button flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition ${openItems[index]
                                            ? "bg-blue-50 text-blue-950 dark:bg-blue-950 dark:text-blue-100"
                                            : "bg-white text-gray-900 hover:bg-gray-50 dark:bg-zinc-900 dark:text-gray-100 dark:hover:bg-zinc-800"
                                    } focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-inset`}
                                    type="button"
                                    aria-expanded={openItems[index] ? "true" : "false"}
                                    aria-controls={`${id}-collapse-${index}`}
                                >
                                    <span className="font-bold">{item.title}</span>
                                    <span className="text-lg font-bold" aria-hidden="true">
                                        {openItems[index] ? '-' : '+'}
                                    </span>
                                </button>
                            </h2>

                            <div
                                id={`${id}-collapse-${index}`}
                                aria-labelledby={`${id}-heading-${index}`}
                                className={`accordion-collapse transition-all duration-300 ease-in-out ${openItems[index] ? "max-h-screen" : "max-h-0 overflow-hidden"
                                    }`}
                            >
                                <div className="accordion-body border-t border-blue-100 bg-blue-50/50 p-4 text-sm leading-6 text-gray-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-gray-300">
                                    {item.content}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-700 dark:text-gray-300">{children}</p>
                )}
            </div>
        </section>
    );
}

export default DicaSection;
