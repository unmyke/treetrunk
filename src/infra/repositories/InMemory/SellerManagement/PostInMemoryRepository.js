import { InMemoryRepository } from '../InMemoryRepository';

export class PostInMemoryRepository extends InMemoryRepository {
  static uniqueness = {
    name: true,
  };

  static entityMapperName = 'Post';
  // appointments = [];
  // async add(seller) {
  //   const { sellerId, personName, phone, appointments } = seller;
  //   this.store.push({ sellerId, ...personName, phone });
  //   this.appointments.push(
  //     appointments.map(({ postId, day }) => ({
  //       sellerId,
  //       postId,
  //       day,
  //     }))
  //   );
  //   return seller;
  // }
}
