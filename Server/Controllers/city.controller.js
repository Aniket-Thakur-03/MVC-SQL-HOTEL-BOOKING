import { City } from "../Models/city.model.js";

export const addCity = async (req,res) => {
    try {
        const {cityData} =req.body;
        const {username} =req.user;
        const checkcity = await City.findOne({where:{city_std_code:cityData.city_std_code}});
        if(checkcity){
            return res.status(400).json({message:"City already exists"});
        }
        const newcity = await City.create({
            city_std_code:cityData.city_std_code,
            city_name:cityData.city_name,
            created_by:username,
            updated_by:username
        })
        let obj = {
            city_name: newcity.city_name,
            city_std_code:cityData.city_std_code
        }
        return res.status(200).json({message:"city created", city:obj})
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:error.message})
    }
}

export const readCity = async (req,res) => {
    try {
        const cities = await City.findAll();
        if(cities.length === 0){
            return res.status(204).json({message:"No cities added"});
        }
        return res.status(200).json({cities:cities})
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:error.message})
    }
}

export const editCity = async (req,res) => {
    try {
        const {newname, newcode} = req.body;
        const {id} =req.params
        const {username} = req.user;
        const findcity = await City.findByPk(id);
        if(!findcity){
            return res.status(400).json({message:"City doesn't exist"});
        }
        if(newname){
            const checkcity = await City.findOne({where:{city_name:newname}});
            if(checkcity)
                return res.status(400).json({message:"City already exists with this name, please change it"});
            else{ 
            findcity.city_name = newname;
            }
        }
        if(newcode) {
            const checkcity = await City.findOne({where:{city_std_code:newcode}});
            if(checkcity){
                return res.status(400).json({message:"City already exists with this code, please change it"});
            }
            else{
            findcity.city_std_code = newcode;
            }
        }
        findcity.updated_by = username;
        await findcity.save();
        return res.status(200).json({message:"City Updated"});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:error.message});
    }
}

export const activeUpdateCity = async (req,res) => {
    try {
        const {isActive} =req.body;
        const {id} =req.params
        const checkCity = await City.findByPk(id);
        checkCity.isActive = isActive;
        await checkCity.save();
        return res.status(200).json({message:`${isActive == true ? "Active" :"Inactive" } state set`})
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:error.message});
    }
}

export const deleteCity = async (req,res) => {
    try {
        const {id} = req.params;
        const checkCity = await City.findByPk(id);
        if(!checkCity){
            return res.status(400).json({message:"City doesn't exist"});
        }
        await checkCity.destroy();
        return res.status(200).json({message:"City Deleted"})
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:error.message});
    }
}