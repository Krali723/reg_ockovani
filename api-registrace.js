const uniqid = require("uniqid");
const fs = require("fs");

const SOUBOR_ZADATELE = "registrace.json";

let zadatele = new Array();
if (fs.existsSync(SOUBOR_ZADATELE)) {
  zadatele = JSON.parse(fs.readFileSync(SOUBOR_ZADATELE));
}

function seznamZadatelu(pozadavek, odpoved) {
  odpoved.writeHead(200, {"Content-type": "application/json"});
  odpoved.end(JSON.stringify(zadatele));
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
    obj.jmeno = parametry.jmeno;
    obj.prijmeni = parametry.prijmeni;
    obj.rodne_c = parametry.rodne_c;
    obj.ctyrcisli = parametry.ctyrcisli;
    obj.o_misto= parametry.o_misto;
    zadatele.push(obj);
    fs.writeFileSync(SOUBOR_ZADATELE, JSON.stringify(zadatele, null, 4));

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
    let zadatel = {status:"Chyba",chyba:"Nenalezeno"};
    for (let i = 0; i < zadatele.length; i++) {
      if (zadatele[i].id == parametry.id) {
        zadatel = zadatele[i];
        break;
      }
    }

    odpoved.writeHead(200, {"Content-type": "application/json",
            "Access-Control-Allow-Origin": "*"});
    odpoved.end(JSON.stringify(zadatel));
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
    for (let i = 0; i < zadatele.length; i++) {
      if (zadatele[i].id == parametry.id) {
        zadatele[i].jmeno = parametry.jmeno;
        zadatele[i].prijmeni = parametry.prijmeni;
        zadatele[i].rodne_c = parametry.rodne_c;
        zadatele[i].ctyrcisli = parametry.ctyrcisli;
        zadatele[i].o_misto = parametry.o_misto;
        zadatele[i].upraveno = true;
        fs.writeFileSync(SOUBOR_ZADATELE, JSON.stringify(zadatele, null, 4));
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
    for (let i = 0; i < zadatele.length; i++) {
      if (zadatele[i].id == parametry.id) {
        zadatele.splice(i, 1);
        fs.writeFileSync(SOUBOR_ZADATELE, JSON.stringify(zadatele, null, 4));
        break;
      }
    }

    odpoved.writeHead(200, {"Content-type": "application/json",
            "Access-Control-Allow-Origin": "*"});
    odpoved.end(JSON.stringify({status:"OK"}));
  })
}

exports.zpracovaniRegistrace = function(pozadavek, odpoved) {
  if (pozadavek.url.startsWith("/registrace/seznamZadatelu")) {
    seznamZadatelu(pozadavek, odpoved);
  } else if (pozadavek.url.startsWith("/registrace/pridaniZadatele")) {
    pridaniZadatele(pozadavek, odpoved);
  } else if (pozadavek.url.startsWith("/registrace/detailZadatele")) {
    detailZadatele(pozadavek, odpoved);
  } else if (pozadavek.url.startsWith("/registrace/aktualizaceZadatele")) {
    aktualizaceZadatele(pozadavek, odpoved);
  } else if (pozadavek.url.startsWith("/registrace/odstraneniZadatele")) {
    odstraneniZadatele(pozadavek, odpoved);
  } else {
    odpoved.writeHead(404);
    odpoved.end();
  }

}