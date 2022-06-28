import { CarStatutEnum } from '../car/enums/car-statut.enum';
import { carburantEnum } from '../car/enums/carburant.enum';

export const CARS = [
  {
    marque: 'Dacia',
    model: 'Logan',
    matricule: 'ww8973',
    carburant: carburantEnum.Diesel,
    statut: CarStatutEnum.Disponible,
    description: '',
  },
  {
    marque: 'Ford',
    model: 'Fiesta',
    matricule: '322424-A -33',
    carburant: carburantEnum.Diesel,
    statut: CarStatutEnum.Disponible,
    description: 'test',
  },
  {
    marque: 'ford',
    model: 'focus',
    matricule: '3773-b -1',
    carburant: carburantEnum.Diesel,
    statut: CarStatutEnum.Disponible,
    description: '',
  },
  {
    marque: 'seat',
    model: 'ibiza',
    matricule: '73643-b -1',
    carburant: carburantEnum.Diesel,
    statut: CarStatutEnum.Disponible,
    description: '',
  },
  {
    marque: 'peugeot',
    model: '208',
    matricule: '6777-b -1',
    carburant: carburantEnum.Diesel,
    statut: CarStatutEnum.Disponible,
    description: '',
  },
];
