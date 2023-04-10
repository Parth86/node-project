const { default: mongoose } = require('mongoose')
const User = require('../models/User')
const router = require('express').Router()
const verifyApiToken = require("../middlewares/verifyApiToken")
const verifyAdmin = require("../middlewares/verifyAdmin")

var randomstring = require("randomstring");

router.post('/create', verifyApiToken, verifyAdmin, async(req, res) => {
    const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        role: req.body.role
    };
    try {
        const prevUser = await User.find({
            role: req.body.role
        }).sort({code: -1}).limit(1)
        // console.log(prevUser)
        if(req.body.role == 2){
            if(Object.keys(prevUser).length != 0 && prevUser.code){
                var code = "VR" + (Number(prevUser.code.substring(2))+1)
            } else {
                var code = "VR" + "1001"
            }
        } else if(req.body.role == 3){
            if(Object.keys(prevUser).length != 0 && prevUser.code){
                var code = "SM" + (Number(prevUser.code.substring(2))+1)
            } else {
                var code = "SM" + "1001"
            }}
        data['code'] = code
        // console.log(data)
        const user = await User.create(data)
        return res.json(user)
    } catch (error) {
        return res.status(500).json({
            'data': {
                'data': null,
                'status': false,
                'message': error
            }
        })
    }
    
})
router.post('/login', async(req, res) => {
    try {
        var user = await User.findOne({
            password: req.body.password, 
            $or: [{email: req.body.email}, {phone: req.body.email}]
        })
        if(!user){
            return res.status(500).json({
                'data': {
                    'data': null,
                    'status': false,
                    'message': 'Login Failed'
                }
            })  
        }
        // user =  await user.update({
        //     api_token: randomstring.generate(60)
        // }, {
        //     new: true
        // })
        user.api_token = randomstring.generate(60)
        await user.save()
        return res.status(200).json({
            'data': {
                'data': user,
                'status': true,
                'message': 'Login Successful'
            }
        }) 
    } catch (error) {
        return res.status(500).json({
            'data': {
                'data': null,
                'status': false,
                'message': error
            }
        })
    }   
})
router.post('/edit',verifyApiToken, verifyAdmin, async (req, res) => {
    try {
        const data = {}
        const {id, email, password, code, phone, name, status} = req.body
        if(email){
            data['email'] = email
        }
        if(password){
            data['password'] = password
        }
        if(code){
            data['code'] = code
        }
        if(phone){
            data['phone'] = phone
        }
        if(name){
            data['name'] = name
        }
        if(status){
            data['status'] = status
        }
        const user = await User.findByIdAndUpdate(id, data, {new: true})
        return res.status(200).json({
            'data': {
                'data': user,
                'status': true,
                'message': "User Edited Successfully"
            }
        })
    } catch (error) {
        return res.status(500).json({
            'data': {
                'data': null,
                'status': false,
                'message': error
            }
        })
    }    
})
router.get('/get', verifyApiToken, verifyAdmin, async(req, res) => {
    if(req.body.id){
        return res.status(200).json({
            'data': {
                'data': await User.findById(req.body.id),
                'status': true,
                'message': "User Fetched Successfully"
            }
        })
    }
    const role = req.body.role.toLowerCase()
    if(role == 'vendor'){
        const users = await User.find({role: 2})
        console.log(users)
        return res.status(200).json({
            'data': {
                'data': users,
                'status': true,
                'message': "Vendors Fetched Successfully"
            }
        })
    } else if (role == 'salesman'){
        const users = await User.find({role: 3})
        return res.status(200).json({
            'data': {
                'data': users,
                'status': true,
                'message': "Salesmen Fetched Successfully"
            }
        })
    } else {
        return res.status(500).json({
            'data': {
                'data': null,
                'status': false,
                'message': "Role must be either vendor or salesman"
            }
        })
    }
})


module.exports = router