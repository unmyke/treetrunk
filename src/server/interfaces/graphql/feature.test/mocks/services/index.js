import getSeller from './get-seller';
import getSellersList from './get-sellers-list';
import updateSeller from './update-seller';
import deleteSeller from './delete-seller';
import restoreSeller from './restore-seller';
import destroySeller from './destroy-seller';
import createSeller from './create-seller';
import createSellerAppointment from './create-seller-appointment';
import updateSellerAppointment from './update-seller-appointment';
import deleteSellerAppointment from './delete-seller-appointment';
import dismissSeller from './dismiss-seller';
import updateSellerDismiss from './update-seller-dismiss';
import deleteSellerDismiss from './delete-seller-dismiss';
import getPost from './get-post';
import getPostsList from './get-posts-list';
import updatePost from './update-post';
import deletePost from './delete-post';
import restorePost from './restore-post';
import destroyPost from './destroy-post';
import createPost from './create-post';
import createPostPieceRate from './create-post-piece-rate';
import updatePostPieceRate from './update-post-piece-rate';
import deletePostPieceRate from './delete-post-piece-rate';
import getSeniorityType from './get-seniority-type';
import getSeniorityTypesList from './get-seniority-types-list';
import updateSeniorityType from './update-seniority-type';
import deleteSeniorityType from './delete-seniority-type';
import restoreSeniorityType from './restore-seniority-type';
import destroySeniorityType from './destroy-seniority-type';
import createSeniorityType from './create-seniority-type';
import getSeniorityTypeByMonths from './get-seniority-type-by-months';
import createSeniorityTypeAward from './create-seniority-type-award';
import updateSeniorityTypeAward from './update-seniority-type-award';
import deleteSeniorityTypeAward from './delete-seniority-type-award';

const services = {
  getSeller,
  getSellersList,
  updateSeller,
  deleteSeller,
  restoreSeller,
  destroySeller,
  createSeller,
  createSellerAppointment,
  updateSellerAppointment,
  deleteSellerAppointment,
  dismissSeller,
  updateSellerDismiss,
  deleteSellerDismiss,
  getPost,
  getPostsList,
  updatePost,
  deletePost,
  restorePost,
  destroyPost,
  createPost,
  createPostPieceRate,
  updatePostPieceRate,
  deletePostPieceRate,
  getSeniorityType,
  getSeniorityTypesList,
  updateSeniorityType,
  deleteSeniorityType,
  restoreSeniorityType,
  destroySeniorityType,
  createSeniorityType,
  getSeniorityTypeByMonths,
  createSeniorityTypeAward,
  updateSeniorityTypeAward,
  deleteSeniorityTypeAward,
};

export default Object.entries(services).reduce(
  (prevServices, [name, service]) => ({
    ...prevServices,
    [name]: jest.fn(service),
  }),
  {}
);
