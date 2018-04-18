import { SequelizeRepository } from './lib/SequelizeRepository';

export class SellerRepository extends SequelizeRepository {
  async add({ id, personName, phone, appointments }) {

    const seller = await this.models.Seller.add();

    return seller;
  }

  getSellerById(id) {

  }
}