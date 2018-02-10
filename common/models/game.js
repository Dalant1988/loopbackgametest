'use strict';
var Request = require("request");
module.exports = function(Game) {
  Game.getGamesbyName = function(gameName, cb) {

    var options = {
      url: `https://www.giantbomb.com/api/search/?api_key=XXXXXXXXXXXX&format=json&query=${gameName}&resources=game&limit=100`,
      headers: {
        'User-Agent': 'request',
        'Accept':'application/json'

      }
    };
    Request.get(options, (error, response, body) => {
      if(error) {
        return console.dir(error);
      }
      console.dir(gameName);
      cb(null, JSON.parse(body));
    });

  }

  Game.remoteMethod (
    'getGamesbyName',
    {
      http: {path: '/getGamesbyName', verb: 'get'},
      accepts: {arg: 'gameName', type: 'string', http: { source: 'query' } },
      returns: {arg: 'juegos', type: 'string'}
    }
  );

  //------------------------------------------------------------------------------------

  Game.getIGDBGamesbyName = function(gameName, cb) {

    var empty=false;

    var resp=[];

    seqRequests(cb,gameName,empty,resp,0);

  }

  Game.remoteMethod (
    'getIGDBGamesbyName',
    {
      http: {path: '/getIGDBGamesbyName', verb: 'get'},
      accepts: {arg: 'gameName', type: 'string', http: { source: 'query' } },
      returns: {arg: 'juegos', type: 'array'}
    }
  );

  //------------------------------------------------------------------------------------










};



//Auxiliary functions

function seqRequests(cb,juego,empty,resp,offset){
  if (empty){
    cb(null, resp);
    return empty;
  }

  var options = {
    url: `https://api-2445582011268.apicast.io/games/?search=${juego}&limit=50&fields=id,name&limit=50&offset=${offset}`,
      //,summary,cover,screenshot
    headers: {
      'User-Agent': 'request',
      'Accept':'application/json',
      'user-key': 'XXXXXXXXXXX'
    }
  };
  console.dir (options.url);
  Request.get(options, (error, response, body) => {
    console.dir("busqueda= "+juego);
    console.dir("offset= "+offset);
    console.dir("respuesta= "+body.length);
    if(error) {
      return console.dir(error);
    }

    if (body.length>2) {


      resp=resp.concat(JSON.parse(body));
      offset+=50;
    }
    /*
    if(!Object.keys(body).length){
    console.dir("Tamaño response= "+Object.keys(body).length);

    empty=true;
  }*/

  else{
    console.dir("Tamaño response= "+body.length);
    console.dir(resp);

    empty=true;
  }
  seqRequests(cb,juego,empty,resp,offset);

});
}
