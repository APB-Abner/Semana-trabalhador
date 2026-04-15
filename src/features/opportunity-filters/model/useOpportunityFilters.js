import { useEffect, useMemo, useState } from 'react';
import filterOpportunities from '../lib/filterOpportunities.js';
import getAvailableCities, { ALL_CITIES_OPTION } from '../lib/getAvailableCities.js';
import getOpportunityStates, { ALL_STATES_OPTION } from '../lib/getOpportunityStates.js';

export default function useOpportunityFilters(opportunities) {
  const [filtroCidade, setFiltroCidade] = useState(ALL_CITIES_OPTION);
  const [filtroEstado, setFiltroEstado] = useState(ALL_STATES_OPTION);

  const estados = useMemo(() => getOpportunityStates(opportunities), [opportunities]);
  const cidadesDisponiveis = useMemo(
    () => getAvailableCities(opportunities, filtroEstado),
    [filtroEstado, opportunities],
  );

  useEffect(() => {
    setFiltroCidade((currentCity) =>
      currentCity === ALL_CITIES_OPTION || cidadesDisponiveis.includes(currentCity)
        ? currentCity
        : ALL_CITIES_OPTION,
    );
  }, [cidadesDisponiveis]);

  const oportunidadesFiltradas = useMemo(
    () => filterOpportunities(opportunities, { cidade: filtroCidade, estado: filtroEstado }),
    [filtroCidade, filtroEstado, opportunities],
  );

  return {
    cidadesDisponiveis,
    estados,
    filtroCidade,
    filtroEstado,
    oportunidadesFiltradas,
    setFiltroCidade,
    setFiltroEstado,
  };
}
