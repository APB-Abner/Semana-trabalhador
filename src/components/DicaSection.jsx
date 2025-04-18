import React from 'react';

const DicaSection = ({ id, title, icon, children }) => {
    return (
        <section id={id} className="section space-y-6">
            <h3 className="text-2xl font-semibold">{icon} {title}</h3>
            <div className="text-gray-600 dark:text-gray-400">
                {children}
            </div>
        </section>
    );
};

export default DicaSection;
