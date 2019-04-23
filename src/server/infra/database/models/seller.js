import BaseModel from './base-model';

export default class Seller extends BaseModel {
  static toEmbed = [
    {
      path: 'appointments.post',
      modelName: 'Post',
    },
  ];
}
