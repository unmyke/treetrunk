import { SequelizeRepository } from './_lib/SequelizeRepository';

export class SellerSequelizeRepository extends SequelizeRepository {
  async add({ sellerId, personName, phone, appointments }) {
    const seller = await this.models.Seller.add();

    return seller;
  }

  getSellerById(sellerId) {}
}
