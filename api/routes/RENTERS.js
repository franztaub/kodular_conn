const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Renter = require('./models/RENTER');

router.get('/',(req, res, next) => {
    Renter.find()
    .select('_id room_ID name address contact_no email username password')
    .exec().then(docs => {
        const response = {
            count: docs.length,
            RENTERS:  docs.map(doc => {
                return {
                    _id: doc._id,
                    room_ID: doc.room_ID,
                    name: doc.name,
                    address: doc.address,
                    contact_no: doc.contact_no,
                    email: doc.email,
                    username: doc.username,
                    password: doc.password,
                    request: {
                        type: 'GET',
                        url: 'http://locahost:3000/RENTERS' + doc._id
                    }
                }
            })
        };
        //if (docs.length >= 0) {
            res.status(200).json(response);
        //} else {
        //    res.status(404)
        //}
        //res.status(200).json(docs);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
});

router.post('/',(req, res, next) => {
    const RENTER = new Renter({
            _id: new mongoose.Types.ObjectId(),
            room_ID: req.body.room_ID,
            address: req.body.address,
            contact_no: req.body.contact_no,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password

    });


    RENTER.save().then(result => { 
        console.log(result);
        res.status(201).json({
            message: 'Created renter successfully',
            createdRenter: {
                _id: result._id,
                room_ID: result.room_ID,
                address: result.address,
                contact_no: result.contact_no,
                email: result.email,
                username: result.username,
                password: result.password,
                request: {
                    type: 'POST',
                    url: 'http://locahost:3000/RENTERS' + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    
});

router.get('/:RENTERID', (req, res, next) => {
    const id = req.params.RENTERID;
    Renter.findById(id).exec().then(result => {console.log("From Database",result); 
        if (result) {
            res.status(200).json({
                message: 'Renter retrieved successfully',
                retrievedRenter: {
                _id: result._id,
                name: result.name,
                room_ID: result.room_ID,
                address: result.address,
                contact_no: result.contact_no,
                email: result.email,
                username: result.username,
                password: result.password,
                request: {
                    type: 'GET',
                    url: 'http://locahost:3000/RENTERS' + result._id
                }
            }
            });
        } else {
            res.status(404).json({message: 'No valid entry found for provided ID'});
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
})

router.patch('/:RENTERID', (req, res, next) => {
    const id = req.params.RENTERID;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Renter.findOneAndUpdate({_id: id}, { $set: updateOps }).exec()
    .then(result => {
        res.status(200).json({
            message: 'Renter updated',
            request: {
                type: 'Update',
                url: 'http://locahost:3000/RENTERS' + id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:RENTERID', (req, res, next) => {
    const id = req.params.RENTERID;
    Renter.deleteOne({_id: id}).exec().then(result => {
        res.status(200).json({
            message: 'Renter deleted',
            request: {
                type: 'delete', 
                url: 'http://locahost:3000/RENTERS' + id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});



module.exports = router;