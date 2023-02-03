import mongoose from "mongoose";
export let connection: mongoose.Connection;
mongoose.set('strictQuery', true);
export async function connect():Promise<void>{
    if(connection) return;
    const mongoUri= process.env.MONGO_URI as string;

    connection = mongoose.connection;
    connection.once("open", () => {
        console.log("connection with mongo OK");
      });
      connection.on("disconnected", () => {
        console.log("Disconnected succesfull");
      });
      connection.on("error", (err) => {
        console.log("Something went wrong!", err);
      });
      await mongoose.connect(mongoUri);
    }
    export async function disconnected(): Promise<void>{
        if (!connection) return;
      await mongoose.disconnect();
    }
    export async function cleanup(): Promise<void> {
        for (const collection in connection.collections) {
            await connection.collections[collection].deleteMany({});
          }
    }
    