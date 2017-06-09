const glob = require('glob');

function getFiles() {
  return new Promise((resolve, reject) => {
    glob("*.txt", {cwd: 'pw'}, function (err, files) {
      if (err) return reject(err)
      resolve(files);
    })
  })
}
async function main(){
  try {
    const files = await getFiles();
    console.log("file ", files);
  } catch (err) {
    console.log(err);
  }

}

main();
