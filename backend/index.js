import "./loadEnv.js";
import e from "express";
import { ObjectId } from "mongodb";
import { connection, collectionName } from "./dbconfig.js";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = e();
const jwtSecret = process.env.JWT_SECRET;
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const port = Number(process.env.PORT) || 3200;

if (!jwtSecret) {
    throw new Error("Missing JWT_SECRET environment variable.");
}

app.use(cors({
    origin: clientOrigin,
    credentials:true

}));
app.use(e.json());
app.use(cookieParser());


app.post("/login", async (req, resp) => {
    const userData = req.body;
    if (userData && userData.email && userData.password) {
        const db = await connection();
        const collection = db.collection("users");
        const result = await collection.findOne({email:userData.email,password:userData.password});
        if (result) {
            jwt.sign(userData, jwtSecret, { expiresIn: '5d' }, (err, token) => {
                if (err) {
                    return resp.status(500).send({
                        message: "failed to generate token",
                        success: false,
                        error: err.message
                    });
                }
                resp.cookie("token", token, {
                    httpOnly: true,
                    sameSite: "lax",
                    maxAge: 5 * 24 * 60 * 60 * 1000
                });
                resp.send({
                    message: "Login Done",
                    success: true,
                    token: token
                });
            });
        } else {
            resp.status(500).send({
                message: "failed to Signin  user",
                success: false
            });
        }
    } else {
        resp.status(400).send({
            message: "user data not found",
            success: false
        });
    }
});

app.post("/signup", async (req, resp) => {
    const userData = req.body;
    if (userData && userData.email && userData.password) {
        const db = await connection();
        const collection = db.collection("users");
        const result = await collection.insertOne(userData);
        if (result) {
            jwt.sign(userData, jwtSecret, { expiresIn: '5d' }, (err, token) => {
                if (err) {
                    return resp.status(500).send({
                        message: "failed to generate token",
                        success: false,
                        error: err.message
                    });
                }
                resp.cookie("token", token, {
                    httpOnly: true,
                    sameSite: "lax",
                    maxAge: 5 * 24 * 60 * 60 * 1000
                });
                resp.send({
                    message: "user created successfully",
                    success: true,
                    token: token
                });
            });
        } else {
            resp.status(500).send({
                message: "failed to create user",
                success: false
            });
        }
    } else {
        resp.status(400).send({
            message: "invalid user data",
            success: false
        });
    }
});
app.post("/add-task",verifyJWTToken, async (req, resp) => {
    const db = await connection();
    const collecion = db.collection(collectionName);
    const result = await collecion.insertOne(req.body);
    if(result){
        resp.send({
            message:"task added successfully",
            success:true
        })
    }else{
        resp.send({
            message:"failed to add task",
            success:false
        })
    }
})
app.get("/tasks",verifyJWTToken ,async (req, resp) => {
    try {
        const db = await connection();
        const collection = db.collection(collectionName);
        const result = await collection.find().toArray();
        resp.send({
            message: "task list fetched successfully",
            success: true,
            tasks: result
        });
    } catch (error) {
        resp.status(500).send({
            message: "failed to fetch task list",
            success: false,
            error: error.message
        });
    }
});

app.get("/task/:id", verifyJWTToken,async (req, resp) => {
    try {
        const db = await connection();
        const collection = db.collection(collectionName);
        const id = req.params.id;
        const result = await collection.findOne({ _id: new ObjectId(id) });
        resp.send({
            message: "task fetched successfully",
            success: true,
            result
        });
    } catch (error) {
        resp.status(500).send({
            message: "failed to fetch task",
            success: false,
            error: error.message
        });
    }
});

// update task
app.put("/update-task/:id",verifyJWTToken, async (req, resp) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            return resp.status(400).send({ message: "invalid task id", success: false });
        }
        const db = await connection();
        const collection = db.collection(collectionName);
        const update = { $set: req.body };
        const result = await collection.updateOne({ _id: new ObjectId(id) }, update);
        if (result.matchedCount > 0) {
            resp.send({ message: "task updated successfully", success: true });
        } else {
            resp.status(404).send({ message: "task not found", success: false });
        }
    } catch (error) {
        resp.status(500).send({ message: "failed to update task", success: false, error: error.message });
    }
});



app.delete("/delete-task/:id",verifyJWTToken, async (req, resp) => {
    try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return resp.status(400).send({
                message: "invalid task id",
                success: false
            });
        }

        const db = await connection();
        const collection = db.collection(collectionName);
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount > 0) {
            resp.send({
                message: "task deleted successfully",
                success: true
            });
        } else {
            resp.status(404).send({
                message: "task not found",
                success: false
            });
        }
    } catch (error) {
        resp.status(500).send({
            message: "failed to delete task",
            success: false,
            error: error.message
        });
    }
});
app.delete("/delete-multiple/",verifyJWTToken, async (req, resp) => {
    try {
        const ids = req.body.ids;

        if (!Array.isArray(ids) || ids.length === 0) {
            return resp.status(400).send({
                message: "invalid task ids",
                success: false
            });
        }

        const objectIds = ids.map((id) => {
            if (!ObjectId.isValid(id)) {
                throw new Error("invalid task id");
            }
            return new ObjectId(id);
        });

        const db = await connection();
        const collection = db.collection(collectionName);
        const result = await collection.deleteMany({ _id: { $in: objectIds } });

        if (result.deletedCount > 0) {
            resp.send({
                message: `${result.deletedCount} task(s) deleted successfully`,
                success: true,
                deletedCount: result.deletedCount
            });
        } else {
            resp.status(404).send({
                message: "no tasks found for the given ids",
                success: false
            });
        }
    } catch (error) {
        resp.status(error.message === "invalid task id" ? 400 : 500).send({
            message: error.message === "invalid task id" ? "invalid task ids" : "failed to delete tasks",
            success: false,
            error: error.message
        });
    }
});

app.get("/", (req, resp) => {
    resp.send({
        message:"basic Api done",
        success:true
    })
})

app.use((err, req, resp, next) => {
    if (err && err.type === 'entity.parse.failed') {
        return resp.status(400).send({
            message: 'Invalid JSON payload',
            success: false,
            error: err.message
        });
    }
    next(err);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})

function verifyJWTToken(req,resp,next){
    const token = req.cookies['token'];
    if (!token) {
        return resp.status(401).send({
            msg: "token missing",
            success: false
        });
    }
    jwt.verify(token,jwtSecret,(err,decoded)=>{
        if(err){
            return resp.status(401).send({
             msg:"invalid token",
             success:false
            })
        }
next()
        console.log(decoded)
       


    })

}
