// --- pages/Mapa.jsx ---
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const oportunidades = [
    {
        nome: 'Oficina de Currículo - SP',
        posicao: [-23.5505, -46.6333],
        descricao: 'Curso gratuito de montagem de currículo com especialistas.',
    },
    {
        nome: 'Feira do Emprego Jovem - RJ',
        posicao: [-22.9068, -43.1729],
        descricao: 'Evento com palestras e entrevistas com empresas parceiras.',
    },
    {
        nome: 'Palestra Online: Futuro do Trabalho',
        posicao: [-15.7939, -47.8828],
        descricao: 'Transmissão nacional sobre IA, tecnologia e carreiras do futuro.',
    },
];

export default function Mapa() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">🌍 Mapa de Oportunidades</h2>
            <p className="mb-4 text-gray-700">Explore eventos, oficinas e vagas próximas de você!</p>

            <div className="h-[500px] rounded-xl overflow-hidden border border-gray-300 shadow">
                <MapContainer center={[-15.7939, -47.8828]} zoom={4} scrollWheelZoom={false} className="h-full w-full">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {oportunidades.map((op, idx) => (
                        <Marker key={idx} position={op.posicao}>
                            <Popup>
                                <strong>{op.nome}</strong>
                                <br />
                                {op.descricao}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}
