var express = require('express');
var router = express.Router();
const Place = require('../models/places')

    //ajout d'une ville en BDD
    router.post('/places', (req,res)=>{
        console.log('reqqqq',req.body);
        // si les champs sont pas remplis stop la fonction
        if ((!req.body.nickname)||(!req.body.name)||(!req.body.latitude)||(!req.body.longitude)) {
            res.json({ result: false, error: 'il faut tout remplir' });
            return;
          }

          // si la ville n'est pas déjà enregistrer à un utilisateur
          Place.findOne({nickname: req.body.nickname, name:req.body.name})
          .then(data=>{
            if(!data){
                //crée une nouvelle ville à cette utilisateur
                const newPlace = new Place({
                    nickname: req.body.nickname,
                    name:req.body.name,
                    latitude:req.body.latitude,
                    longitude:req.body.longitude,
                })
                newPlace.save().then(newPlace=>{
                    // ajoute le en BDD
                    res.json({true:'the place is add'})
                })
            }else{
                res.json({err:'place existe déjà'})
            }
          })

    })

    //depuis le nom d'une ville en params je récupère ses données
    router.get('/places/:nickname',(req,res)=>{

        Place.find({nickname: req.params.nickname})
        .then(data=>{
            if(data){
                res.json({result: true, places: data})
            }
        })
        
    })
    // avec le nom de la ville en params je le supprime de la BDD
    router.delete('/places',(req, res)=>{
        Place.deleteOne({nickname: req.body.nickname, name: req.body.name}).then(()=>{
            Place.find().then(data=>{
                res.json({true:'is delete'})
            })
        })
    })

module.exports = router;
