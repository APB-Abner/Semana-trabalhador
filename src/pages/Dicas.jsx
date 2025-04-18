import dicas from '../data/dicas';
import DicaSection from '../components/DicaSection';
import ScrollSpyNav from '../components/ScrollSpyNav.jsx';

const groupedNav = Object.values(
    dicas.reduce((acc, dica) => {
        const group = dica.group || 'Outros';
        if (!acc[group]) acc[group] = { title: group, items: [] };
        acc[group].items.push({
            id: dica.id,
            label: dica.title,
            icon: dica.icon,
        });
        return acc;
    }, {})
);

export default function Dicas() {
    return (
        <div className="flex flex-col md:flex-row gap-8 p-6">
            <div className="md:w-1/4">
                <ScrollSpyNav groups={groupedNav} />
            </div>
            <div className="md:w-3/4 space-y-12">
                {dicas.map(dica => (
                    <DicaSection key={dica.id} id={dica.id} title={dica.title} icon={dica.icon}>
                        {dica.content}
                    </DicaSection>
                ))}
            </div>
        </div>
    );
}
