import { Router } from 'express';
import { inject } from '../../utils/bottle-express';
import Status from 'http-status';

const SeniorityTypesController = {
  get router() {
    const router = Router();

    // router.use(inject('serializers.seniorityType'));

    router.get(
      '/',
      inject('SellerManagement', 'SeniorityType', 'getAllSeniorityTypes'),
      this.index
    );
    router.get(
      '/:seniorityTypeId',
      inject('SellerManagement', 'SeniorityType', 'getSeniorityType'),
      this.show
    );
    router.post(
      '/',
      inject('SellerManagement', 'SeniorityType', 'createSeniorityType'),
      this.create
    );
    router.put(
      '/:seniorityTypeId',
      inject('SellerManagement', 'SeniorityType', 'updateSeniorityType'),
      this.update
    );
    router.delete(
      '/:seniorityTypeId',
      inject('SellerManagement', 'SeniorityType', 'deleteSeniorityType'),
      this.delete
    );
    router.post(
      '/:seniorityTypeId/awards',
      inject('SellerManagement', 'SeniorityType', 'createSeniorityTypeAward'),
      this.createAward
    );
    router.put(
      '/:seniorityTypeId/awards',
      inject('SellerManagement', 'SeniorityType', 'updateSeniorityTypeAward'),
      this.updateAward
    );
    router.delete(
      '/:seniorityTypeId/awards',
      inject('SellerManagement', 'SeniorityType', 'deleteSeniorityTypeAward'),
      this.deleteAward
    );

    return router;
  },

  index(req, res, next) {
    const { getAllSeniorityTypes } = req;
    const { SUCCESS, ERROR } = getAllSeniorityTypes.outputs;

    getAllSeniorityTypes
      .on(SUCCESS, (seniorityTypes) => {
        res.status(Status.OK).json(seniorityTypes);
      })
      .on(ERROR, next);

    getAllSeniorityTypes.execute(req.query);
  },

  show(req, res, next) {
    const { getSeniorityType } = req;

    const { SUCCESS, ERROR, NOT_FOUND } = getSeniorityType.outputs;

    getSeniorityType
      .on(SUCCESS, (seniorityType) => {
        res.status(Status.OK).json(seniorityType);
      })
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          type: 'NotFoundError',
          details: error.details,
        });
      })
      .on(ERROR, next);

    getSeniorityType.execute(req.params.seniorityTypeId);
  },

  create(req, res, next) {
    const { createSeniorityType } = req;
    const {
      SUCCESS,
      VALIDATION_ERROR,
      ALREADY_EXISTS,
      ERROR,
    } = createSeniorityType.outputs;

    createSeniorityType
      .on(SUCCESS, (seniorityType) => {
        res.status(Status.CREATED).json(seniorityType);
      })
      .on(VALIDATION_ERROR, (error) => {
        res.status(Status.BAD_REQUEST).json({
          type: 'ValidationError',
          details: error.details,
        });
      })
      .on(ALREADY_EXISTS, (error) => {
        res.status(Status.CONFLICT).json({
          type: 'AlreadyExists',
          details: error.details,
        });
      })
      .on(ERROR, next);

    createSeniorityType.execute(req.body);
  },

  update(req, res, next) {
    const { updateSeniorityType } = req;
    const {
      SUCCESS,
      VALIDATION_ERROR,
      NOT_FOUND,
      ALREADY_EXISTS,
      NOTHING_TO_UPDATE,
      ERROR,
    } = updateSeniorityType.outputs;

    updateSeniorityType
      .on(SUCCESS, (seniorityType) => {
        res.status(Status.ACCEPTED).json(seniorityType);
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
      .on(ALREADY_EXISTS, (error) => {
        res.status(Status.CONFLICT).json({
          type: 'AlreadyExists',
          details: error.details,
        });
      })
      .on(NOTHING_TO_UPDATE, (error) => {
        res.status(Status.BAD_REQUEST).json({
          type: 'NothingToUpdate',
          details: error.details,
        });
      })
      .on(ERROR, next);

    updateSeniorityType.execute({
      seniorityTypeIdValue: req.params.seniorityTypeId,
      ...req.body,
    });
  },

  delete(req, res, next) {
    const { deleteSeniorityType } = req;
    const {
      SUCCESS,
      NOT_FOUND,
      NOT_ALLOWED,
      ERROR,
    } = deleteSeniorityType.outputs;

    deleteSeniorityType
      .on(SUCCESS, () => {
        res.status(Status.ACCEPTED).end();
      })
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          type: 'NotFoundError',
          details: error.details,
        });
      })
      .on(NOT_ALLOWED, (error) => {
        res.status(Status.CONFLICT).json({
          type: 'NotAllowedError',
          details: error.details,
        });
      })
      .on(ERROR, next);

    deleteSeniorityType.execute({
      seniorityTypeIdValue: req.params.seniorityTypeId,
    });
  },

  createAward(req, res, next) {
    const { createSeniorityTypeAward } = req;
    const {
      SUCCESS,
      VALIDATION_ERROR,
      NOT_FOUND,
      ALREADY_EXISTS,
      NOTHING_TO_UPDATE,
      ERROR,
    } = createSeniorityTypeAward.outputs;

    createSeniorityTypeAward
      .on(SUCCESS, (seniorityType) => {
        res.status(Status.CREATED).json(seniorityType);
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
      .on(ALREADY_EXISTS, (error) => {
        res.status(Status.CONFLICT).json({
          type: 'AlreadyExists',
          details: error.details,
        });
      })
      .on(NOTHING_TO_UPDATE, (error) => {
        res.status(Status.BAD_REQUEST).json({
          type: 'NothingToUpdate',
          details: error.details,
        });
      })
      .on(ERROR, next);

    createSeniorityTypeAward.execute({
      seniorityTypeIdValue: req.params.seniorityTypeId,
      ...req.body,
    });
  },

  updateAward(req, res, next) {
    const { updateSeniorityTypeAward } = req;
    const {
      SUCCESS,
      VALIDATION_ERROR,
      NOTHING_TO_UPDATE,
      NOT_FOUND,
      ERROR,
    } = updateSeniorityTypeAward.outputs;

    updateSeniorityTypeAward
      .on(SUCCESS, (seniorityType) => {
        res.status(Status.ACCEPTED).json(seniorityType);
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

    updateSeniorityTypeAward.execute({
      seniorityTypeIdValue: req.params.seniorityTypeId,
      ...req.body,
    });
  },

  deleteAward(req, res, next) {
    const { deleteSeniorityTypeAward } = req;
    const {
      SUCCESS,
      VALIDATION_ERROR,
      NOT_FOUND,
      ERROR,
    } = deleteSeniorityTypeAward.outputs;

    deleteSeniorityTypeAward
      .on(SUCCESS, (seniorityType) => {
        res.status(Status.ACCEPTED).json(seniorityType);
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

    deleteSeniorityTypeAward.execute({
      seniorityTypeIdValue: req.params.seniorityTypeId,
      ...req.body,
    });
  },
};

export { SeniorityTypesController };
