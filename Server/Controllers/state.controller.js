import { State } from "../Models/state.model.js";

export const addState = async (req,res) => {
    try {
        const {stateData} =req.body;
        const {username} =req.user;
        const checkState = await State.findOne({where:{state_code:stateData.state_code}});
        if(checkState){
            return res.status(400).json({message:"State already exists"});
        }
        const newState = await State.create({
            state_code:stateData.state_code,
            state_name:stateData.state_name,
            created_by:username,
            updated_by:username
        })
        let obj = {
            state_name: newState.state_name,
            state_code:stateData.state_code
        }
        return res.status(200).json({message:"State created", state:obj})
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:error.message})
    }
}

export const readState = async (req,res) => {
    try {
        const states = await State.findAll();
        if(states.length === 0){
            return res.status(204).json({message:"No states added"});
        }
        return res.status(200).json({states:states})
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:error.message})
    }
}

export const editState = async (req,res) => {
    try {
        const {newname, newcode} = req.body;
        const {id} =req.params
        const {username} = req.user;
        const findState = await State.findByPk(id);
        if(!findState){
            return res.status(400).json({message:"State doesn't exist"});
        }
        if(newname){
            const checkstate = await State.findOne({where:{state_name:newname}});
            if(checkstate)
                return res.status(400).json({message:"State already exists with this name, please change it"});
            else{ 
            findState.state_name = newname;
            }
        }
        if(newcode) {
            const checkstate = await State.findOne({where:{state_code:newcode}});
            if(checkstate){
                return res.status(400).json({message:"State already exists with this code, please change it"});
            }
            else{
            findState.state_code = newcode;
            }
        }
        findState.updated_by = username;
        await findState.save();
        return res.status(200).json({message:"State Updated"});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:error.message});
    }
}

export const activeUpdateState = async (req,res) => {
    try {
        const {isActive} =req.body;
        const {id} =req.params
        const checkState = await State.findByPk(id);
        checkState.isActive = isActive;
        await checkState.save();
        return res.status(200).json({message:`${isActive == true ? "Active" :"Inactive" } state set`})
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:error.message});
    }
}

export const deleteState = async (req,res) => {
    try {
        const {id} = req.params;
        const checkState = await State.findByPk(id);
        if(!checkState){
            return res.status(400).json({message:"State doesn't exist"});
        }
        await checkState.destroy();
        return res.status(200).json({message:"State Deleted"})
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:error.message});
    }
}