/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");

async function list(req, res) {
    const {date} = req.query;
    
    const data = await service.list(date);
    res.json({ data });
}

async function create(req, res) {
    const newReservation = await service.create(req.body.data);

    res.status(201).json({ data: newReservation });
}

module.exports = {
    list,
    create,
};
