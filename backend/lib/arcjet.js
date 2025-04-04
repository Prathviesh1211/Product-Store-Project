import arcjet,{detectBot, shield, tokenBucket} from '@arcjet/node'

import 'dotenv/config'
export const aj=arcjet({
    key:process.env.ARCJET_KEY,
    characteristics:['ip.src'],
    rules:[
        shield({mode:'LIVE'}),      //Attack protection --->shield
        detectBot({
            mode:'LIVE',
            allow:[
                "CATEGORY:SEARCH_ENGINE"
            ]                  //->Bot detection

        }),
        //Rate-limiting
        tokenBucket({
            mode:'LIVE',
            refillRate:5,
            interval:60,
            capacity:10,
        })
    ]
})