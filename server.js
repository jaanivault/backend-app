   require("dotenv").config();
   const mongoose=require("mongoose");
   const express=require("express");
   const cors=require("cors");
   const dbConnect=require("./config/db");
   const path = require("path");
   

   const authRoutes=require("./routes/authRoutes");
   const fileRoutes=require("./routes/fileRoutes");
   
   const app=express();

   app.use(express.json());
   app.use(cors());


   app.use("/api/auth",authRoutes);

   
          
   

   app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
    

   


   app.use("/api/files",fileRoutes);


   


   const PORT =process.env.PORT||5000;


   dbConnect()
          .then(() =>{
           app.listen(PORT,()=>console.log(`server is running on port ${PORT}`)
          );
          })
          .catch((error)=>{
           
            console.error("MongoDB connection errror",error);
          }
          );

          
          
          

          
          