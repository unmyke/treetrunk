import { SequelizeRepository } from '../../_lib';

export class SellerSequelizeRepository extends SequelizeRepository {
  async addAppointment(sellerId, postId, day) {
    const sellerModel = await this.Model.findById(sellerId.value);
    const appointment = await this.models.Appointments.create({
      postId: postId.value,
      day: day.value,
    });

    return await this.mapper.toEntity(
      sellerModel.createSellerAppointment(appointment)
    );
  }
}
