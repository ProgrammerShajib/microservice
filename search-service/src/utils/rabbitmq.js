// now in this file remove the publishEvent

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
 
async function consumeEvent(routingKey, callback) {
  if(!channel){
    await connectToRabbitMQ();
  }

  const q = await channel.assertQueue("", {exclusive : true});
  await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey)
  channel.consume(q.queue, (msg)=>{
    if(msg!== null){
      const content = JSON.parse(msg.content.toString());
      callback(content)
      channel.ack(msg)
    }
  })

  logger.info(`Subscribe to event : ${routingKey}`)
} // now go to the server.js file and work on there 
module.exports = {connectToRabbitMQ,consumeEvent}; 