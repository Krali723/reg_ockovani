const uniqid = require("uniqid");
const fs = require("fs");

const SOUBOR_ZADATELE = "registrace.json";

let zpravy = new Array();
if (fs.existsSync(SOUBOR_ZADATELE)) {
  zpravy = JSON.parse(fs.readFileSync(SOUBOR_ZADATELE));
}

function seznamZadatelu(pozadavek, odpoved) {
  odpoved.writeHead(200, {"Content-type": "application/json"});
  odpoved.end(JSON.stringify(zpravy));
}

function pridaniZadatele(pozadavek, odpoved) {
  let data = "";
  pozadavek.on('data', function (kusDat) {
    console.log(kusDat);
    data += kusDat;
  })
  pozadavek.on('end', function () {
    let parametry = JSON.parse(data);
    console.log(parametry);
    let obj = {};
    obj.id = uniqid();
    obj.zprava = parametry.zprava;
    zpravy.push(obj);
    fs.writeFileSync(SOUBOR_ZADATELE, JSON.stringify(zpravy, null, 4));

    odpoved.writeHead(200, {"Content-type": "application/json",
            "Access-Control-Allow-Origin": "*"});
    odpoved.end(JSON.stringify({status:"OK"}));
  })
}

function detailZadatele(pozadavek, odpoved) {
  let data = "";
  pozadavek.on('data', function (kusDat) {
    console.log(kusDat);
    data += kusDat;
  })
  pozadavek.on('end', function () {
    let parametry = JSON.parse(data);
    console.log(parametry);
    let zprava = {status:"Chyba",chyba:"Nenalezeno"};
    for (let i = 0; i < zpravy.length; i++) {
      if (zpravy[i].id == parametry.id) {
        zprava = zpravy[i];
        break;
      }
    }

    odpoved.writeHead(200, {"Content-type": "application/json",
            "Access-Control-Allow-Origin": "*"});
    odpoved.end(JSON.stringify(zprava));
  })
}

function aktualizaceZadatele(pozadavek, odpoved) {
  let data = "";
  pozadavek.on('data', function (kusDat) {
    console.log(kusDat);
    data += kusDat;
  })
  pozadavek.on('end', function () {
    let parametry = JSON.parse(data);
    console.log(parametry);
    for (let i = 0; i < zpravy.length; i++) {
      if (zpravy[i].id == parametry.id) {
        zpravy[i].zprava = parametry.zprava;
        zpravy[i].upraveno = true;
        fs.writeFileSync(SOUBOR_ZADATELE, JSON.stringify(zpravy, null, 4));
        break;
      }
    }

    odpoved.writeHead(200, {"Content-type": "application/json",
            "Access-Control-Allow-Origin": "*"});
    odpoved.end(JSON.stringify({status:"OK"}));
  })
}

function odstraneniZadatele(pozadavek, odpoved) {
  let data = "";
  pozadavek.on('data', function (kusDat) {
    console.log(kusDat);
    data += kusDat;
  })
  pozadavek.on('end', function () {
    let parametry = JSON.parse(data);
    console.log(parametry);
    for (let i = 0; i < zpravy.length; i++) {
      if (zpravy[i].id == parametry.id) {
        zpravy.splice(i, 1);
        fs.writeFileSync(SOUBOR_ZADATELE, JSON.stringify(zpravy, null, 4));
        break;
      }
    }

    odpoved.writeHead(200, {"Content-type": "application/json",
            "Access-Control-Allow-Origin": "*"});
    odpoved.end(JSON.stringify({status:"OK"}));
  })
}

exports.zpracovaniChatu = function(pozadavek, odpoved) {
  if (pozadavek.url.startsWith("/chat/seznamZadatelu")) {
    seznamZadatelu(pozadavek, odpoved);
  } else if (pozadavek.url.startsWith("/chat/pridaniZadatele")) {
    pridaniZadatele(pozadavek, odpoved);
  } else if (pozadavek.url.startsWith("/chat/detailZadatele")) {
    detailZadatele(pozadavek, odpoved);
  } else if (pozadavek.url.startsWith("/chat/aktualizaceZadatele")) {
    aktualizaceZadatele(pozadavek, odpoved);
  } else if (pozadavek.url.startsWith("/chat/odstraneniZadatele")) {
    odstraneniZadatele(pozadavek, odpoved);
  } else {
    odpoved.writeHead(404);
    odpoved.end();
  }

}