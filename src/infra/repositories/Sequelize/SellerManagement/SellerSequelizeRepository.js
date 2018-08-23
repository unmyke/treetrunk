import { SequelizeRepository } from '../../_lib';
import { isEqualValues } from '../../../../domain/_lib/BaseMethods';

export class SellerSequelizeRepository extends SequelizeRepository {
  async addAppointment({ value: sellerId }, { value: postId }, { value: day }) {
    const sellerModel = await this.Model.findById(sellerId);
    await this.sellerModel.createAppointment({
      post_id: postId,
      day,
    });

    return await this.mapper.toEntity(await sellerModel.reload());
  }

  async deleteAppointment(sellerId, day) {
    const sellerModel = await this.Model.findById(sellerId.value);
    const appointmentModel = await sellerModel.appointments.find(
      ({ day: appointmentDay }) => isEqualValues(day, appointmentDay)
    );

    await appointmentModel.removeAppointment(appointmentModel);

    return await this.mapper.toEntity(await sellerModel.reload());
  }

  async updateAppointment(sellerId, day, newPostId, newDay) {
    await this.deleteAppointment(sellerId, day);
    return await this.addAppointment(sellerId, newPostId, newDay);
  }
}
