
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('parent_benefits', (table) => {
      table.increments('id').primary();
      table.integer('parent_id').references('users.id');
      table.integer('amount');
      table.timestamp('createdAt').defaultTo(knex.fn.now());
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('parent_benefits')
  ])
};
