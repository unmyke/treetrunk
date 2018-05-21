import { BaseMapper } from '../../_lib';
import { PostId as PostIdMapper, Day as DayMapper } from '../../commonTypes';

export class AppointmentMapper extends BaseMapper {
  constructor({ commonTypes, Entity }) {
    super({ commonTypes, Entity });
    this.postIdMapper = new PostIdMapper({ commonTypes });
    this.dayMapper = new DayMapper({ commonTypes });
  }

  toDatabase({ postId, day }) {
    return {
      postId: this.postIdMapper.toDatabase(postId),
      date: this.dayMapper.toDatabase(day),
    };
  }

  toEntity({ postId, date }) {
    const appointmentEntity = new this.Entity({
      postId: this.postIdMapper.toEntity({ value: postId }),
      day: this.dayMapper.toEntity({ value: date }),
    });

    return appointmentEntity;
  }
}
