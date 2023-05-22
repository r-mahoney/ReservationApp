/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundry = require("../errors/asyncErrorBoundry");

function asDateString(date) {
    return `${date.getFullYear().toString(10)}-${(date.getMonth() + 1)
        .toString(10)
        .padStart(2, "0")}-${date.getDate().toString(10).padStart(2, "0")}`;
}

function notATuesday(req, res, next) {
    const {
        data: { reservation_date },
    } = req.body;

    let reservationDay = new Date(reservation_date.replace(/-/g, "/"));
    if (reservationDay.getDay() === 2) {
        next({
            status: 400,
            message: "Restaraunt is closed on Tuesdays",
        });
    }
    next();
}

function futureDate(req, res, next) {
    const today = new Date();
    const date = asDateString(today);
    const time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const check1 = new Date(reservation_date + " " + reservation_time);
    const check2 = new Date(date + " " + time);
    const {
        data: { reservation_date, reservation_time, status },
    } = req.body;

    if (
        new Date(reservation_date + " " + reservation_time) <
        new Date(date + " " + time)
    ) {
        console.log(
            new Date(reservation_date + " " + reservation_time),
            new Date(date + " " + time)
        );
        next({
            status: 400,
            message: `Date must be in the future. res: ${check1} today: ${check2}`,
        });
    }
    next();
}

function inWorkingHours(req, res, next) {
    const {
        data: { reservation_date, reservation_time },
    } = req.body;

    if (
        new Date(reservation_date + " " + reservation_time) <
            new Date(reservation_date + " " + "10:30:00") ||
        new Date(reservation_date + " " + reservation_time) >
            new Date(reservation_date + " " + "21:30:00")
    ) {
        next({
            status: 400,
            message: "Reservation time is outside of working hours",
        });
    }
    next();
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

function partySizeIsValid(req, res, next) {
    const {
        data: { people },
    } = req.body;
    if (people <= 0 || !Number.isInteger(people)) {
        return next({
            status: 400,
            message: `Party size is an invalid amount of people`,
        });
    }
    next();
}

function dateIsValid(req, res, next) {
    const {
        data: { reservation_date },
    } = req.body;
    const array = reservation_date.split("-");
    let month = parseInt(array[1]);
    let day = parseInt(array[2]);
    let year = parseInt(array[0]);
    let ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (month == 1 || month > 2) {
        if (day > ListofDays[month - 1]) {
            return next({
                status: 400,
                message: "reservation_date is invalid",
            });
        }
    } else if (year.length !== 4) {
        return next({
            status: 400,
            message: "reservation_date is invalid",
        });
    }
    next();
}

function timeIsValid(req, res, next) {
    const {
        data: { reservation_time },
    } = req.body;
    let array = reservation_time.split(":");
    let hour = parseInt(array[0]);
    let minute = parseInt(array[0]);
    let second = parseInt(array[0]);
    if (
        hour < 0 ||
        hour > 24 ||
        isNaN(hour) ||
        minute < 0 ||
        minute > 59 ||
        isNaN(minute) ||
        second < 0 ||
        second > 59 ||
        isNaN(second)
    ) {
        return next({
            status: 400,
            message: "invalid reservation_time",
        });
    }
    next();
}

function okStatus(req, res, next) {
    let reservation = res.locals.reservation;
    if (reservation.status === "finished") {
        next({
            status: 400,
            message: "cannot update finished reservation",
        });
    }
    if (req.body.data.status === "unknown") {
        next({
            status: 400,
            message: "cannot update with unknown status",
        });
    }
    next();
}
async function reservationExists(req, res, next) {
    const reservation = await service.read(Number(req.params.reservation_id));

    if (reservation) {
        res.locals.reservation = reservation;
        next();
    } else {
        next({
            status: 404,
            message: `${req.params.reservation_id} can not be found`,
        });
    }
}

async function list(req, res) {
    let data;
    if (req.query.date) {
        const { date } = req.query;
        data = await service.list(date);
        data = data.filter((reservation) => reservation.status !== "finished");
    } else if (req.query.mobile_number) {
        const { mobile_number } = req.query;
        data = await service.search(mobile_number);
    }
    res.json({ data });
}

async function create(req, res, next) {
    const data = await service.create(req.body.data);
    if (data.status !== "booked") {
        next({
            status: 400,
            message: "Reservation can not start as finished or seated",
        });
    } else {
        res.status(201).json({ data });
    }
}

async function read(req, res, next) {
    const { reservation: data } = res.locals;
    res.status(200).json({ data });
}

// async function update(req, res, next) {
//     const reservation = res.locals.reservation;

//     const updatedReservation = {
//         ...reservation,
//         ...req.body.data,
//     };
//     const data = await service.update(updatedReservation);
//     console.log(data)

//     res.status(200).json({ data });
// }

async function update(req, res, next) {
    const reservation = res.locals.reservation;

    const updatedReservation = {
        ...req.body.data,
        reservation_id: reservation.reservation_id,
    };

    const data = await service.update(updatedReservation);
    res.status(200).json({ data });
}

module.exports = {
    list,
    create: [
        bodyDataHas("first_name"),
        bodyDataHas("last_name"),
        bodyDataHas("mobile_number"),
        bodyDataHas("reservation_date"),
        bodyDataHas("reservation_time"),
        bodyDataHas("people"),
        dateIsValid,
        partySizeIsValid,
        timeIsValid,
        notATuesday,
        futureDate,
        inWorkingHours,
        asyncErrorBoundry(create),
    ],
    read: [reservationExists, asyncErrorBoundry(read)],
    update: [reservationExists, okStatus, asyncErrorBoundry(update)],
    bodyDataHas,
    dateIsValid,
    partySizeIsValid,
    timeIsValid,
    notATuesday,
    futureDate,
    inWorkingHours,
};
