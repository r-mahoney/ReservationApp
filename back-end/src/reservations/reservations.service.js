const knex = require("../db/connection");

function list(date) {
    return knex("reservations")
        .select("*")
        .where({ reservation_date: date })
        .orderBy("reservation_time");
}

function create(reservation) {
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then(data => data[0]);
}

function read(reservation_id) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id })
        .first();
}

function update(reservation) {
    return knex("reservations")
    .select("*")
    .where({reservation_id: reservation.reservation_id})
    .update(reservation, "*")
    .then(created => created[0])
}

module.exports = {
    list,
    create,
    read,
    update
};
