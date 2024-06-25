import cluster from "cluster";
import os from "os";
import gcpbucketMiddleware from "./middlewares/gcpbucket.middleware.js";
import upload from "./middlewares/fileupload.middleware.js";
import expess from "express";

let noOfServersBrokern=0;
// const noOfWorkers = (os.cpus().length)/2;
const noOfWorkers =15;


if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    console.log("no of workers are ",noOfWorkers);
    for (let i = 0; i < noOfWorkers; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        noOfServersBrokern++;
        console.log(`Worker ${worker.process.pid} died`);
        console.log(`no of servers brokern are ${noOfServersBrokern}`);
        console.log("Starting a new worker");
        cluster.fork();
    });

} else {

    const app=expess();

    app.post("/file",upload.single("file"),gcpbucketMiddleware,(req,res,next)=>{
        res.json(req.file);
    });

    app.listen(3000, () => {
        console.log(`Worker ${process.pid} started, Server is running at port 3000`);
    });
}
