import { InMemoryDbService } from 'angular-in-memory-web-api';

import { Asset } from './asset';

export class AssetData implements InMemoryDbService {

  createDb() {
    const assets: Asset[] = [
      {
        id: 1,
        assetName: 'Bengaluru FootBall complex',
        assetCategory: 'Sports',
        description: 'FootBall ground',
        area:2250,
        price: 19,
        tags: [ 'outdoor', 'game']
      },
      {
        id: 2,
        assetName: 'Phoenix',
        assetCategory: 'Mall',
        area: 6550,
        description: 'Mall with the largest area in town.',
        price: 32
      },
      {
        id: 5,
        assetName: 'Hari Steels and Pipes',
        assetCategory: 'Shops',
        area: 5450,
        description: 'Steels and pipes wholesale distributors',
        price: 8,
        tags: ['tools', 'construction']
      },
      {
        id: 8,
        assetName: 'Kempegowda Domestic Airport',
        assetCategory: 'Airport',
        area: 3650,
        description: 'Airport with a difference !!',
        price: 11.5
      },
      {
        id: 10,
        assetName: 'Golf your way',
        assetCategory: 'Sports',
        area: 8550,
        description: 'Golf course with the best of facilities',
        price: 35
      },
       {
        id: 11,
        assetName: 'Grand Mall',
        assetCategory: 'Mall',
        area: 9550,
        description: 'Mall with the second largest area in town.',
        price: 22
      },
    ];
    return { assets };
  }
}