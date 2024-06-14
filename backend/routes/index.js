const { Router } = require('express');
const shippingPublisher = require('../publishers/shippingPublisher');
const onroadPublisher = require('../publishers/onroadPublisher');
const deliveredPublisher = require('../publishers/deliveredPublisher');

const router = Router();

const Delhivery=require('../model/Delhivery')
const DelhiveryAgent=require('../model/DelhiveryAgent')


router.get('/orders',async (req,res)=>{
   const all=await Delhivery.find()
    return res.status(200).json(all)
})


router.post('/order',async (req,res)=>{
 
  console.log(req.body)
    const newDelhivery=new Delhivery({
      deliveryId:req.body.deliveryId,
        userId:req.body.userId,
        orderId:req.body.orderId,
        pickupLocation:{
            location:req.body.pickupLocation.location,
            coordinates: {
                latitude:req.body.pickupLocation.coordinates.lat,
                longitude:req.body.pickupLocation.coordinates.long
              }
        }
    })

    await newDelhivery.save();

    res.status(200).json(newDelhivery)
})



router.get('/allAgents',async (req,res)=>{
  const all=await DelhiveryAgent.find()
   return res.status(200).json(all)
})


router.post('/addAgent',async (req,res)=>{
  console.log(req.body)
    const newDelhivery=new DelhiveryAgent({
        agentId:req.body.agentId,
       
        operatingLocation:{
            location:req.body.location,
            coordinates: {
                latitude:req.body.lat,
                longitude:req.body.long
              }
        }
    })

    await newDelhivery.save();
    res.status(200).json(newDelhivery)
})


router.put('/order/:id', async (req, res) => {
  try {
    //orderId means db schema orderId
    const orderId = req.params.id;
    const { status } = req.body;
    await Delhivery.updateOne({ orderId }, { $set: { status } });
    res.status(200).json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/agent/:id', async (req, res) => {
  try {
    const agentId = req.params.id;
    const { deliveryId, status } = req.body;
    await DelhiveryAgent.updateOne({ agentId }, { $set: { deliveryId, status } });
    res.status(200).json({ message: 'Agent details updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



const Log = require('../model/Log');

router.post('/log', async (req, res) => {


  try {

   
     await shippingPublisher(req.body);

    const { agentId, deliveryId, currentLocation, pickupLocation } = req.body;

    const newLog = new Log({
      agentId,
      deliveryId,//same as given in Delhivery.js
      currentLocation: {
        stateCapital: currentLocation.stateCapital,
        coordinates: {
          latitude: currentLocation.coordinates.lat,
          longitude: currentLocation.coordinates.long
        }
      },
      pickupLocation: {
       location: pickupLocation.location,
        coordinates: {
          latitude: pickupLocation.coordinates.lat,
          longitude: pickupLocation.coordinates.long
        }
      }
    });

    await newLog.save();

    


 

    res.status(200).json(newLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/', (req, res) => {
  res.send('Welcome to parcel tracking system');
});

router.get('/shipping/:name', async (req, res, next) => {
  const name = req.params.name;
  try {
    await shippingPublisher(name);
    res.send('shipping');
  } catch (error) {
    next(error);
  }
});

router.get('/onroad/:name', async (req, res, next) => {
  const name = req.params.name;
  try {
    await onroadPublisher(name);
    res.send('onroad');
  } catch (error) {
    next(error);
  }
});

router.get('/delivered/:name', async (req, res, next) => {
  const name = req.params.name;
  try {
    await deliveredPublisher(name);
    res.send('delivered');
  } catch (error) {
    next(error);
  }
});

module.exports = router;