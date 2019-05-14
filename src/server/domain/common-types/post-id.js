import { BaseId } from '../_lib';

export default class PostId extends BaseId {
  isDismissPostId() {
    return this.equals(PostId.dismissPostId);
  }
}
