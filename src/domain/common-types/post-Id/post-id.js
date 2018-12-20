import { BaseId } from '../../_lib';

export class PostId extends BaseId {
  isQuitPostId() {
    return this.equals(PostId.quitPostId);
  }
}
