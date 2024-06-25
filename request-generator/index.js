import express from "express";
import request from "./src/requset.js";
import { performance } from 'perf_hooks';


const app=express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.post("/request",async (req,res)=>{
    try{
        console.time('request');
        let data=await request();
        console.timeEnd('request');
        res.json(data);
    }catch(err){
        res.status(400).send("something went wrong");
    }
});

app.post("/multiple-request",async(req,res)=>{
    try{
        const repeat=req.body?.repeat || 10;
        let arr=[];
        const start = performance.now();
        for(let i=0;i<repeat;i++){
            arr.push(request());
        }
        const end = performance.now();
        arr=await Promise.all(arr);
        res.send({time:end-start,arr});
    }catch(err){
        console.log(err);
        res.status(400).send("something went wrong");
    }
});


app.listen(3001,()=>{
    console.log("server started at 3001");
})

