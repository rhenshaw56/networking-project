
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('stages').del()
    .then(function () {
      // Inserts seed entries
      return knex('stages').insert([
        {id: 1, reward: 200 },
        {id: 2, reward: 300 },
        {id: 3, reward: 450 },
        {id: 4, reward: 600 },
        {id: 5, reward: 800 },
        {id: 6, reward: 1000 },
      ]);
    });
};
