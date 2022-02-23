/*PORTAS ESPECIFICA PARA SERVIÇOS ESPECÍFICOS: port list example; htttp: 80; Ftp:20*/
/*REST: get, post, put, delete */
/*Requisição: URL, HEADER, BODY*/
/*URL:local onde a requisoção será enviada*/ 
/*HEADER: Enivar informações */
/*BODY: Corpo da Informação (JON porexemplo)*/
/*Endpoint são pontos/caminhos dentro da aplicação
geralmente é feito como:url/endpoint ex: http://localhost:3000/fim/   */

/* GET -> Obter informações*/
/* POST -> Criar informação nova*/
/* PUT -> Atualizar informações já existentes*/
/* DELETE -> Deletar Informaçoes já existentes */

const express = require('express');
const app = express(); 
const bodyParser = require("body-parser");
const mongodb = require('mongodb');

(async () => {

const conectionString = "mongodb://localhost:27017/local";
console.info("Conectando ao banco de dado MongoDB...");

const options = {
    useUnifiedTopology: true
};


const cliente = await mongodb.MongoClient.connect(conectionString, options);   
//console.log(cliente);  -se não houver o await ele execulta sem carregar a conxão com o banco

/* E a mesma coisa que: 

const funcaoAnonima = async () => { await algma coia};]
*/


 const porta = 3000 ;/*3000 || algum comando*/
 app.use(bodyParser.json());


 app.get('/', (req,res)=>{
     console.log("Vamolá");
     res.send('<!DOTYPE html> <html> <head> <meta charset= "utf-8"> \n <title> API NODE </title> </head>  <body style = "margin: 5px; padding: 2px; box-sizing:border-box; font-family: Lucida Sans "> <h2> Olá, seja bem-vindo! </h2> <p> Esta é uma aplicação Node </p>  </body> <html> ')
 });

 /* lista de mensagens
  - [GET] /mensagens - Retorna a lista de mensagens
  - [GET] /mensagens/{id} - Retorna apena uma únicamensangem pelo ID
  - [POST] /mensagens - Cria uma nova mensagem
  - [PUT] /mensagem/{id} - Atualiza uma mensagem
  - [DELETE] /mensagem/{id} - Remove uma mensagem específica

  CRUD = create, Read(single, all)m Update, delete  = criar, ler(tudo  ou individual), atualizar, remover
 */
//#---------------------------#//

const db = cliente.db("local");
const mensagens = db.collection("mensagens");
//console.log(db);
//console.log(mensagens);



/*var arraymsg = [];  
const mensagens=[
    {
        "id":1,
        "texto": "mensagem 1 "
    },
    
    {
        "id":2,
        "texto": "mensagem 2 "
    },

    {
        "id":3,
        "texto": "mensagem 3 "
    },
    
];

*/

//console.log( await mensagens.find({}).toArray());

const getMensagensValidas = async () => { return await mensagens.find({}).toArray(); };
const getMensagensById = async (id) =>{ return await mensagens.findOne({ _id: mongodb.ObjectId(id)})}

//consultar todas as mensagens
app.get('/mensagens/', async (req,res)=>{
    
    const mensagem = await getMensagensValidas();
    
    if(!mensagem.length){
        res.send("Lista de Mensagens está Vaiza!");    
        return;
    }
    //console.log(await getMensagensValidas());
    res.send( mensagem);
});

//consultar mensagem pelo ID
app.get('/mensagens/:id', async (req,res)=>{
    const id = req.params.id;
    const mensagem = await getMensagensById(id);
    
    
    if(!mensagem){
        res.send("Mensagem não encontrada!");
        return;
    }
    
    //res.send(mensagem.texto); exibe todoo o json trazido na requisição com id, texto e autor
    res.send(mensagem.texto);
});

//Criar uma mensagem pelo corpo da requisiçaõ em json
app.post('/mensagens/', async (req,res)=>{
    
    const mensagem = req.body;

    if(!mensagem || !mensagem.texto  || !mensagem.autor){
        res.send("<p style='font-weigth: bold; font-family: arial; color: red;'> Não foi possível enviar a mensagem!</p>")
        return;
    }

    /*mensagem.id = mensagens.length + 1 //cria um id (SUCESSOR) aoanteiror
    console.log(mensagem); //mostra tudo o que tem no corpo da mensagem
    mensagens.push(mensagem); //atribui apenas o texto da chave mensagem para a variável mensagem. 
    */
    const resultado = await mensagens.insertOne(mensagem);
    
    if(!resultado.acknowledged){
        res.send("Erro ao criar a mensagem!");
        return;
    }

    console.log(resultado);
    //console.log( await getMensagensById(resultado.insertedId));

    res.send(mensagem); //mostra apenas o campo chave que foi enviadono corpo
})

//Atalizar Mensagem
app.put('/mensagens/:id', async (req, res)=>{
    
    const id = req.params.id;

    const novaMensagem = req.body;

    if(!novaMensagem || !novaMensagem.texto /*|| !novaMensagem.autor*/){
        res.send("Mensagem inválida");
    }

    const quantidade_mensagens =  await mensagens.countDocuments({ _id: mongodb.ObjectId(id)});

    if(quantidade_mensagens != 1){
        res.send(`Mensagem ${id} não encontrada`);
    }

    
    /*const id = parseInt(req.params.id);
    const mensagem = mensagens.find( msg => msg.id ===id );

    const novoTexto = req.body.texto;
    

    if(!novoTexto || id<0 || id > mensagens.length){
        res.send("Não foi possivel atualizara mensagem!");
        return;
    };
    
    //res.send(mensagem);
    mensagem.texto = novoTexto ;
    //console.log(mensagens[id]); -mostra a nova msg
    */

    const resultado = await mensagens.updateOne(
        {
            _id: mongodb.ObjectId(id)
        },
        {
            $set: novaMensagem
        }

    )
    
    console.log(resultado);
    res.send( await getMensagensById(id));
});

//Deleta mensgens a partirdo array
app.delete("/mensagens/:id", async (req,res)=>{
    
    const id = req.params.id;

    const quantidade_mensagens = await mensagens.countDocuments({ _id: mongodb.ObjectId(id)});

    if(quantidade_mensagens !==1){
        res.send('Mensagem não encontrada');
        return ;
    }



    //const index = mensagens.indexOf(mensagem);
    
    const resultado = await mensagens.deleteOne({ _id: mongodb.ObjectId(id)})
    
    if(!resultado.acknowledged){
        res.send("Ocorreu um erro ao apagar a Mensagem");
    }
    res.send("Mensagem Removida com sucesso");

});


app.listen(porta, ()=>{ 
     console.log(`Estamos no AR! porta: ${porta}`);
   });


})();