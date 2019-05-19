import { BaseModel } from '../../_lib';

export default class Seller extends BaseModel {
  static toEmbed = [
    {
      path: 'appointments.post',
      modelName: 'Seller',
    },
  ];
}
