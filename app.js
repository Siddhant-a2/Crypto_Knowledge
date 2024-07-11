// import 'dotenv/config'
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app= express();
const PORT=process.env.PORT||3000;
const BASE_URL="https://api.coinpaprika.com/v1/";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


const name=[];
const id=[];

const response=await axios.get(BASE_URL+"coins");
const result=response.data;
let s=result.length;
for(let i=0;i<s;i++){
    name.push(result[i].name);
    id.push(result[i].id);
}

const low=[];
const high=[];

app.get("/",async(req,res)=>{
    try {
        const bitcoin=await axios.get(BASE_URL+"coins/btc-bitcoin/ohlcv/today");
        const ethereum=await axios.get(BASE_URL+"coins/eth-ethereum/ohlcv/today");
        const tether=await axios.get(BASE_URL+"coins/usdt-tether/ohlcv/today");
        const binance=await axios.get(BASE_URL+"coins/bnb-binance-coin/ohlcv/today");
        const solana=await axios.get(BASE_URL+"coins/sol-solana/ohlcv/today");
        const lido=await axios.get(BASE_URL+"coins/steth-lido-staked-ether/ohlcv/today");
        
        low.push((bitcoin.data[0].low).toFixed(2));
        high.push((bitcoin.data[0].high).toFixed(2));
        low.push((ethereum.data[0].low).toFixed(2));
        high.push((ethereum.data[0].high).toFixed(2));
        low.push((tether.data[0].low).toFixed(2));
        high.push((tether.data[0].high).toFixed(2));
        low.push((binance.data[0].low).toFixed(2));
        high.push((binance.data[0].high).toFixed(2));
        low.push((solana.data[0].low).toFixed(2));
        high.push((solana.data[0].high).toFixed(2));
        low.push((lido.data[0].low).toFixed(2));
        high.push((lido.data[0].high).toFixed(2));
        res.render("index.ejs",{
            nm:name,
            identity:id,
            l:low,
            h:high
        });
    } catch (error) {
        console.log("Failed to make request:", error.message);
    }
})

app.post("/info",async(req,res)=>{
    try {
        const response=await axios.get(BASE_URL+`coins/${req.body.fname}/ohlcv/today`);
        const response2=await axios.get(BASE_URL+`coins/${req.body.fname}`)
        const result1=response.data[0];
        const result2=response2.data;
        res.render("action.ejs",{
            basicData:result1,
            coinsData:result2,
        })
    } catch (error) {
        console.log("Failed to make request:", error.message);
    }

});

app.listen(PORT,(req,res)=>{
    console.log(`listening on port ${PORT}`);
})