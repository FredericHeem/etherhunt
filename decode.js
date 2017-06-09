const glob = require('glob');
const shell = require('shelljs');
const moment = require('moment');
var fs = require('fs');

const wallet = "wallet2.json"

function getFiles() {
  return new Promise((resolve, reject) => {
    glob("pw/*.txt", {}, function (err, files) {
      if (err) return reject(err)
      resolve(files);
    })
  })
}

function runParity(filename){

  const cmd = `../parity/target/release/parity wallet import ${wallet} --password ${filename}`;
  console.log('run ', cmd);
  console.log(moment().format('LLLL'))
  return new Promise((resolve, reject) => {
    const before = moment();
    shell.exec(cmd, function(code, stdout, stderr) {
      console.log(moment().format('LLLL'))
      console.log('Exit code:', code);
      console.log('Program output:', stdout);
      console.log('Program stderr:', stderr);
      const after = moment();
      const duration = moment.duration(after.diff(before)).humanize()

      //var duration = moment.duration(ms).format("hh:mm:ss");
      console.log('Duration ', duration);
      if(stderr.includes("no correct password found")){
        reject("no correct password found")
      } else {
        console.log('SUCCESS');
        fs.writeFileSync('key.txt', stdout);
        resolve(stdout);
      }
    });
  })

}
async function main(){
  try {
    const files = await getFiles();
    console.log("file ", files.length);
    for(let file of files){
      try {
        await runParity(file);
        console.log("**************");
        console.log("FOUND");
        console.log("**************");
        return true;
      } catch(error){
      }
    }
    console.log("TRY AGAIN");
  } catch (err) {
    console.log(err);
  }

}

main();
