const knex = require('knex');
const { Model } = require('objection');
const config = require('../knexfile')['development'];

const connection = knex(config);

Model.knex(connection);

class Stage extends Model {
  static get tableName() {
    return 'stages';
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: Stage,
        join: {
          from: 'stages.id',
          to: 'user.id'
        }
      }
    }
  }
}

module.exports = { Stage };


