var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var requestify = require('requestify');

app.set('port', (process.env.PORT || 3000));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

  io.emit('chat message', '<b>Bueno diz:</b> Olá, Professora. <br>Digite uma única palavra, sem caracteres especiais, acentos ou separadores para que eu possa consultar o significado. <br>Em algumas ocasiões a API do dicionário pode demorar um pouco a responder. <br>Caso a demora aconteça, por gentileza, aguarde alguns segundos e, caso a resposta não apareça, favor recarregue a página.');

  socket.on('chat message', function(msg){
  	
  	requestify.get('http://dicionario-aberto.net/search-json/' + msg)
		
		.then(function(response) {
			io.emit('chat message', '<b>Esther diz:</b> ' + msg);
			io.emit('chat message', '<b>Bueno diz:</b> ' + msg + ' significa ' + response.getBody().entry.sense[0].def);
		}).catch(function(response) {
			io.emit('chat message', '<b>Esther diz:</b> ' + msg);
			io.emit('chat message', '<b>Bueno diz:</b> Infelizmente não consegui encontrar o significado de ' + msg + '.. = ( <br>Será que a escrita normal dessa palavra não tem nenhum acento ou outro caracter especial? <br>Se sim, não conseguirei encontrar o resultado da mesma. <br>De qualquer forma, por gentileza, tente outra palavra, Professora. =D');
		});

  });

});


http.listen(app	.get('port'), function(){
  console.log('Escutando na porta ', app.get('port'));
});