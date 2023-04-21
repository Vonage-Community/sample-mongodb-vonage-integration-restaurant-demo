import express from "express";
import cors from 'cors'
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Vonage } from "@vonage/server-sdk";
import { Auth } from '@vonage/auth'
import { SMS } from '@vonage/messages'
import * as dotenv from 'dotenv'
import fetch from 'node-fetch'
import { tokenGenerate } from '@vonage/jwt'
import { readFileSync } from "fs";
import Conversations from "./conversations";

dotenv.config({path: __dirname + '/../.env'})
const uri = process.env.MONGODB_DSN;
const client = new MongoClient(uri);

const vonage = new Vonage(new Auth({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET,
    applicationId: process.env.VONAGE_APPLICATION_ID,
    privateKey: process.env.VONAGE_PRIVATE_KEY
}))

const conversations = new Conversations(process.env.VONAGE_APPLICATION_ID, process.env.VONAGE_PRIVATE_KEY);

const app = express()
app.use(express.json())
app.use(cors())

app.all('/api/authenticate', (req, res) => {
    const { username, password } = req.body
    res.json({
        token: '1234'
    })
    return
})

app.get('/api/inventory', async (req, res) => {
    const cursor = client.db('restaurant_pos_demo').collection('inventory').find();
    const responseData = [];

    await cursor.forEach(row => {
        if (null === row.name) {
            return;
        }
        responseData.push({id: row._id.toString(), name: row.name, price: row.price});
    })
    res.json(responseData);
    return
})

app.post('/api/inventory', async (req, res) => {
    const { name, price } = req.body
    const result = await client.db('restaurant_pos_demo').collection('inventory').insertOne({
        name, price
    });
    res.json(result);
    return
})

app.get('/api/orders', async (req, res) => {
    const cursor = client.db('restaurant_pos_demo').collection('orders').find();
    const responseData = [];

    await cursor.forEach(row => {
        if (null === row.name) {
            return;
        }
        responseData.push({id: row._id.toString(), ...row});
    })
    res.json(responseData);
    return
})

app.all('/api/website/authenticate', async (req, res) => {
    const { username, password } = req.body
    const userRecord = await client.db('restaurant_pos_demo').collection('users').findOne({ username });

    if (userRecord) {
        await bcrypt.compare(password, userRecord.password)
            .then(async (match) => {
                if (match) {
                    const token = jwt.sign({user_id: userRecord._id }, process.env.JWT_SIGNING_KEY, { expiresIn: '15m'})
                    let verifyId = {request_id: 'abcd'};
                    if (process.env.ENABLE_VERIFY === "1") {
                        verifyId = await vonage.verify.start({number: userRecord.phone, brand: 'Vonage Restaurant'})
                        console.log(verifyId);
                    } else {
                        console.log('Verify Disabled');
                    }
                    
                    res.status(200).json({ token, verifyId: verifyId.request_id })
                } else {
                    res.status(401).send()
                }
            })
        return
    }

    res.status(401)
    res.send()
    return
})

app.all('/api/website/authenticate/verify', async (req, res) => {
    const { token, verifyId, tfaPin } = req.body
    const decodedToken = jwt.decode(token)
    const userRecord = await client.db('restaurant_pos_demo').collection('users').findOne({ _id: new ObjectId(decodedToken.user_id) });

    if (userRecord) {
        if (process.env.ENABLE_VERIFY === "1") {
            await vonage.verify.check(verifyId, tfaPin)
                .then(resp => {
                    console.log(resp)
                    const token = jwt.sign({user_id: userRecord._id }, process.env.JWT_SIGNING_KEY, { expiresIn: '2h'})
                    res.status(200).json({ token })
                })
                .catch(err => {
                    console.error("there was an error", err);
                })
            return
        } else {
            const token = jwt.sign({user_id: userRecord._id }, process.env.JWT_SIGNING_KEY, { expiresIn: '2h'})
            res.status(200).json({ token })
        }
    }

    res.status(500)
    res.send()
    return
})

app.all('/api/website/register', async (req, res) => {
    const { username, password, phone } = req.body

    await bcrypt.hash(password, 10)
        .then(async (hash) => {
            const userRecord = await client.db('restaurant_pos_demo').collection('users').insertOne({ username, phone, password: hash });
            res.status(201)
            res.send()
            return
        })
        .catch(err => {
            console.error(err)
            res.status(500)
            res.send(err)
            return
        })
})

