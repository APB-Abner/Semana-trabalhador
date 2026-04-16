import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';
import todasOportunidades from '../data/todasOportunidades.js';
import useOpportunityFilters from '../features/opportunity-filters/model/useOpportunityFilters.js';

// Configura ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function Mapa() {
    const {
        cidadesDisponiveis,
        estados,
        filtroCidade,
        filtroEstado,
        oportunidadesFiltradas,
        setFiltroCidade,
        setFiltroEstado,
    } = useOpportunityFilters(todasOportunidades);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="p-6 bg-white text-black dark:bg-zinc-900 dark:text-white transition-colors duration-300">
            <h2 className="text-2xl font-bold mb-2">🌍 Mapa de Unidades</h2>
            <h2 className="text-2xl font-bold mb-2">🌍 Mapa de Unidades</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
                Explore locais com o CIEE mais próximo de você!
                Explore locais com o CIEE mais próximo de você!
            </p>

            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium dark:text-gray-200">Estado:</label>
                    <label className="block text-sm font-medium dark:text-gray-200">Estado:</label>
                    <select
                        className="mt-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-black dark:text-white rounded px-3 py-1"
                        value={filtroEstado}
                        onChange={e => setFiltroEstado(e.target.value)}
                        value={filtroEstado}
                        onChange={e => setFiltroEstado(e.target.value)}
                    >
                        {estados.map((estado, idx) => (
                            <option key={idx}>{estado}</option>
                        {estados.map((estado, idx) => (
                            <option key={idx}>{estado}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium dark:text-gray-200">Cidade:</label>
                    <select
                        className="mt-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-black dark:text-white rounded px-3 py-1"
                        value={filtroCidade}
                        onChange={e => setFiltroCidade(e.target.value)}
                    >
                        {cidadesDisponiveis.map((cidade, idx) => (
                        {cidadesDisponiveis.map((cidade, idx) => (
                            <option key={idx}>{cidade}</option>
                        ))}
                    </select>
                </div>
            </div>

            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                {oportunidadesFiltradas.length} oportunidade(s) encontrada(s).
            </p>

            <div className="h-[500px] rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700 shadow">
                <MapContainer center={[-15.7939, -47.8828]} zoom={4} scrollWheelZoom={false} className="h-full w-full">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {oportunidadesFiltradas.map((op, idx) =>
                        op.posicao && Array.isArray(op.posicao) && op.posicao.length === 2 ? (
                            <Marker key={idx} position={op.posicao}>
                                <Popup>
                                    <strong>{op.nome}</strong><br />
                                    📍 {op.cidade}<br />
                                    🕒 {op.horario || 'Horário não informado'}<br />
                                    <p className="mt-1 text-sm">{op.endereco}</p>
                                    
                                    <strong>{op.nome}</strong><br />
                                    📍 {op.cidade}<br />
                                    🕒 {op.horario || 'Horário não informado'}<br />
                                    <p className="mt-1 text-sm">{op.endereco}</p>
                                    
                                </Popup>
                            </Marker>
                        ) : null
                    )}
                </MapContainer>
            </div>
        </div>
    );
}
