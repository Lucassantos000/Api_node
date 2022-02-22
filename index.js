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

var arraymsg = [];
const mensagens=[
    "Essa é a primeira mensagem",
    "Essa é a segunda mensagem",
];
//consultar todas as mensagens
app.get('/mensagens/', (req,res)=>{
    res.send(mensagens);
});

//consultar mensagem pelo ID
app.get('/mensagens/:id', (req,res)=>{
    //const id =  req.params.id;
    res.send(mensagens[req.params.id-1]);
});

//Criar uma mensagem pelo corpo da requisiçaõ em json
app.post('/mensagens/',(req,res)=>{
    
    const mensagem = req.body;
    console.log(mensagem); //mostra todo o corpo que foi envido (json)

    mensagens.push(mensagem.mensagem); //atribui apenas o texto da chave mensagem para a variável mensagem. 

    res.send("Mensagem Insrida."); //mostra apenas o campo chave que foi enviadono corpo
})

//Atalizar Mensagem
app.put('/mensagens/:id', (req, res)=>{
    mensagens[req.params.id -1] = req.body.mensagem ;
    console.log(mensagens[req.params.id -1]);

    res.send("Mensagem atulizada com sucesso!");
})

//Deleta mensgens a partirdo array
app.delete("/mensagens/:id", (req,res)=>{
    
    if(req.params.id>=0 && req.params.id <= mensagens.length){
        let mensagem =  mensagens[req.params.id-1];
        mensagens.splice(req.params.id -1 , 1)
        res.send(`Mensagem: "${mensagem}" apagada com sucesso`);
    }else{
        res.send(`Mensagem não encontrada`);
    }

});


app.listen(porta, ()=>{ 
     console.log(`Estamos no AR! porta: ${porta}`);
   });