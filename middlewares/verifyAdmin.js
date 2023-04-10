async function verifyAdmin(req, res, next){
    if(req.user.role != 1){
        return res.status(500).json({
            'data': {
                'data': null,
                'status': false,
                'message': 'Not Authorised'
            }
        })
    }
    next()
}

module.exports = verifyAdmin