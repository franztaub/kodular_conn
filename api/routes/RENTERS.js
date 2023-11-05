const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Renter = require('./models/RENTER');

// Helper function to format a single renter
function formatRenter(renter) {
  return {
    _id: renter._id,
    room_ID: renter.room_ID,
    name: renter.name,
    address: renter.address,
    contact_no: renter.contact_no,
    email: renter.email,
    username: renter.username,
    password: renter.password,
    request: {
      type: 'GET',
      url: `http://localhost:3000/RENTERS/${renter._id}`
    }
  };
}

// GET all renters
router.get('/', (req, res, next) => {
  Renter.find()
    .select('_id room_ID name address contact_no email username password')
    .exec()
    .then((renters) => {
      const formattedRenters = renters.map(formatRenter);
      const response = {
        count: formattedRenters.length,
        RENTERS: formattedRenters
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// POST a new renter
router.post('/', (req, res, next) => {
  const renter = new Renter({
    _id: new mongoose.Types.ObjectId(),
    room_ID: req.body.room_ID,
    name: req.body.name,
    address: req.body.address,
    contact_no: req.body.contact_no,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  renter
    .save()
    .then((result) => {
      res.status(201).json({
        message: 'Created renter successfully',
        createdRenter: formatRenter(result)
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// GET a specific renter by ID
router.get('/:RENTERID', (req, res, next) => {
  const id = req.params.RENTERID;
  Renter.findById(id)
    .exec()
    .then((renter) => {
      if (renter) {
        res.status(200).json({
          message: 'Renter retrieved successfully',
          retrievedRenter: formatRenter(renter)
        });
      } else {
        res.status(404).json({ message: 'No valid entry found for provided ID' });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// ... Continue with your PATCH and DELETE routes as before

module.exports = router;
