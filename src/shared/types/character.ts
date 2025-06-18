export type ICharacterStatusType = 'Alive' | 'Dead' | 'unknown';

export type ICharacterGenderType = 'Male' | 'Female' | 'Genderless' | 'unknown';

export interface ICharacterOrigin {
  name: string;
  url: string;
}

export interface ICharacterLocation {
  name: string;
  url: string;
}

export interface ICharacter {
  id: number;
  name: string;
  status: ICharacterStatusType;
  species: string;
  type: string;
  gender: ICharacterGenderType;
  origin: ICharacterOrigin;
  location: ICharacterLocation;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface IPaginatedResponse {
  count?: number;
  pages?: number;
  next?: string | null;
  prev?: string | null;
}

export interface ICharactersResponse {
  info: IPaginatedResponse;
  results: ICharacter[];
}

export interface IEpisode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string;
}

export interface ILocation {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
  url: string;
  created: string;
}

export interface IEpisodesResponse {
  info: IPaginatedResponse;
  results: IEpisode[];
}

export interface ILocationResponse {
  info: IPaginatedResponse;
  results: ILocation[];
}
