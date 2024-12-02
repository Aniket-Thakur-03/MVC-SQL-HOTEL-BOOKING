export const userCheck = (req,res,next)=>{
    const {username, email, password} = req.body;
    if(!username || !email || !password){
        return res.status(400).json({message:"Incomplete information"});
    }
}