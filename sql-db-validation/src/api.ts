// src/api.ts
//
// A deliberately small "app under test." It stands in for a real backend
// (e.g. Restful-Booker) so the whole example is self-contained and runnable
// in CI without a network dependency. The important part for the portfolio
// is the TEST, not this API — this just gives the test something real to
// hit and something real to verify at the DB layer afterward.

import express from "express";
import { insertBooking, getBookingById, deleteBooking, Booking } from "../utils/db";

export function createApp() {
  const app = express();
  app.use(express.json());

  app.post("/booking", (req, res) => {
    const { firstname, lastname, total_price, deposit_paid, checkin_date, checkout_date } = req.body;

    if (!firstname || !lastname || total_price == null) {
      return res.status(400).json({ error: "firstname, lastname, and total_price are required" });
    }

    const id = insertBooking({
      firstname,
      lastname,
      total_price,
      deposit_paid: deposit_paid ? 1 : 0,
      checkin_date,
      checkout_date,
    });

    res.status(201).json({ bookingid: id });
  });

  app.get("/booking/:id", (req, res) => {
    const booking = getBookingById(Number(req.params.id));
    if (!booking) return res.status(404).json({ error: "not found" });
    res.json(booking);
  });

  app.delete("/booking/:id", (req, res) => {
    deleteBooking(Number(req.params.id));
    res.status(204).send();
  });

  return app;
}
