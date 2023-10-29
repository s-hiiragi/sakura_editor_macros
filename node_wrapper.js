const path = require('path');

(function(){
    const jsname = process.argv[2];

    if (!jsname) {
        console.error(`usage: ${path.basename(__filename)} FILE`);
        process.on('exit', ()=>{ process.exit(1); });
        return;
    }

    console.log(jsname);

    //require(`./src/${jsname.replace(/\.js$/, ''}`);
    //==> Error: Cannot find module './src/FILE'
    // 読み込むモジュールファイル内でexportsを使用していないとエラーが出る模様。
})();
