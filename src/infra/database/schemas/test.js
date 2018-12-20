const { Model, Database } = require('mongorito');
const uuidv4 = require('uuid/v4');

const db = new Database('mongodb://localhost/treetrunk-test');
db.connect();

class Post extends Model {}
class Seller extends Model {}
Seller.embeds('appointments.post', Post);

db.register(Post);
db.register(Seller);

const postId1 = uuidv4();
const postId2 = uuidv4();
const sellerId1 = uuidv4();

const post1 = new Post({ id: postId1, name: 'postName1' });
const post2 = new Post({ id: postId2, name: 'postName1' });
const seller = new Seller({
  id: sellerId1,
  name: 'sellername',
  appointments: [
    { post: post1, day: new Date() },
    { post: post2, day: new Date() },
  ],
});

Promise.all([post1.save(), post2.save()]).then(() => seller.save());
