#!/usr/bin/env node

const _ = require("lodash");
const fs = require("fs");
var Combinatorics = require("js-combinatorics");
const leftPad = require('left-pad')

const itemsPerFile = 1e6;

const email = [
  "maxime.beynet@gmail.com",
  /*"MAXIME.BEYNET@GMAIL.COM",
  "MAXIME;BEYNET@GMAIL;COM"*/
];
const ether = ["ET", "ETHER", "ETHEREUM", "Ether", "Ethereum"];
const wallet = [
  "wallet",
  "WALLET",
  "Wallet",
  "wallets",
  "WALLETS",
  "Wallets"
];
const num = ["1", "01"];
const pw1 = ["vt88q6s2"];
const pw2 = ["yp3s532g"];
const Y = ["Y@"];
const seps = ["", " ", "-", "_"];

function passwordsBlock(combination) {
  return Combinatorics.permutationCombination(combination).toArray().filter(item => item.length >= 2).map(item => item.join(""));
}

function permute(inArray) {
  return inArray.reduce((acc, combination, key) => {
    if (key % 1000 === 0) {
      console.log("permute ", acc.length, combination, combination.length, key);
    }
    return acc.concat(Combinatorics.permutationCombination(combination).toArray().filter(item => item.length >= 3));
  }, []);
}

async function EtherDream() {
  let cp = Combinatorics.cartesianProduct(
    email,
    ether,
    wallet,
    num,
    passwordsBlock([pw1, pw2, Y])
  ).toArray();

  console.log("cp length: ", cp.length);
  console.log("cp: ", cp[0]);

  let result = permute(cp);

  console.log("#result length ", result.length);
  console.log("#result ", result[0]);
  console.log("#result ", result[result.length - 1]);

  /*
  [ [ 'A' ],
  [ '', ' ', '-', '_' ],
  [ 'B' ],
  [ '', ' ', '-', '_' ],
  [ 'C' ] ]
  */
  //console.log(insertSeparator(["A", "B", "C"]));

  function insertSeparator(comb) {
    //console.log("comb ", comb);

    return comb.reduce((acc, value, index) => {
      acc.push([value]);
      if (index < comb.length - 1) {
        acc.push(seps);
      }
      return acc;
    }, []);
  }

  async function createStream(name) {
    return new Promise(resolve => {
      var stream = fs.createWriteStream(name);
      stream.once("open", function (fd) {
        resolve(stream);
      });
    });
  }

  let stream;
  let fileNumber = 0;


  async function getStream(count) {
    if (count >= fileNumber * itemsPerFile) {
      fileNumber++;
      const fileName = `pw/password-${leftPad(fileNumber, 3, '0')}.txt`;
      console.log("create new file ", fileName);
      stream && stream.end();
      stream = await createStream(fileName);
    }
    return stream;
  }

  function finalCp(results) {
    let itemCount = 0;
    for (let i = 0; i < results.length; i++) {
      const content = Combinatorics.cartesianProduct(...insertSeparator(results[i]))
        .toArray()
        .map(value => value.join(""));
/*
      if (i % 1000 === 0) {
        console.log("", itemCount, i, results.length, content.length);
        console.log(
          "finalCp",
          content[0]
        );
      }
      */
      console.log(content.reduce((acc, item) => acc + item + "\n", ""))
      //const currentStream = await getStream(itemCount);
      //currentStream.write(content.reduce((acc, item) => acc + item + "\n", ""));
      itemCount += content.length;
    }
    return itemCount
  }

  const itemCount = finalCp(result);
  //stream.end();


  console.log("#result length ", result.length);
  console.log("#result ", result[0]);
  console.log("#result ", result[result.length - 1]);
  console.log("#items ", itemCount);
}
EtherDream();
