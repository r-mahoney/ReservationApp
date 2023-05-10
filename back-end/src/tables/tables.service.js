const knex = require("../db/connection")

function list() {
    return knex("tables")
        .select("*")
        .orderBy("table_name")
}

function create(table) {
    return knex("tables")
        .insert(table)
        .returning("*")
        .then(data => data[0])
}

function update(table) {
    return knex("tables")
        .select("*")
        .where({table_id: table.table_id})
        .update(table, "*")
}

function read(table_id) {
    return knex("tables")
        .select("*")
        .where({table_id})
        .first()
}

module.exports = {
    list,
    create,
    read,
    update,
};