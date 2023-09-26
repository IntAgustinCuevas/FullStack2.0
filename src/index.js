const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

//------------Settings--------------
app.set('PORT', process.env.PORT || 4000);
const mongoURL = 'mongodb+srv://agustin2010c:1553020306@cluster0.pq4qyem.mongodb.net/FullStackWeb?retryWrites=true&w=majority'
app.use(express.json());
app.use(cors());


//--------Controllers----------------
const userController = require('../src/Controllers/user');
const characterController = require('../src/Controllers/character');
const outfitController = require('../src/Controllers/outfit');

//--------Start server---------------
app.listen(app.get('PORT'), () => {
    console.log(`Server running on port`,app.get('PORT'));
});

//--------Connetc to MongoDB----------
mongoose
.connect(mongoURL , { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log("connected");
})
.catch((err) => console.log(err));

//--------------LLamadas--------------


// Pagina de inicio.
app.get('/', (req, res) => {
	res.status(200).json({
	text: "EMPEZAR JUEGO"
	})
}); 

// Pagina principal.
app.get('/home', (req, res) => {
	res.status(200).json({
		login: "INICIAR SESION",
		signup: "REGISTRARSE"
	})
});

//-----------GET usuarios-----------------------
// GET de todos los usuarios de la base de datos.
app.get('/users', async (req, res) => {
	
	let limit = req.query.limit;
	let offset = req.query.offset;

	try {
		const result = await userController.getAllUsers(limit,offset);
		res.status(200).json(result);
	} 
	catch (err) {
		res.status(500).send('Error, intentelo mas tarde.');
		console.log(err);
	}
}); 

// GET de un usuario de la base de datos.
app.get('/users/:id', async (req, res) => {
  
  let id = req.params.id;
  
  try {
    const result = await userController.getUser(id);
    res.status(200).json(result);
  } 
  catch (err) {
    res.status(500).send('Error, intentelo mas tarde.');
    console.log(err);
  }
}); 

//-----------GET personajes----------
//GET de los personajes disponibles.
app.get('/characters' , async (req,res) => {
	let limit = req.query.limit;
	let offset = req.query.offset;

	try {
        const result = await characterController.getCharacters(limit,offset);
        res.status(200).json(result);
    }catch(error){
		res.status(500).send('Error, intentelo mas tarde');
	}
})

//GET de un personaje.
app.get('/characters/:id', async (req, res) => {
  
	let id = req.params.id;
	
	try {
	  const result = await characterController.getOneCharacter(id);
	  res.status(200).json(result);
	} 
	catch (err) {
	  res.status(500).send('Error, intentelo mas tarde.');
	  console.log(err);
	}
  });

//---------GET outfits--------------------
//GET de outfits creados.
app.get('/outfits', async (req, res) => {
	
	let limit = req.query.limit;
	let offset = req.query.offset;

	try {
		const result = await outfitController.getOutfits(limit,offset);
		res.status(200).json(result);
	} 
	catch (err) {
		res.status(500).send('Error, intentelo mas tarde.');
		console.log(err);
	}
});

//GET de partes de arriba.
app.get('/jackets', async (req, res) => {
	
	let limit = req.query.limit;
	let offset = req.query.offset;

	try {
		const result = await outfitController.getJackets(limit,offset);
		res.status(200).json(result);
	} 
	catch (err) {
		res.status(500).send('Error, intentelo mas tarde.');
		console.log(err);
	}
});




//----------------POST------------------------------

//POST crear nuevo usuario
app.post('/users/add' , async (req , res) => {
	let name = req.body.name;
	let email = req.body.email;
	let password = req.body.password;
	console.log(name,email,password);
	try{
		const result = await userController.createUser(name,email,password);
		if(result){
			res.status(201).send('Usuario creado correctamente'); 
		}else{
			res.status(409).send('El usuario ya existe');
		}  
	}catch(error){
		  res.status(500).send('Error al crear el usuario.'); 
		}
	});

//POST verificar usuario.
app.post('/users/login' , async (req, res) => {
	let email = req.body.email;
	let password = req.body.password;
	
	try{
		const result = await userController.loginUser(email,password);
		if(result){
			res.status(200).json(result);
			console.log('Login successful');
		}
	}catch(error){
		res.status(500).send('Error inesperado.');
	}
});	

//POST crear personaje.
app.post('/characters/add' , async (req, res) => {
	let name = req.body.name;
	let face = req.body.face;
	let outfit = req.body.outfit;
	let userID = req.body.userID;

	try{	
		const result = await characterController.createCharacter(name,face,outfit,userID);	
		console.log(result);
		if(result){
			res.status(201).send('Personaje creado correctamente');
		}else{
			res.status(409).send('Nombre de personaje en uso.');
		}
	}catch(error){
		res.status(500).send('Ocurrio un error.');
	}
});

//POST crear outfit.
app.post('/outfits/add' , async (req, res) => {
	let jacket = req.body.jacket;

	try{	
		const result = await outfitController.createOutfit(jacket);	
		console.log(result);
		if(result){
			res.status(201).send('Outfit creado correctamente');
		}
	}catch(error){
		res.status(500).send('Ocurrio un error.');
	}
});