app.post('/api/website/order', async (req, res) => {
    const { items } = req.body
    const bearerToken = req.header('authorization').split(' ')[1]
    const decodedToken = jwt.decode(bearerToken);
    const userRecord = await client.db('restaurant_pos_demo').collection('users').findOne({ _id: new ObjectId(decodedToken.user_id) });

    const orderTime = new Date().toISOString()
    const result = await client.db('restaurant_pos_demo').collection('orders').insertOne({
        items, orderTime, status: 0, lastUpdated: orderTime, user_id: userRecord._id
    });
    
    if (process.env.ENABLE_SMS === "1") {
        await vonage.messages.send(new SMS('Your order has been submitted', userRecord.phone, process.env.VONAGE_FROM));
    }

    res.json({id: result.insertedId});
    return
})

app.get('/api/website/themes', async (req, res) => {
    const privateKey = readFileSync(process.env.VONAGE_PRIVATE_KEY);
    const token = tokenGenerate(process.env.VONAGE_APPLICATION_ID, privateKey);

    // await fetch('https://api-eu.vonage.com/beta/meetings/themes', {
    //     method: 'POST',
    //     body: JSON.stringify({
    //         theme_name: 'Test Bad',
    //         main_color: '#a05683',
    //         brand_text: 'Vonage Restaurant',
    //         short_company_url: 'nexmo'
    //     }),
    //     headers: {
    //         'Authorization': 'Bearer ' + token,
    //         'Content-Type': 'application/json'
    //     }
    // })
    //     .then(resp => resp.json())
    //     .then((data: any) => {
    //         res.json(data)
    //     })
    //     .catch(err => console.error(err))
console.log(token)
    fetch('https://api-eu.vonage.com/beta/meetings/themes', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    })
        .then((data: any) => {
            res.json(data)
        })
        .catch(err => console.error(err))
})

app.post('/api/website/video-call', async (req, res) => {
    const { orderNumber } = req.body;
    const privateKey = readFileSync(process.env.VONAGE_PRIVATE_KEY);
    const token = tokenGenerate(process.env.VONAGE_APPLICATION_ID, privateKey);

    const bearerToken = req.header('authorization').split(' ')[1]
    const decodedToken = jwt.decode(bearerToken);

    fetch('https://api-eu.vonage.com/beta/meetings/rooms', {
        method: 'POST',
        body: JSON.stringify({
            display_name: 'Restaurant Demo',
            type: 'instant'
        }),
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    })
        .then(resp => resp.json())
        .then(async (data: any) => {
            console.log('guest url: ' + data._links.guest_url.href)
            console.log('host url: ' + data._links.host_url.href)
            const orderRecord = await client.db('restaurant_pos_demo').collection('orders').updateOne({ _id: new ObjectId(orderNumber) }, { $set: { meetingUrl: data._links.host_url.href}})
                .then(async (document) => {
                    const userRecord = await client.db('restaurant_pos_demo').collection('users').findOne({ _id: new ObjectId(decodedToken.user_id) });
                    await conversations.addEventToConversation(
                        'pos-notifications', userRecord.username, {type: 'custom:support_request', body: { host_url: data._links.host_url.href, email: userRecord.username}});
                    res.json({
                        guest_url: data._links.guest_url.href
                    })
                });
        })
        .catch(err => console.error(err))
});

app.get('/api/pos/notifications', async (req, res) => {

})

app.get('/get-events', async (req, res) => {
    const notifications = await conversations.fetchEventsByConversationName('pos-notifications');
    res.json(notifications);
})

app.post('/jwt', async (req, res) => {
    const { username } = req.body;
    const conversation = await conversations.fetchByName('pos-notifications');
    const conversationPath = `/*/conversations/${conversation.id}/**`;
    let acl = {
        "paths": {
            "/*/sessions/**": { },
          }
    }
    acl.paths[conversationPath] = { methods: ['GET'] }

    const key = readFileSync(process.env.VONAGE_PRIVATE_KEY);
    const token = tokenGenerate(process.env.VONAGE_APPLICATION_ID, key, {
        sub: username,
        acl: acl,
    });
    res.json({ token, conversation: conversation.id })
})

app.all('/rtc/events', async (req, res) => {
    console.log(req.body)
    res.status(200)
    res.send()
    return
})

app.get('/test', async (req, res) => {
    console.log(req.body)
    res.json({message: 'success'})
    return
})

app.listen(3005, ()  => {
    console.log('Server started')
})