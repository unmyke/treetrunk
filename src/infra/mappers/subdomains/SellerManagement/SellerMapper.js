import { SellerManagementMapper } from './SellerManagementMapper';
import {
  SellerId as SellerIdMapper,
  PostId as PostIdMapper,
  Day as DayMapper,
} from '../../commonTypes';

export class SellerMapper extends SellerManagementMapper {
  constructor({ commonTypes, subdomains }) {
    super({ commonTypes, subdomains });
    this.sellerIdMapper = new SellerIdMapper({ subdomains, commonTypes });
    this.postIdMapper = new PostIdMapper({ subdomains, commonTypes });
    this.dayMapper = new DayMapper({ subdomains, commonTypes });
  }

  toDatabase({
    sellerId,
    firstName,
    middleName,
    lastName,
    phone,
    appointments,
  }) {
    return {
      sellerId: this.sellerIdMapper.toDatabase(sellerId),
      firstName,
      middleName,
      lastName,
      phone,
      appointments: appointments.map(({ postId, day }) => ({
        postId: this.postIdMapper.toDatabase(postId),
        date: this.dayMapper.toDatabase(day),
      })),
    };
  }

  toEntity({ sellerId, firstName, middleName, lastName, phone, appointments }) {
    const sellerEntity = new this.entities.Seller({
      sellerId: this.sellerIdMapper.toEntity({ value: sellerId }),
      firstName,
      middleName,
      lastName,
      phone,
    });

    sellerEntity.setAppointments(appointments);

    return sellerEntity;
  }
}
