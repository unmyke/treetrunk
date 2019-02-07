import { BaseId } from '../_lib';

export default class PostId extends BaseId {
  isQuitPostId() {
    return this.equals(PostId.quitPostId);
  }
}
