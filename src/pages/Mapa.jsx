import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';
import todasOportunidades from '../data/todasOportunidades.js';
import useOpportunityFilters from '../features/opportunity-filters/model/useOpportunityFilters.js';
import Badge from '../shared/ui/Badge.jsx';
import FormSelect from '../shared/ui/FormSelect.jsx';
import PageHeader from '../shared/ui/PageHeader.jsx';
import PageShell from '../shared/ui/PageShell.jsx';
import ResultPanel from '../shared/ui/ResultPanel.jsx';

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

    const oportunidadesComCoordenadas = oportunidadesFiltradas.filter((op) => (
        op.posicao && Array.isArray(op.posicao) && op.posicao.length === 2
    ));
    const oportunidadesListadas = oportunidadesFiltradas.slice(0, 6);

    return (
        <PageShell>
            <PageHeader
                eyebrow="Mapa de unidades"
                title="Encontre o CIEE mais próximo de você."
                description="Filtre por estado e cidade para localizar unidades, polos e postos de atendimento disponíveis."
            />

            <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
                <aside className="space-y-4">
                    <ResultPanel>
                        <h2 className="text-lg font-bold text-gray-950 dark:text-white">Filtros</h2>
                        <div className="mt-5 space-y-4">
                            <FormSelect
                                id="map-state"
                                label="Estado"
                                value={filtroEstado}
                                onChange={(event) => setFiltroEstado(event.target.value)}
                            >
                                {estados.map((estado) => (
                                    <option key={estado}>{estado}</option>
                                ))}
                            </FormSelect>

                            <FormSelect
                                id="map-city"
                                label="Cidade"
                                value={filtroCidade}
                                onChange={(event) => setFiltroCidade(event.target.value)}
                            >
                                {cidadesDisponiveis.map((cidade) => (
                                    <option key={cidade}>{cidade}</option>
                                ))}
                            </FormSelect>
                        </div>
                    </ResultPanel>

                    <ResultPanel tone="info">
                        <p className="text-sm uppercase tracking-wide text-blue-700 dark:text-blue-200">Resultado</p>
                        <p className="font-display mt-2 text-3xl font-extrabold text-gray-950 dark:text-white">
                            {oportunidadesFiltradas.length}
                        </p>
                        <p className="mt-1 text-sm text-blue-900 dark:text-blue-100">
                            unidade(s) encontrada(s), com {oportunidadesComCoordenadas.length} ponto(s) no mapa.
                        </p>
                    </ResultPanel>

                    <ResultPanel>
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="text-lg font-bold text-gray-950 dark:text-white">Unidades listadas</h2>
                            <Badge tone="gray">{filtroCidade}</Badge>
                        </div>
                        <div className="mt-4 space-y-3">
                            {oportunidadesListadas.length ? oportunidadesListadas.map((op, index) => (
                                <article key={`${op.nome}-${index}`} className="border-t border-gray-200 pt-3 first:border-t-0 first:pt-0 dark:border-zinc-800">
                                    <h3 className="text-sm font-bold text-gray-950 dark:text-white">{op.nome}</h3>
                                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">{op.cidade}</p>
                                    {op.horario && (
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{op.horario}</p>
                                    )}
                                </article>
                            )) : (
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Nenhuma unidade encontrada com os filtros atuais.
                                </p>
                            )}
                        </div>
                        {oportunidadesFiltradas.length > oportunidadesListadas.length && (
                            <p className="mt-4 text-xs font-semibold text-blue-700 dark:text-blue-300">
                                Mostrando 6 de {oportunidadesFiltradas.length}. Refine por cidade para reduzir a lista.
                            </p>
                        )}
                    </ResultPanel>
                </aside>

                <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-zinc-800">
                        <div>
                            <h2 className="font-bold text-gray-950 dark:text-white">Mapa de Unidades</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Arraste o mapa para explorar outras regiões.
                            </p>
                        </div>
                        <Badge tone="green">{filtroEstado}</Badge>
                    </div>

                    <div className="h-[32rem] overflow-hidden">
                        <MapContainer
                            center={[-15.7939, -47.8828]}
                            zoom={4}
                            scrollWheelZoom={false}
                            className="h-full w-full"
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {oportunidadesComCoordenadas.map((op, idx) => (
                                <Marker key={`${op.nome}-${idx}`} position={op.posicao}>
                                    <Popup>
                                        <strong>{op.nome}</strong><br />
                                        Cidade: {op.cidade}<br />
                                        Horário: {op.horario || 'Horário não informado'}<br />
                                        <p className="mt-1 text-sm">{op.endereco}</p>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </section>
            </div>
        </PageShell>
    );
}
