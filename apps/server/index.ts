import express from "express";

const app = express();

app.listen(process.env.PORT || 8000, () => {
  console.log(`server started on port : ${process.env.PORT || 8000}`);
});
