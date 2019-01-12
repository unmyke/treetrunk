import { Router } from 'express';
import {
  injectOperation,
  injectSerializer,
} from '../../../utils/bottle-express';
import Status from 'http-status';

const SellersController = {
  get router() {
    const router = Router();

    router.use(injectSerializer('SellerManagement', 'Seller'));

    router.get(
      '/',
      injectOperation('SellerManagement', 'Seller', 'getAllSellers'),
      this.index
    );
    router.get(
      '/:sellerId',
      injectOperation('SellerManagement', 'Seller', 'getSeller'),
      this.show
    );
    router.post(
      '/',
      injectOperation('SellerManagement', 'Seller', 'createSeller'),
      this.create
    );
    router.patch(
      '/:sellerId',
      injectOperation('SellerManagement', 'Seller', 'updateSeller'),
      this.update
    );
    router.delete(
      '/:sellerId',
      injectOperation('SellerManagement', 'Seller', 'deleteSeller'),
      this.delete
    );
    router.post(
      '/:sellerId/appointments',
      injectOperation('SellerManagement', 'Seller', 'createSellerAppointment'),
      this.createAppointment
    );
    router.patch(
      '/:sellerId/appointments',
      injectOperation('SellerManagement', 'Seller', 'updateSellerAppointment'),
      this.updateAppointment
    );
    router.delete(
      '/:sellerId/appointments',
      injectOperation('SellerManagement', 'Seller', 'deleteSellerAppointment'),
      this.deleteAppointment
    );

    return router;
  },

  index(req, res, next) {
    const { getAllSellers } = req;
    const { SUCCESS, ERROR } = getAllSellers.outputs;

    getAllSellers
      .on(SUCCESS, ({ sellers, posts, seniorityTypes }) => {
        res.status(Status.OK).json(
          req.serializer.serialize({
            data: sellers,
            included: { posts, seniorityTypes },
          })
        );
      })
      .on(ERROR, next);

    getAllSellers.execute(req.query);
  },

  show(req, res, next) {
    const { getSeller } = req;

    const { SUCCESS, ERROR, NOT_FOUND, VALIDATION_ERROR } = getSeller.outputs;

    getSeller
      .on(SUCCESS, ({ seller, posts, seniorityTypes }) => {
        res.status(Status.OK).json(
          req.serializer.serialize({
            data: seller,
            included: { posts, seniorityTypes },
          })
        );
      })
      .on(NOT_FOUND, (error) => {
        res
          .status(Status.NOT_FOUND)
          .json(req.serializer.serializeErrors(error, res.status));
      })
      .on(VALIDATION_ERROR, (error) => {
        res
          .status(Status.BAD_REQUEST)
          .json(req.serializer.serializeErrors(error, res.status));
      })
      .on(ERROR, next);

    getSeller.execute(req.params.sellerId);
  },

  create(req, res, next) {
    const { createSeller } = req;
    const {
      SUCCESS,
      VALIDATION_ERROR,
      ALREADY_EXISTS,
      ERROR,
    } = createSeller.outputs;

    createSeller
      .on(SUCCESS, ({ seller, posts, seniorityTypes }) => {
        res.status(Status.CREATED).json(
          req.serializer.serialize({
            data: seller,
            included: { posts, seniorityTypes },
          })
        );
      })
      .on(VALIDATION_ERROR, (error) => {
        res
          .status(Status.BAD_REQUEST)
          .json(req.serializer.serializeErrors(error, res.status));
      })
      .on(ALREADY_EXISTS, (error) => {
        res
          .status(Status.CONFLICT)
          .json(req.serializer.serializeErrors(error, res.status));
      })
      .on(ERROR, next);

    req.serializer.deserialize(req.body).then(
      (seller) => {
        createSeller.execute(seller);
      },
      (error) => {
        res
          .status(Status.BAD_REQUEST)
          .json(req.serializer.serializeErrors(error, res.status));
      }
    );
  },

  update(req, res, next) {
    const { updateSeller } = req;
    const {
      SUCCESS,
      VALIDATION_ERROR,
      NOT_FOUND,
      ALREADY_EXISTS,
      ERROR,
    } = updateSeller.outputs;

    updateSeller
      .on(SUCCESS, ({ seller, posts, seniorityTypes }) => {
        res.status(Status.CREATED).json(
          req.serializer.serialize({
            data: seller,
            included: { posts, seniorityTypes },
          })
        );
      })
      .on(VALIDATION_ERROR, (error) => {
        res
          .status(Status.BAD_REQUEST)
          .json(req.serializer.serializeErrors(error, res.status));
      })
      .on(NOT_FOUND, (error) => {
        res
          .status(Status.NOT_FOUND)
          .json(req.serializer.serializeErrors(error, res.status));
      })
      .on(ALREADY_EXISTS, (error) => {
        res
          .status(Status.CONFLICT)
          .json(req.serializer.serializeErrors(error, res.status));
      })
      .on(ERROR, next);

    req.serializer.deserialize(req.body).then(
      (seller) => {
        updateSeller.execute({ sellerId: req.params.sellerId, ...seller });
      },
      (error) => {
        res
          .status(Status.BAD_REQUEST)
          .json(req.serializer.serializeErrors(error, res.status));
      }
    );
  },

  delete(req, res, next) {
    const { deleteSeller } = req;
    const {
      SUCCESS,
      NOT_FOUND,
      VALIDATION_ERROR,
      NOT_ALLOWED,
      ERROR,
    } = deleteSeller.outputs;

    deleteSeller
      .on(SUCCESS, () => {
        res.status(Status.ACCEPTED).end();
      })
      .on(NOT_FOUND, (error) => {
        res
          .status(Status.NOT_FOUND)
          .json(req.serializer.serializeErrors(error, res.status));
      })
      .on(VALIDATION_ERROR, (error) => {
        res
          .status(Status.NOT_FOUND)
          .json(req.serializer.serializeErrors(error, res.status));
      })
      .on(NOT_ALLOWED, (error) => {
        res
          .status(Status.CONFLICT)
          .json(req.serializer.serializeErrors(error, res.status));
      })
      .on(ERROR, next);

    deleteSeller.execute(req.params.sellerId);
  },

  createAppointment(req, res, next) {
    const { createSellerAppointment } = req;
    const {
      SUCCESS,
      VALIDATION_ERROR,
      NOT_FOUND,
      ALREADY_EXISTS,
      ERROR,
    } = createSellerAppointment.outputs;

    createSellerAppointment
      .on(SUCCESS, ({ seller, posts, seniorityTypes }) => {
        res.status(Status.CREATED).json(
          req.serializer.serialize({
            data: seller,
            included: { posts, seniorityTypes },
          })
        );
      })
      .on(VALIDATION_ERROR, (error) => {
        res
          .status(Status.BAD_REQUEST)
          .json(req.serializer.serializeErrors(error, res.status));
      })
      .on(NOT_FOUND, (error) => {
        res
          .status(Status.NOT_FOUND)
          .json(req.serializer.serializeErrors(error, res.status));
      })
      .on(ALREADY_EXISTS, (error) => {
        res
          .status(Status.CONFLICT)
          .json(req.serializer.serializeErrors(error, res.status));
      })
      .on(ERROR, next);

    createSellerAppointment.execute(
      req.serializer.deserialize({
        ...req.body,
        sellerId: req.params.sellerId,
      })
    );
  },

  updateAppointment(req, res, next) {
    const { updateSellerAppointment } = req;
    const {
      SUCCESS,
      VALIDATION_ERROR,
      NOTHING_TO_UPDATE,
      NOT_FOUND,
      ERROR,
    } = updateSellerAppointment.outputs;

    updateSellerAppointment
      .on(SUCCESS, (seller) => {
        res.status(Status.ACCEPTED).json(seller);
      })
      .on(VALIDATION_ERROR, (error) => {
        res.status(Status.BAD_REQUEST).json({
          type: 'ValidationError',
          details: error.details,
        });
      })
      .on(NOTHING_TO_UPDATE, (error) => {
        res.status(Status.BAD_REQUEST).json({
          type: 'NothingToUpdate',
          details: error.details,
        });
      })
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          type: 'NotFoundError',
          details: error.details,
        });
      })
      .on(ERROR, next);

    updateSellerAppointment.execute({
      sellerIdValue: req.params.sellerId,
      ...req.body,
    });
  },

  deleteAppointment(req, res, next) {
    const { deleteSellerAppointment } = req;
    const {
      SUCCESS,
      VALIDATION_ERROR,
      NOT_FOUND,
      ERROR,
    } = deleteSellerAppointment.outputs;

    deleteSellerAppointment
      .on(SUCCESS, (seller) => {
        res.status(Status.ACCEPTED).json(seller);
      })
      .on(VALIDATION_ERROR, (error) => {
        res.status(Status.BAD_REQUEST).json({
          type: 'ValidationError',
          details: error.details,
        });
      })
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          type: 'NotFoundError',
          details: error.details,
        });
      })
      .on(ERROR, next);

    deleteSellerAppointment.execute({
      sellerIdValue: req.params.sellerId,
      ...req.body,
    });
  },
};

export { SellersController };