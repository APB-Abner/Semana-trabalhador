// --- pages/Mapa.jsx ---
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// Configura ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Dados fictícios
const todasOportunidades = [
    {
        nome: 'Feira Jovem Futuro',
        cidade: 'São Paulo',
        tipo: 'Evento',
        modalidade: 'Presencial',
        posicao: [-23.5505, -46.6333],
        descricao: 'Palestras, workshops e networking com empresas.',
    },
    {
        nome: 'Tech Jovem Day',
        cidade: 'Recife',
        tipo: 'Evento',
        modalidade: 'Presencial',
        posicao: [-8.0476, -34.877],
        descricao: 'Feira de tecnologia para jovens iniciantes.',
    },
    {
        nome: 'Oficina de Currículo',
        cidade: 'Porto Alegre',
        tipo: 'Oficina',
        modalidade: 'Presencial',
        posicao: [-30.0346, -51.2177],
        descricao: 'Aprenda a montar um currículo atrativo.',
    },
    {
        nome: 'Palestra Online: Futuro do Trabalho',
        cidade: 'Online',
        tipo: 'Palestra',
        modalidade: 'Online',
        posicao: [-15.7939, -47.8828],
        descricao: 'Discussão com especialistas em carreira e tecnologia.',
    },
    {
        nome: 'Mutirão de Vagas',
        cidade: 'Fortaleza',
        tipo: 'Evento',
        modalidade: 'Presencial',
        posicao: [-3.7172, -38.5433],
        descricao: 'Empresas reunidas para contratação de jovens.',
    },
];

const tipos = ['Todos', 'Evento', 'Oficina', 'Palestra'];
const cidades = ['Todas', ...new Set(todasOportunidades.map(op => op.cidade))];

export default function Mapa() {
    const [filtroTipo, setFiltroTipo] = useState('Todos');
    const [filtroCidade, setFiltroCidade] = useState('Todas');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const oportunidadesFiltradas = todasOportunidades.filter(op => {
        const tipoMatch = filtroTipo === 'Todos' || op.tipo === filtroTipo;
        const cidadeMatch = filtroCidade === 'Todas' || op.cidade === filtroCidade;
        return tipoMatch && cidadeMatch;
    });

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">🌍 Mapa de Oportunidades</h2>
            <p className="mb-4 text-gray-700">Explore eventos, oficinas e vagas próximas de você!</p>

            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium">Tipo:</label>
                    <select
                        className="mt-1 border border-gray-300 rounded px-3 py-1"
                        value={filtroTipo}
                        onChange={e => setFiltroTipo(e.target.value)}
                    >
                        {tipos.map((tipo, idx) => (
                            <option key={idx}>{tipo}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium">Cidade:</label>
                    <select
                        className="mt-1 border border-gray-300 rounded px-3 py-1"
                        value={filtroCidade}
                        onChange={e => setFiltroCidade(e.target.value)}
                    >
                        {cidades.map((cidade, idx) => (
                            <option key={idx}>{cidade}</option>
                        ))}
                    </select>
                </div>
            </div>

            <p className="mb-2 text-sm text-gray-600">
                {oportunidadesFiltradas.length} oportunidade(s) encontrada(s).
            </p>

            <div className="h-[500px] rounded-xl overflow-hidden border border-gray-300 shadow">
                <MapContainer center={[-15.7939, -47.8828]} zoom={4} scrollWheelZoom={false} className="h-full w-full">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {oportunidadesFiltradas.map((op, idx) => (
                        <Marker key={idx} position={op.posicao}>
                            <Popup>
                                <strong>{op.nome}</strong>
                                <br />
                                📍 {op.cidade} | 📌 {op.tipo}
                                <br />
                                <p className="mt-1 text-sm">{op.descricao}</p>
                                <a href="#" className="text-blue-600 underline mt-1 inline-block">Inscreva-se</a>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}
