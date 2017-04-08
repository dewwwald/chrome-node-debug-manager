# chrome-node-debug-manager


Here is an example nodemon task in gulp. It will run your server script with the node Chrome inspector argument and output a json file. Remember to replace [who you are] with your proper path.
```
gulp.task('nodemon', function () {
  let serverWatch = plugins.nodemon({
    script: 'server.js',
    nodeArgs: ['--debug', '--inspect'],
    ext: 'js,html',
    verbose: true,
    watch: ''*.js,
    stdout: false // required
  }).on('readable', function() {
    this.stdout.on('data', (data) => console.log(data.toString('utf8')));
    this.stderr.on('data', (err) => {
      err = err.toString('utf8');
      if ((new RegExp(/chrome-devtools:\/\//)).test(err)) {
        let result = (new RegExp(/chrome-devtools:\/\/.*/)).exec(err);
        fs.writeFile('/Users/[who you are]/node-debugger-url.json', JSON.stringify({ url: result[0] }), (err) => {
          if (err) throw err;
          console.log('The file has been saved!');
        });
      }
    });
  });
  return serverWatch;
});
```
