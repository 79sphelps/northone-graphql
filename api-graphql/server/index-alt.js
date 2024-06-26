import express from "express";
import expressGraphQL from "express-graphql";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import schema from "../graphql";

const app = express();
// const PORT = process.env.PORT || "8080";
// const PORT = process.env.PORT || "4000";
const PORT = "4000";
// const db = "mongodb+srv://admin:1234qwer@cluster0.su6uv.mongodb.net/NorthOne?retryWrites=true&w=majority";
const db = 'mongodb://localhost:27017/northOneToDos';

// Connect to MongoDB with Mongoose.
mongoose
  .connect(
    db,
    {
      useCreateIndex: true,
      useNewUrlParser: true
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

  app.use(
    "/graphql",
    cors(),
    bodyParser.json(),
    expressGraphQL({
      schema,
      graphiql: true
    })
  );
  
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));