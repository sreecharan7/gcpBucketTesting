import gcpbucketMiddleware from "./middlewares/gcpbucket.middleware.js";
import upload from "./middlewares/fileupload.middleware.js";
import expess from "express";

const app=expess();


app.post("/file",upload.single("file"),gcpbucketMiddleware,(req,res,next)=>{
    res.json(req.file);
});



app.listen(3000,()=>{
    console.log("Server is started at the port 3000");
})