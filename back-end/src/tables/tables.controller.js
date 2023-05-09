const service = require("./tables.service");
const asyncErrorBoundry = require("../errors/asyncErrorBoundry");

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

async function tableExists(req, res, next) {
    const table = await service.read(req.params.tableId);

    if(table) {
        res.locals.table = table;
        next();
    } else {
        next({
            status:404,
            message: "No table found"
        })
    }
}

async function update(req, res, next) {
    const updatedTable = {
        ...req.body.data,
        table_id: res.locals.table.table_id
    }
    const data = await service.update(updatedTable);
    res.json({data})
}

async function create(req, res, next) {
    await service.create(req.body.data);

    res.status(201).json({ data: req.body.data });
}

module.exports = {
    list,
    create: [
        bodyDataHas("table_name"),
        bodyDataHas("table_capacity"),
        asyncErrorBoundry(create)
    ],
    update: [
        tableExists,
        asyncErrorBoundry(update)
    ]
};
