import { describe, expect, it } from 'vitest';
import filterOpportunities from '../../src/features/opportunity-filters/lib/filterOpportunities.js';
import getAvailableCities from '../../src/features/opportunity-filters/lib/getAvailableCities.js';
import resolveSelectedCity from '../../src/features/opportunity-filters/lib/resolveSelectedCity.js';

const opportunities = [
  { nome: 'Unidade Centro - SP', cidade: 'SÃO PAULO' },
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
    expect(getAvailableCities(opportunities, 'SP')).toEqual(['Todas', 'SÃO PAULO', 'SANTOS']);
  });

  it('resets an invalid city to the all-cities option', () => {
    expect(resolveSelectedCity('SALVADOR', ['Todas', 'SÃO PAULO', 'SANTOS'])).toBe('Todas');
  });
});
