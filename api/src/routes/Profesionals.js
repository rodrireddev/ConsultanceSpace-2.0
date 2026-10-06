const {Router} = require('express');
const {Op} = require('sequelize');
const {Profesional} = require('../db');
const router = Router();

router.get('/profesional', async(req, res, next)=>{
    const {fullName,email} = req.query;
    if(fullName){
        try{
            const profesional = fullName? await Profesional.findAll() : res.status(404).send("profesional not found");
            if (profesional===null) res.status(200).send("user not found")
            else{
                let profesionalFilterByFullName=profesional;
                 profesionalFilterByFullName=profesional.filter((profesional)=>{
                 if(profesional.fullName.includes(fullName.toUpperCase()))return profesional.fullName
                 return profesional.fullName===fullName.toUpperCase()
                 })
                res.status(200).json(profesionalFilterByFullName)
            }
        }catch(err){
            next(err)
        }
    }

    else if(email){
        try{
            const profesional = email? await Profesional.findAll(
            {
                where: {
                    usuarioEmail:email,
                }
            }
                ) : res.status(404).send("profesional not found");
            if (profesional===null) res.status(200).send("user not found")
            else{
                res.status(200).json(profesional)
            }
        }catch(err){
            next(err)
        }
    }
    
})

module.exports = router;