import rateLimit from "express-rate-limit";
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,  //15 min 
    max: 50,
});

export default limiter;
