import { Server } from 'http';
import app from './app';
import config from './config';
import mongoose from 'mongoose';

let server:Server;


async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    //here config.port comes from index.js file
    server=app.listen(config.port, () => {
      console.log(`University app listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}
main();

//for Asynchronous code
process.on('unhandledRejection',()=>{
  console.log(('unhandledRejection is detected,shutting down...'));
  //kisu running thakle age seta off tarpor server off
  if(server){
    server.close(()=>{
      process.exit(1)
    })
  }

  //server e kisu running na thakle directly off
  process.exit(1);
})

//for synchronous code
process.on('uncaughtException',()=>{
  console.log(('unhandledException is detected,shutting down...'));
  //server e kisu running na thakle directly off
  process.exit(1);
})