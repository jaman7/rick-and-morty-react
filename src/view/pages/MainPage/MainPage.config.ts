import { FilterConfig } from '@/shared/components/FiltersPanel/FiltersPanel';

const speciesDict = ['Human', 'Alien', 'Humanoid', 'Poopybutthole', 'Mythological', 'Unknown', 'Animal', 'Disease', 'Robot', 'Cronenberg'];

const gendersDict = ['Female', 'Male', 'Genderless', 'Unknown'];

const statusDict = ['Alive', 'Dead', 'Unknown'];

export const filtersConfig: FilterConfig = {
  status: { value: statusDict },
  species: { value: speciesDict },
  genders: { value: gendersDict },
};
