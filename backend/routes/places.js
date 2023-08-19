var express = require('express');
var router = express.Router();
const Place = require('../models/places')

    /**
     * Description :
     * add a place to the database
     */
    router.post('/add', (req,res)=>{

        // check if POST datas is empty
        if ((!req.body.nickname)||(!req.body.name)||(!req.body.latitude)||(!req.body.longitude)) {
            res.json({ result: false, error: 'field the input' });
            return;
          }

        // find a place by nickanme and city name
        Place.findOne({nickname: req.body.nickname, name:req.body.name})
        .then(data=>{
        // if place is not found, create a place
        if(!data){
            const newPlace = new Place({
                nickname: req.body.nickname,
                name:req.body.name,
                latitude:req.body.latitude,
                longitude:req.body.longitude,
            })
            newPlace.save() // save the place to the database
            res.json({true:'the place is added'}) // return the route response (valid reponse)
        }else{
            res.json({err:'the place already exists'}) // return the route response (fail response)
        }
        })

    })

    /**
     * Description :
     * GET user places from the database
     * 
     * @param {any} req require the user nickame
     * @param {any} res is the route response in json format
     */
    router.get('/places/:nickname',(req,res)=>{

        // find user places by user nickname
        Place.find({nickname: req.params.nickname})
        .then(data=>{
            data ? res.json({result: true, places: data}) : res.json({result: false, }); // send the route response
        })
        
    })

    /**
     * Description :
     * delete a place from the database 
     * 
     * @param {any} req require the user nickame and the city name
     * @param {any} res is the route response in json format
     */
    router.delete('/delete',(req, res)=>{

        // delete a place  by user nickname and the cityname
        Place.deleteOne({nickname: req.body.nickname, name: req.body.name})

        // send the route response
        res.json({ response :'the place is delete'});
    })

module.exports = router;
