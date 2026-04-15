import getOpportunityState from '../../../entities/opportunity/lib/getOpportunityState.js';
import { ALL_CITIES_OPTION } from './getAvailableCities.js';
import { ALL_STATES_OPTION } from './getOpportunityStates.js';

export default function filterOpportunities(opportunities, { cidade, estado }) {
  return opportunities.filter((opportunity) => {
    const cityMatches = cidade === ALL_CITIES_OPTION || opportunity.cidade === cidade;
    const stateMatches = estado === ALL_STATES_OPTION || getOpportunityState(opportunity) === estado;

    return cityMatches && stateMatches;
  });
}
