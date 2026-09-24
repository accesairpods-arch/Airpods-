import express from "express";
import session from "express-session";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname=path.dirname(fileURLToPath(import.meta.url));
const app=express();
const PORT=process.env.PORT||3000;
const ADMIN_USER=process.env.ADMIN_USER||"admin";
const ADMIN_PASSWORD=process.env.ADMIN_PASSWORD||"airpodsquito";
const WHATSAPP=process.env.WHATSAPP||"593987302507";

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({secret:process.env.SESSION_SECRET||"cambia-este-secreto",resave:false,saveUninitialized:false,cookie:{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production"}}));

const dataDir=path.join(__dirname,"data"), uploadDir=path.join(__dirname,"public","uploads");
fs.mkdirSync(dataDir,{recursive:true}); fs.mkdirSync(uploadDir,{recursive:true});
const dbFile=path.join(dataDir,"store.json");
const initial={settings:{whatsapp:WHATSAPP,storeName:"AirPods Quito"},products:[
{id:1,name:"AirPods Pro",description:"Audífonos inalámbricos",price:49.99,oldPrice:59.99,badge:"MÁS VENDIDO",image:"",active:true},
{id:2,name:"AirPods",description:"Diseño inalámbrico y compacto",price:34.99,oldPrice:39.99,badge:"OFERTA",image:"",active:true},
{id:3,name:"Cargador USB-C",description:"Carga práctica para tu equipo",price:12.99,oldPrice:null,badge:"NUEVO",image:"",active:true},
{id:4,name:"Cable USB-C",description:"Cable para carga y conexión",price:8.99,oldPrice:null,badge:"POPULAR",image:"",active:true}
]};
if(!fs.existsSync(dbFile))fs.writeFileSync(dbFile,JSON.stringify(initial,null,2));
const readDB=()=>JSON.parse(fs.readFileSync(dbFile,"utf8"));
const writeDB=x=>fs.writeFileSync(dbFile,JSON.stringify(x,null,2));

function auth(req,res,next){if(req.session.admin)return next();res.status(401).json({error:"No autorizado"});}const upload = multer({ storage: multer.diskStorage({ destination: uploadDir, filename: (req, file, cb) => { const ext = path.extname(file.originalname); cb(null, Date.now() + ext); } }), limits: { fileSize: 5 * 1024 * 1024 } });
const upload = multer({ storage: multer.diskStorage({ destination: uploadDir, filename: (req, file, cb) => { const ext = path.extname(file.originalname); cb(null, Date.now() + ext); } }), limits: { fileSize: 5 * 1024 * 1024 } });
app.use(express.static(path.join(__dirname,"public")));
app.get("/api/store",(req,res)=>{const db=readDB();res.json({settings:{...db.settings,whatsapp:db.settings.whatsapp},products:db.products.filter(p=>p.active)});});
app.post("/api/login",(req,res)=>{if(req.body.username===ADMIN_USER && req.body.password===ADMIN_PASSWORD){req.session.admin=true;return res.json({ok:true})}res.status(401).json({error:"Credenciales incorrectas"});});
app.post("/api/logout",auth,(req,res)=>{req.session.destroy(()=>res.json({ok:true}))});
app.get("/api/admin",auth,(req,res)=>res.json(readDB()));
app.post("/api/settings",auth,(req,res)=>{const db=readDB();db.settings.whatsapp=String(req.body.whatsapp||"").replace(/\D/g,"");db.settings.storeName=String(req.body.storeName||"AirPods Quito");writeDB(db);res.json(db.settings)});
app.post("/api/products",auth,(req,res)=>{const db=readDB();const p=req.body;p.id=Date.now();p.price=Number(p.price);p.oldPrice=p.oldPrice?Number(p.oldPrice):null;p.active=p.active!==false;db.products.push(p);writeDB(db);res.json(p)});
app.put("/api/products/:id",auth,(req,res)=>{const db=readDB();const p=db.products.find(x=>x.id==req.params.id);if(!p)return res.status(404).end();Object.assign(p,req.body);p.price=Number(p.price);p.oldPrice=p.oldPrice?Number(p.oldPrice):null;writeDB(db);res.json(p)});
app.delete("/api/products/:id",auth,(req,res)=>{const db=readDB();db.products=db.products.filter(x=>x.id!=req.params.id);writeDB(db);res.json({ok:true})});
app.post("/api/upload",auth,upload.single("image"),(req,res)=>res.json({url:"/uploads/"+req.file.filename}));
app.get("/admin",(req,res)=>res.sendFile(path.join(__dirname,"public","admin.html")));
app.listen(PORT,()=>console.log("AirPods Quito running on http://localhost:"+PORT));
