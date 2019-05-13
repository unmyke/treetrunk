import BaseModel from './base-model';

export default class Seller extends BaseModel {
  static toEmbed = [
    {
      path: 'appointments.post',
      modelName: 'Seller',
    },
  ];
}

const extendSeller = (Seller) => {
  Seller.textFilterFields = function textFilterFields() {
    return ['firstName', 'middleName', 'lastName', 'phone'];
  };
};

Seller.use(extendSeller);
