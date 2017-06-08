#!/usr/bin/env node
const _ = require("lodash");
const fs = require("fs");
var Combinatorics = require("js-combinatorics");

function permute(inArray) {
  return inArray.reduce((acc, combination, key) => {
    if (key % 1000 === 0) {
      console.log("permute ", acc.length, combination, combination.length, key);
    }
    return acc.concat(Combinatorics.permutation(combination).toArray());
  }, []);
}

async function EtherDreamV2() {
  const email = [
    "maxime.beynet@gmail.com"
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
  const num = ["2", "02"];
  const pw1 = ["vt88q6s2"];
  const pw2 = ["yp3s532g"];
  const seps = ["", " ", "-", "_"];

  let cp = Combinatorics.cartesianProduct(
    email,
    ether,
    wallet,
    num,
    pw1,
    pw2
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
      stream.once("open", function(fd) {
        resolve(stream);
      });
    });
  }

  let stream;
  let fileNumber = 0;
  const itemsPerFile = 10000000;

  async function getStream(count) {
    if (count >= fileNumber * itemsPerFile) {
      fileNumber++;
      console.log("create new file ", fileNumber);
      stream && stream.end();
      stream = await createStream(`password-${fileNumber}.txt`);
    }
    return stream;
  }

  async function finalCp(results) {
    let itemCount = 0;
    for (let i = 0; i < results.length; i++) {
      const content = Combinatorics.cartesianProduct(...insertSeparator(results[i]))
        .toArray()
        .map(value => value.join(""));

      if (i % 1000 === 0) {
        console.log("", itemCount, i);
        console.log(
          "finalCp",
          content[0]
        );
      }
      const currentStream = await getStream(itemCount);
      currentStream.write(content.reduce((acc, item) => acc + item + "\n", ""));
      itemCount += content.length;
    }
  }

  await finalCp(result);
  stream.end();


  console.log("#result length ", result.length);
  console.log("#result ", result[0]);
  console.log("#result ", result[result.length - 1]);
}
EtherDreamV2();

