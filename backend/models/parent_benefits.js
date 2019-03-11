const knex = require('knex');
const { Model } = require('objection');
const config = require('../knexfile')['development'];
const { User } = require('./user');

const connection = knex(config);

Model.knex(connection);

class Benefits extends Model {
  static get tableName() {
    return 'parent_benefits';
  }

  static get relationMappings() {
    return {
      parent_benefits: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'user.id',
          to: 'parent_benefits.parent_id'
        }
      }
    }
  }
}

module.exports = { Benefits };


