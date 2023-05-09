
exports.up = function(knex) {
  return knex.schema.alterTable("tables", table => {
    table.string("table_status").defaultTo('Free').alter();
  })
};

exports.down = function(knex) {
    return knex.schema.alterTable("tables", table => {
        table.string("table_status").alter();
      })
};
