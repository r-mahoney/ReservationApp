const service = require("./tables.service");
const asyncErrorBoundry = require("../errors/asyncErrorBoundry");
const { read: resRead} = require("../reservations/reservations.service");

async function list(req, res, next) {
    const data = await service.list();

    res.json({ data });
}

function bodyDataHas(propertyName) {
    return function (req, res, next) {
        const { data = {} } = req.body;
        if (data[propertyName]) {
            return next();
        }
        next({ status: 400, message: `Must include a ${propertyName}` });
    };
}

function capacityIsNonZeroNum(req, res, next) {
    const {
        data: { capacity },
    } = req.body;

    if(typeof capacity === "string" || capacity < 1) {
        next({
            status: 400,
            message: "capacity must be a number > 0"
        })
    } else {
        next()
    }
}
function tableNameLength(req, res, next) {
    const {
        data: { table_name },
    } = req.body;
    if (table_name.length >= 2) {
        next();
    } else {
        next({
            status: 400,
            message: "table_name must be longer than 1 character",
        });
    }
}

async function tableExists(req, res, next) {
    const table = await service.read(req.params.tableId);

    if (table) {
        res.locals.table = table;
        next();
    } else {
        next({
            status: 404,
            message: "No table found",
        });
    }
}

async function update(req, res, next) {
    const reservation = await resRead(req.body.data.reservation_id);
    const table = await service.read(res.locals.table.table_id);

    if(!reservation) {
        next({
            status: 404,
            message: `${req.body.data.reservation_id} does not exist`
        })
    }
    if(table.capacity < reservation.people) {
        next({
            status: 400,
            message: "table capacity less than party size"
        })
    }
    
    if(table.table_status === "Occupied") {
        next({
            status: 400,
            message: "Table is currently occupied"
        })
    }
    const updatedTable = {
        ...req.body.data,
        table_status: "Occupied",
        table_id: res.locals.table.table_id,
    };
    const data = await service.update(updatedTable);
    res.json({ data });
}

async function create(req, res, next) {
    await service.create(req.body.data);

    res.status(201).json({ data: req.body.data });
}

module.exports = {
    list,
    create: [
        bodyDataHas("table_name"),
        bodyDataHas("capacity"),
        capacityIsNonZeroNum,
        tableNameLength,
        asyncErrorBoundry(create),
    ],
    update: [
        bodyDataHas("reservation_id"),
        tableExists, 
        asyncErrorBoundry(update)],
};
