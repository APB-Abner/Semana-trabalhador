import { describe, expect, it } from 'vitest';
import filterOpportunities from '../../src/features/opportunity-filters/lib/filterOpportunities.js';
import getAvailableCities from '../../src/features/opportunity-filters/lib/getAvailableCities.js';
import { ALL_STATES_OPTION } from '../../src/features/opportunity-filters/lib/getOpportunityStates.js';
import resolveSelectedCity from '../../src/features/opportunity-filters/lib/resolveSelectedCity.js';

const opportunities = [
  { nome: 'Unidade Centro - SP', cidade: 'SAO PAULO' },
  { nome: 'Unidade Baixada - SP', cidade: 'SANTOS' },
  { nome: 'Unidade Nordeste - BA', cidade: 'SALVADOR' },
];

describe('opportunity filters', () => {
  it('filters opportunities by state and city', () => {
    const result = filterOpportunities(opportunities, { estado: 'SP', cidade: 'SANTOS' });

    expect(result).toHaveLength(1);
    expect(result[0].nome).toContain('Baixada');
  });

  it('returns available cities for a selected state', () => {
    expect(getAvailableCities(opportunities, 'SP')).toEqual(['Todas', 'SAO PAULO', 'SANTOS']);
  });

  it('keeps all cities and all opportunities when filters are reset', () => {
    expect(getAvailableCities(opportunities, ALL_STATES_OPTION)).toEqual([
      'Todas',
      'SAO PAULO',
      'SANTOS',
      'SALVADOR',
    ]);
    expect(filterOpportunities(opportunities, { estado: ALL_STATES_OPTION, cidade: 'Todas' })).toHaveLength(3);
  });

  it('combines state and city filters without leaking another state', () => {
    const result = filterOpportunities(opportunities, { estado: 'BA', cidade: 'SANTOS' });

    expect(result).toEqual([]);
  });

  it('resets an invalid city to the all-cities option', () => {
    expect(resolveSelectedCity('SALVADOR', ['Todas', 'SAO PAULO', 'SANTOS'])).toBe('Todas');
  });
});
