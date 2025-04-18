import dicas from '../data/dicas';
import DicaSection from '../components/DicaSection';
import ScrollSpyNav from '../components/ScrollSpyNav';

export default function Dicas() {
    return (
        <div className="flex flex-col md:flex-row gap-8 p-6">
            <div className="md:w-1/4">
                <ScrollSpyNav items={dicas} />
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
