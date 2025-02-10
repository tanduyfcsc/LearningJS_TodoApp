import express from "express";
import {MongoClient, ObjectId} from "mongodb";


const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.static("public"));
app.use(express.json());
let db;

async function dbConnect(){
    const client = new MongoClient("mongodb+srv://tanduyfcsc:6A7ruuJZnR1TpzQd@cluster0.4verx.mongodb.net/TodoApp");
    await client.connect();
    db = client.db();
    // console.log("Database: " + db);
    app.listen(3000);
}

dbConnect();

app.get("/", async function(req, res){
    const todoItems = await db.collection('items').find().toArray();
    // console.log("TODO ITEMS: ", todoItems);
    // console.log("TODO ITEMS: ", todoItems.length);
    // console.log("TODO ITEMS: ", typeof todoItems);
    res.send(`
        <!doctype html>
        <html lang="en">
        <head>
            <title>Todo App</title>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <!-- google font -->
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link
            href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
            rel="stylesheet"
            />
            <!-- fontawesome -->
            <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
            integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
            crossorigin="anonymous"
            referrerpolicy="no-referrer"
            />
            <!-- tailwind -->
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body
            class="bg-slate-900 flex flex-col items-center font-semibold"
            style="font-family: Nunito"
        >
            <!-- main content -->
            <div class="flex flex-col w-full relative">
            <!-- heading -->
            <div class="w-full">
                <!-- bg image -->
                <img
                class="w-full h-[460px] object-cover"
                src="https://cdn.sanity.io/images/nlvljy00/production/68e58832f74600e27cf159fd5536768c07479a12-1200x627.png?fit=max&auto=format"
                alt="nature"
                k
                />
            </div>
            <!-- todo block -->
            <div
                class="max-w-[900px] absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 p-4 rounded"
            >
                <!-- title -->
                <div class="px-6 py-4 bg-slate-800/50 p-2 rounded text-center mb-8">
                <h1 class="text-white text-6xl">Todo App</h1>
                </div>
                <!-- create -->
                <div class="relative bg-slate-800 rounded">
                <form
                    id="create-form"
                    class="py-4 px-6"
                >
                    <input
                    name="todoItem"
                    type="text"
                    id="create-input"
                    class="p-3 rounded w-[600px] bg-gray-500 text-white"
                    />
                    <button
                    type="submit"
                    class="bg-blue-700 py-2 px-5 rounded text-white hover:bg-blue-500 transition-all absolute transform top-1/2 -translate-y-1/2 right-7 capitalize"
                    >
                    add todo
                    </button>
                </form>
                </div>
                <!-- list -->
                <div
                id="item-list"
                class="py-4 px-6 mt-8 divide-y divide-gray-600 bg-slate-800 rounded overflow-y-auto max-h-[400px]"
                >
                ${todoItems.map(function(item){
                    return `
                        <div class="flex justify-between items-center py-6">
                            <!-- title -->
                            <span class="text-white todo-text">${item.text}</span>
                            <!-- action -->
                            <div class="flex items-center space-x-4">
                            <!-- edit -->
                            <button>
                                <i
                                data-item="${item._id}"
                                class="fa-solid fa-pencil text-green-400 transition-all hover:scale-125 edit-btn"
                                ></i>
                            </button>
                            <!-- delete -->
                            <button>
                                <i
                                data-item="${item._id}"
                                class="fa-solid fa-trash-can text-red-400 transition-all hover:scale-125 delete-btn"
                                ></i>
                            </button>
                            </div>
                        </div>
                    `;
                }).join("")}
                </div>
            </div>
            </div>
            <script src="client.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/axios@1.1.2/dist/axios.min.js"></script>
        </body>
        </html>
        `);
});

app.post("/create", async function(req, res){
    // console.log("User Input: ", req.body.todoItem);
    const itemInfo =  await db.collection("items").insertOne({ text: req.body.text });

    res.json({_id: itemInfo.insertedId, text: req.body.text});

    // res.send("Success!");
});


app.post("/update", async function(req, res){
    // console.log("Update item: ", req.body.text);
    await db
        .collection("items")
        .findOneAndUpdate(
            { _id: ObjectId.createFromHexString(req.body.id) }, 
            { $set: { text: req.body.text } },
        );
    res.send("SUCCESS");
});


app.post("/delete", async function(req, res) {
    await db.collection("items").deleteOne(
        {_id: ObjectId.createFromHexString(req.body.id)}
    );

    res.send("SUCCESS");
});
