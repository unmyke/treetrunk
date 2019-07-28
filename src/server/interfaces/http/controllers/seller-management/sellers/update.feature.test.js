import uuidv4 from 'uuid/v4';

import container from '@container';
import request from '@infra/tests/request';

const {
  entities: {
    SellerManagement: {
      entities: { Seller, Post },
    },
  },
  commonTypes: { Day, PostId },
  repositories: {
    SellerManagement: { Seller: sellerRepo },
  },
} = container;

const quitPostId = uuidv4();
PostId.quitPostId = quitPostId;

const post1 = new Post({ name: 'Флорист' });
const post2 = new Post({ name: 'Старший флорист' });

const dateDTO1 = '2018-01-21T00:00:00.000+08:00';
const dateDTO2 = '2018-02-21T00:00:00.000+08:00';
const appointmentsDTO = [
  { postId: post1.postId, date: dateDTO1 },
  { postId: post2.postId, date: dateDTO2 },
];

const date1 = new Date(dateDTO1);
const date2 = new Date(dateDTO2);

const sellerProps = {
  firstName: 'Firstname',
  middleName: 'Middlename',
  lastName: 'Lastname',
  phone: '00-00-00',
};
const day1 = new Day({ value: date1 });
const day2 = new Day({ value: date2 });
const appointments = [
  { postId: post1.postId, day: day1 },
  { postId: post2.postId, day: day2 },
];

let seller;
let sellerDTO;
let sellerToUpdate;
let updatedSellerDTO;

describe('API :: PUT /api/sellers/:id', () => {
  beforeEach(async () => {
    seller = new Seller(sellerProps);
    seller.setAppointments(appointments);
    sellerToUpdate = await sellerRepo.add(seller);

    sellerDTO = {
      sellerId: seller.sellerId.toString(),
      firstName: 'Firstname',
      middleName: 'Middlename',
      lastName: 'Lastname',
      phone: '00-00-00',
      appointments: appointmentsDTO,
    };
    updatedSellerDTO = {
      firstName: 'firstName',
      middleName: 'middleName',
      lastName: 'lastName',
      phone: '11-11-11',
    };
  });

  afterEach(() => {
    return sellerRepo.clear();
  });

  context('when props are correct', () => {
    test('should update and return 202 with the updated seller', async () => {
      const { statusCode, body } = await request()
        .put(`/api/sellers/${sellerToUpdate.sellerId}`)
        .set('Accept', 'application/json')
        .send(updatedSellerDTO);

      expect(statusCode).toBe(202);

      expect(body).toEqual({
        sellerId: sellerToUpdate.sellerId.toJSON(),
        fullName: 'lastName firstName middleName',
        firstName: 'firstName',
        lastName: 'lastName',
        middleName: 'middleName',
        phone: '11-11-11',
        appointments: [
          {
            date: '2018-01-21T00:00:00.000+08:00',
            postId: post1.postId.toJSON(),
          },
          {
            date: '2018-02-21T00:00:00.000+08:00',
            postId: post2.postId.toJSON(),
          },
        ],
        isQuited: false,
        recruitDay: '2018-01-21T00:00:00.000+08:00',
        isRecruited: true,
        seniority: sellerToUpdate.seniority,
        postId: post2.postId.toJSON(),
        postIds: [post1.postId.toJSON(), post2.postId.toJSON()],
      });
    });

    context('when props are invalid', () => {
      test('should not update and returns 400 with the validation error', async () => {
        const { statusCode, body } = await request()
          .put(`/api/sellers/${sellerToUpdate.sellerId}`)
          .send({
            firstName: '',
            middleName: '',
            lastName: '',
            phone: '0123telephone',
          });

        expect(statusCode).toBe(400);
        expect(body.type).toBe('ValidationError');
        expect(body.details).toEqual({
          firstName: ["First name can't be blank"],
          middleName: ["Middle name can't be blank"],
          lastName: ["Last name can't be blank"],
          phone: ['Phone is invalid'],
        });
      });
    });

    context('when send no props', () => {
      test('should not update and returns 400 with the validation error', async () => {
        const { statusCode, body } = await request()
          .put(`/api/sellers/${sellerToUpdate.sellerId}`)
          .send();

        expect(statusCode).toBe(400);
        expect(body.type).toBe('ValidationError');
        expect(body.details).toEqual({
          firstName: ["First name can't be blank"],
          middleName: ["Middle name can't be blank"],
          lastName: ["Last name can't be blank"],
          phone: ["Phone can't be blank"],
        });
      });
    });
  });

  context('when seller does not exist', () => {
    test('should not update and returns 400 with the not found message', async () => {
      const fakeSellerId = uuidv4();

      const { statusCode, body } = await request()
        .put(`/api/sellers/${fakeSellerId}`)
        .send(updatedSellerDTO);

      expect(statusCode).toBe(404);
      expect(body.type).toBe('NotFoundError');
      expect(body.details).toEqual({
        sellerId: [`Seller with sellerId: "${fakeSellerId}" not found`],
      });
    });
  });

  context('when seller with updated name already exists', () => {
    test('should not update and returns 409 with the already exists message', async () => {
      const duplicateSeller = new Seller(updatedSellerDTO);
      duplicateSeller.setAppointments(appointments);
      await sellerRepo.add(duplicateSeller);

      const { statusCode, body } = await request()
        .put(`/api/sellers/${sellerToUpdate.sellerId}`)
        .send(updatedSellerDTO);

      expect(statusCode).toBe(409);
      expect(body.type).toBe('AlreadyExists');
      expect(body.details).toEqual({
        lastName: [
          'Seller with lastName: "lastName", firstName: "firstName", middleName: "middleName", phone: "11-11-11" already exists',
        ],
      });
    });
  });

  context('when seller nothing to update', () => {
    test('should not update and returns 400 with the nothing to update message', async () => {
      const { statusCode, body } = await request()
        .put(`/api/sellers/${sellerToUpdate.sellerId}`)
        .send({
          firstName: 'Firstname',
          middleName: 'Middlename',
          lastName: 'Lastname',
          phone: '00-00-00',
        });

      expect(statusCode).toBe(400);
      expect(body.type).toBe('NothingToUpdate');
      expect(body.details).toEqual({
        seller: [
          'Seller already has lastName "Lastname", firstName "Firstname", middleName "Middlename" and phone "00-00-00"',
        ],
      });
    });
  });
});
