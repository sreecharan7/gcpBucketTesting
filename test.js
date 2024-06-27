const arr=[4,5,6,7,5,6,6,6,4,4,4,4,4];

const arr2=new Array(3).fill(arr.entries()).map((arr)=>{
    for(var i of arr){
        console.log(i);
    }
    console.log("--------")
    return arr;
});

console.log(arr2);