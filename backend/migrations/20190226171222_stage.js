
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('stages', (table) => {
      table.increments('id').primary();
      table.integer('reward');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('stages')
  ])
};
