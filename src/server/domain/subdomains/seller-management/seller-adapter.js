import { BaseAdapter } from '../../_lib';
import Seller from '../seller';
import Post from '../post';

export default class SellerManagementAdapter extends BaseAdapter {
  // Seller
  async getSellers(params) {
    return await params;
  }

  createSeller(sellerId, name, pieceRateValue, pieceRateDay) {
    const seller = new Seller({ sellerId, name });
    if (pieceRateValue) {
      seller.addPieceRate(pieceRateValue, pieceRateDay);
    }

    return this.repositories.Seller.save(seller);
  }

  getSellerById(sellerId) {
    return this.repositories.Seller.getById(sellerId);
  }

  updateSellerById(sellerId, { name }) {
    const post = this.repositories.Seller.getSellerById(postId);
    post.name = name;
    return this.repositories.Seller.save(post);
  }
}
