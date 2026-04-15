import getOpportunityState from '../../../entities/opportunity/lib/getOpportunityState.js';

export const ALL_STATES_OPTION = 'Todos';

export default function getOpportunityStates(opportunities) {
  const states = opportunities
    .map(getOpportunityState)
    .filter(Boolean);

  return [ALL_STATES_OPTION, ...new Set(states)];
}
