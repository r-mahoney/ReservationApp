/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");

router
    .route("/")
    .get(controller.list)
    .post(controller.create)
    

router.route("/:reservation_id").get(controller.read).put(
        controller.bodyDataHas("first_name"),
        controller.bodyDataHas("last_name"),
        controller.bodyDataHas("mobile_number"),
        controller.bodyDataHas("reservation_date"),
        controller.bodyDataHas("reservation_time"),
        controller.bodyDataHas("people"),
        controller.dateIsValid,
        controller.partySizeIsValid,
        controller.timeIsValid,
        controller.notATuesday,
        controller.futureDate,
        controller.inWorkingHours,
        controller.update
    );

router.route("/:reservation_id/status").put(controller.update);

module.exports = router;
