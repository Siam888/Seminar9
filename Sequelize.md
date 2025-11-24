# Sequelize Basics & Common Methods

Sequelize is an ORM (Object-Relational Mapper) for Node.js.  
It helps us work with SQL databases using JavaScript classes and methods instead of writing raw SQL.

---

## 1. Defining a model

A **model** represents a table in the database.  
Each instance of the model represents a row in that table.

### Example: basic model definition

```js
import { Sequelize, DataTypes, Model } from 'sequelize';

const sequelize = new Sequelize('my_database', 'my_user', 'my_password', {
  storage: 'storage.db',
  dialect: 'sqlite', // or 'mysql', 'postgres', 'mariadb', 'mssql'
});

class User extends Model {}

User.init(
  {
    // Columns
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,          // connection instance
    modelName: 'User',  // model name in Sequelize
    tableName: 'users', // table name in the DB (optional, can be auto)
    timestamps: true,   // createdAt and updatedAt columns
  }
);
```

You can also define a model with `sequelize.define`, but `Model.init` is the more modern style.

---

## 2. Syncing models with the database

To create the table (if it does not exist) and sync the model with the DB:

```js
async function start() {
  try {
    await sequelize.authenticate();
    console.log('Connection OK');

    await sequelize.sync(); // or sequelize.sync({ alter: true }) in dev
    console.log('Models synchronized');
  } catch (err) {
    console.error('Error:', err);
  }
}

start();
```

---

## 3. Creating records

To **insert** new rows in the table, we can use:

### `Model.create()`

```js
const user = await User.create({
  username: 'john_doe',
  email: 'john@example.com',
  age: 25,
});

// user is an instance of User with the saved data
```

### `Model.bulkCreate()`

```js
const users = await User.bulkCreate([
  { username: 'alice', email: 'alice@example.com', age: 22 },
  { username: 'bob', email: 'bob@example.com', age: 30 },
]);
```

---

## 4. Querying / Reading records

Sequelize gives us many methods to **read** data.

### `Model.findAll()`

```js
import { Op } from 'sequelize';

// Get all users
const users = await User.findAll();

// Get users with filters
const adults = await User.findAll({
  where: { age: { [Op.gte]: 18 } }, // age >= 18
  order: [['age', 'DESC']],
  limit: 10,
});
```

### `Model.findOne()`

```js
const user = await User.findOne({
  where: { username: 'john_doe' },
});
```

### `Model.findByPk()` (primary key)

```js
const user = await User.findByPk(1); // find user with id = 1
```

### `Model.count()`

```js
const count = await User.count({
  where: { age: { [Op.gte]: 18 } },
});
```

---

## 5. Updating records

Two common ways to update:

### a) Instance method: `instance.save()`

```js
const user = await User.findByPk(1);

if (user) {
  user.age = 26; // or instance.set({});
  await user.save(); // generates UPDATE query
}
```

### b) Static method: `Model.update()`

```js
await User.update(
  { age: 30 },                    // new values
  { where: { username: 'bob' } }  // filter
);
```

---

## 6. Deleting records

To **delete** rows:

### `Model.destroy()`

```js
// Delete users under 18
await User.destroy({
  where: { age: { [Op.lt]: 18 } },
});

// Delete by id
await User.destroy({
  where: { id: 5 },
});
```

### `instance.destroy()`

```js
const user = await User.findByPk(3);
if (user) {
  await user.destroy();
}
```

---

## 7. Relationships (Associations)

Sequelize supports several types of relationships:

- `hasOne`
- `belongsTo`
- `hasMany`
- `belongsToMany` (many-to-many)

### Example models

```js
class Post extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: DataTypes.STRING,
  },
  { sequelize, modelName: 'User' }
);

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
  },
  { sequelize, modelName: 'Post' }
);
```

### One-to-many: User – Post

A **user has many posts**, and a **post belongs to a user**.

```js
User.hasMany(Post, {
  foreignKey: 'userId',
  as: 'posts',
});

Post.belongsTo(User, {
  foreignKey: 'userId',
  as: 'author',
});
```

This will expect a `userId` column in the `Posts` table.

---

## 8. Using relationship methods

When you define associations, Sequelize automatically creates **helper methods**.

### For `User.hasMany(Post)` and `Post.belongsTo(User)`

For a `User` instance (`user`):

- `user.getPosts()`
- `user.countPosts()`
- `user.setPosts(postArray)`
- `user.hasPost(post)`
- `user.hasPosts(postArray)`
- `user.addPost(post)`
- `user.addPosts(postArray)`
- `user.removePost(post)`
- `user.removePosts(postArray)`
- `user.createPost(data)`

For a `Post` instance (`post`):

- `post.getAuthor()`
- `post.setAuthor(user)`

#### Example usage

```js
const user = await User.create({ username: 'john_doe' });

// Create a post for this user
const post = await user.createPost({
  title: 'My first post',
  content: 'Hello world!',
});

// Get all posts for this user
const posts = await user.getPosts();

// Get the author of a post
const author = await post.getAuthor();
```

---

## 9. Many-to-many relationships

For many-to-many, we use `belongsToMany` and a **join table**.

Example: Users and Roles. A user can have many roles, and a role can belong to many users.

```js
class Role extends Model {}

Role.init(
  {
    name: DataTypes.STRING,
  },
  { sequelize, modelName: 'Role' }
);

User.belongsToMany(Role, {
  through: 'UserRoles', // name of join table
  as: 'roles',
  foreignKey: 'userId',
});

Role.belongsToMany(User, {
  through: 'UserRoles',
  as: 'users',
  foreignKey: 'roleId',
});
```

Now we get helper methods:

For a `User` instance (`user`):

- `user.getRoles()`
- `user.addRole(role)`
- `user.addRoles([role1, role2])`
- `user.setRoles([...])`
- `user.removeRole(role)`

For a `Role` instance (`role`):

- `role.getUsers()`
- `role.addUser(user)`

#### Example

```js
const user = await User.create({ username: 'alice' });
const adminRole = await Role.create({ name: 'admin' });

// Add role to user
await user.addRole(adminRole);

// Get all roles of user
const roles = await user.getRoles();
```

---

## 10. Including related data (eager loading)

We can load related models using `include`.

```js
// Get user with their posts
const userWithPosts = await User.findByPk(1, {
  include: [
    {
      model: Post,
      as: 'posts',
    },
  ],
});

// Get posts with their author
const postsWithAuthor = await Post.findAll({
  include: [
    {
      model: User,
      as: 'author',
    },
  ],
});
```

---

## 11. Summary of common Sequelize methods

### Model-level (static) methods

- `create(data)`
- `bulkCreate(arrayOfData)`
- `findAll(options)`
- `findOne(options)`
- `findByPk(pk)`
- `update(values, options)`
- `destroy(options)`
- `count(options)`

### Instance methods

- `save()`
- `destroy()`
- `reload()`

### Association helper methods (examples)

- `getPosts()`, `createPost()`, `addPost()`, `setPosts()`
- `getAuthor()`, `setAuthor()`
- `getRoles()`, `addRole()`, `setRoles()`

These methods depend on how you define `hasOne`, `hasMany`, `belongsTo`, `belongsToMany`.
