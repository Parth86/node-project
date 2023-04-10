const router = require('express').Router()
const { default: mongoose } = require('mongoose')
const verifyAdmin = require("../middlewares/verifyAdmin")
const Order = require('../models/Order')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })


// upload.single('product_photo')
router.post('/create', verifyAdmin, async(req, res) => {
    const data = {
        order_number: req.body.order_number,
        vendor_id: req.body.vendor,
        salesman_id: req.body.salesman,
        color: req.body.color,
        item: req.body.item
    };
    const prevOrder = await Order.find().sort({createdAt: -1}).limit(1)
    console.log(prevOrder)

    if(Object.keys(prevOrder).length != 0){
        var entryNumber = 'EN' + String(Number(prevOrder[0].entry_number.substring(2)) + 1)
    } else {
        var entryNumber = 'EN1001'
    }
    data['entry_number'] = entryNumber
    console.log(data)
    try {
        const order = await Order.create(data)
        console.log(order)
        return res.status(200).json({
            'data': {
                'data': order,
                'status': true,
                'message': "Order Created Successfully"
            }
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            'data': {
                'data': null,
                'status': false,
                'message': error
            }
        })
    }
})

module.exports = router