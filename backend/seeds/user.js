
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 100, username: 'user x', stages_id: 1 },
        {id: 200, username: 'user y', stages_id: 1 },
        {id: 300, username: 'user z', stages_id: 1 },
      ]);
    });
};
