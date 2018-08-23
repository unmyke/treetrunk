import { SequelizeRepository } from '../../_lib';
import { isEqualValues } from '../../../../domain/_lib/BaseMethods';

export class PostSequelizeRepository extends SequelizeRepository {
  async addPieceRate(postId, value, day) {
    const postModel = await this.Model.findById(postId);
    await this.postModel.createPieceRate({ value, day });

    return await this.mapper.toEntity(await postModel.reload());
  }

  async deletePieceRate(postId, day) {
    const postModel = await this.Model.findById(postId.value);
    const appointmentModel = await postModel.appointments.find(
      ({ day: appointmentDay }) => isEqualValues(day, appointmentDay)
    );

    await appointmentModel.removePieceRate(appointmentModel);

    return await this.mapper.toEntity(await postModel.reload());
  }

  async updatePieceRate(postId, day, newPostId, newDay) {
    await this.deletePieceRate(postId, day);
    return await this.addPieceRate(postId, newPostId, newDay);
  }
}
