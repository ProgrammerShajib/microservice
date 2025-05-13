// now in this file implement the consumeEvent

const amqp = require('amqplib')
const logger = require('./logger')

let connection = null;
let channel = null;

const EXCHANGE_NAME = 'facebook_events'

async function connectToRabbitMQ() {
  
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE_NAME, 'topic', {durable: false});
    logger.info("Connected to rabbit mq")
    return channel;
  } catch (e) {
    
    logger.error('Error connecting to rabbit mq', e)
  }
}

async function publishEvent(routingKey, message) {
  if(!channel){
    await connectToRabbitMQ()
  }

  channel.publish(
    EXCHANGE_NAME,
    routingKey,
    Buffer.from(JSON.stringify(message))
  );
  logger.info(`Event published: ${routingKey}`) 
}// now go to the post-controller.js file in the deletepost section


// you just come from the post-controller.js file now implement the consumeEvent
async function consumeEvent(routingKey, callback) {
  if(!channel){
    await connectToRabbitMQ();
  }

  const q = await channel.assertQueue("", {exclusive : true});
  await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey)
  await channel.consume(q.queue, (msg)=>{
    if(msg!== null){
      const content = JSON.parse(msg.content.toString());
      callback(content)
      channel.ack(msg)
    }
  })

  logger.info(`Subscribe to event : ${routingKey}`)
} // now go to the server.js file and work on startServer

module.exports = {connectToRabbitMQ, publishEvent, consumeEvent}; 