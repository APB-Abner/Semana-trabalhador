import getOpportunityState from '../../../entities/opportunity/lib/getOpportunityState.js';
import { ALL_STATES_OPTION } from './getOpportunityStates.js';

export const ALL_CITIES_OPTION = 'Todas';

export default function getAvailableCities(opportunities, selectedState) {
  const filteredOpportunities =
    selectedState === ALL_STATES_OPTION
      ? opportunities
      : opportunities.filter((opportunity) => getOpportunityState(opportunity) === selectedState);

  const cities = filteredOpportunities
    .map((opportunity) => opportunity.cidade)
    .filter(Boolean);

  return [ALL_CITIES_OPTION, ...new Set(cities)];
}
