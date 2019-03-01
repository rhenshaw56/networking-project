const knex = require('knex');
const { Model } = require('objection');
const config = require('../knexfile')['development'];
const { Stage } = require('./stages');

const connection = knex(config);

Model.knex(connection);

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: Stage,
        join: {
          from: 'user.stages_id',
          to: 'stages.id'
        }
      }
    }
  }
}

module.exports = { User };


