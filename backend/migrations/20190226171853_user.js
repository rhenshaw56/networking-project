
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('username');
      table.integer('parent_id').references('users.id').defaultTo(null);
      table.integer('bonus').defaultTo(0);
      table.integer('stages_id').references('stages.id');
    })
  ])
  
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users')
  ])
};
