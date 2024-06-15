const { Router } = require('express');
const shippingPublisher = require('../publishers/shippingPublisher');
const onroadPublisher = require('../publishers/onroadPublisher');
const deliveredPublisher = require('../publishers/deliveredPublisher');
const path=require('../publishers/path.js')
const nodemailer=require('nodemailer')
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
            
        },
        currentLocation:{
          stateCapital:req.body.currentLocation.stateCapital
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
       
      },
      pickupLocation: {
       location: pickupLocation.location,
        
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


router.post('/path',async(req,res)=>{
  console.log(req.body)
   try{
    const src=req.body.source;
    const dest=req.body.destination
    console.log(src,dest)
     const pathC=await path(src,dest);
     res.status(200).json(pathC);
   }
   catch(err)
   {
    console.log(err)
   }
})

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



router.post('/onroad-stream',async(req,res,next)=>{

  try{
   

    const data=req.body
    
    const message = { deliveryId:data.deliveryId,userId:data.userId,orderId:data.orderId,pickupLocation:data.pickupLocation,currentLocation:data.currentLocation, status: 'onroad' };
   await onroadPublisher(message);
    
 
   res.send('onroad');


  }catch(err)
  {
    next(err)

  }

})




const sendVerificationEmail = async (id) => {
  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
          user: "maitisattwik@gmail.com",
          pass: "asiepkljrnykrrhw",
      },
  });

  // Compose email message
  const mailOptions = {
      from: "no-reply@gmail.com",
      to:'maitisattwik@gmail.com',
      subject: "Your Order has Arrived The Doorstep",
      text: `Please click the following link to accept the delivered item: http://localhost:8000/delivered-stream/${id} `,
  };

  // Send the email
  try {
      await transporter.sendMail(mailOptions);
      console.log("Verification email sent successfully");
  } catch (error) {
      console.error("Error sending verification email:", error);
  }
};

router.post('/sendmail/:id',async(req,res)=>{
 
  try{
    await sendVerificationEmail(req.params.id);
    res.status(200).json("Send")
    
  }catch(err){
    console.log(err)
  }

})

router.get('/delivered-stream/:id',async(req,res,next)=>{

  console.log("id",req.params.id)
  try{
   

    // const data=req.body
   
     const message ={
      userId: "Sattwik",
      agentId: "Raju",
      orderId: "Sattwik-order-1",
      deliveryId: req.params.id,
      pickupLocation: {
        location: "Mumbai"
      },
      currentLocation: {
        stateCapital: "Mumbai"
      },
      status: 'delivered'
     }
         
    // const messageShip = { deliveryId:data.deliveryId,userId:data.userId,orderId:data.orderId,pickupLocation:data.pickupLocation,currentLocation:data.currentLocation, status: 'delivered' };
    
        await deliveredPublisher(message)
      
      

   res.send('delivered');


  }catch(err)
  {
    next(err)

  }

})

module.exports = router;
