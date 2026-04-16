import { ALL_CITIES_OPTION } from './getAvailableCities.js';

export default function resolveSelectedCity(currentCity, availableCities) {
  return currentCity === ALL_CITIES_OPTION || availableCities.includes(currentCity)
    ? currentCity
    : ALL_CITIES_OPTION;
}
