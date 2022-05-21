
	var express = require("express");
	var mysql = require('mysql');
	var ejs = require('ejs');

	var genre = [];
	var difficulty = [];
	let question = [];
	let answers = [];
	let q = [];

	var con = mysql.createConnection({
		host: "bq5rywc2xtbyepjftd9f-mysql.services.clever-cloud.com",
		user: "ukyvpr3wzxsjmwov",
		password: "mCEQz4NfchflIPQNfiQI",
		port : 3306,
		database : 'bq5rywc2xtbyepjftd9f',
	});

	var app = express();

	app.set(('view engine'), 'ejs');
	app.set('views',__dirname+'/views');
	app.use(express.static(__dirname + '/views'));
	app.use(express.static(__dirname + '/'));

	sequentialQueries();
	
	app.get("/", (req, res) => {
	res.render('./menu');
	});
	
	app.get("/solo", (req, res) => {
	 res.render('index',{questions:JSON.stringify(q), answers:JSON.stringify(answers)});
	});

	app.listen(3000);
	console.log("Ouvert sur localhost:3000");
	 
	
	async function sequentialQueries () {
	 
	try{
		con.connect();

		queryPromise1 = () =>{
		    return new Promise((resolve, reject)=>{
		        con.query("SELECT * FROM genre", (error, results)=>{
		            if(error){
		                return reject(error);
		            }
		            setValue(1,results);
		            return resolve(results);
		        });
		    });
		};
		 
		queryPromise2 = () =>{
		    return new Promise((resolve, reject)=>{
		        con.query("SELECT * FROM difficulty", (error, results)=>{
		            if(error){
		                return reject(error);
		            }
		            setValue(2,results);
		            return resolve(results);
		        });
		    });
		};
		 
		queryPromise3 = () =>{
		    return new Promise((resolve, reject)=>{
		        con.query("SELECT * FROM question", (error, results)=>{
		            if(error){
		                return reject(error);
		            }
		            setValue(3,results); 
		            return resolve(results);
		        });
		    });
		};
		

		const result1 = await queryPromise1();
		const result2 = await queryPromise2();
		const result3 = await queryPromise3();
		
		// here you can do something with the three results
	 
	} catch(error){
		console.log(error)
	} finally {
		con.end();
	}
}	

	function setValue(n,value)
	{
		if(n === 1)
		{
			genre = value;	
		} 
		if(n === 2)
		{
			difficulty = value;	
		} 
		if(n === 3)
		{
			question = value;	
			create();
		} 
	}

	function create()
	{	
		var r = Array(4);
		var tmp = Array(4);
		var s = Array(4);
		var v;
		var c;
		var j;
		
		answers[0] = { entries:["Pret"], correct : 0 };
		
		for( var i = 0; i < question.length; i++)
		{	
			tmp[0] = question[i].reponse0;
			tmp[1] = question[i].reponse1;
			tmp[2] = question[i].reponse2;
			tmp[3] = question[i].reponse3;
			
			s = [5,5,5,5];
			
			j = 0;
			
			while( j !== 4)
			{
				v = Math.floor(Math.random() * 4);
				
				if(!contains(s,v))
				{	
					if(v === 0) c = j;
					s[j] = v;
					r[j] = tmp[v];
					j++;
				}
			}

			q[i] = question[i].question;
			answers[i+1] = {entries:[r[0],r[1],r[2],r[3]], correct: c}
		}
		
		console.log("Données chargés avec succes!");

	}

	function contains(s,v)
	{
		for(var i = 0; i < s.length; i++)
		{
			if(s[i] === v) return true;
		}
		return false;
	}
