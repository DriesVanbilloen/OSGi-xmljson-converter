fs = require('fs')
const parser = require('xml2json');
const path = require('path');
const {walk} = require('./utils/walk');

// ==== Functions ==== //
function getJson(path) {
    const xmlFile = fs.readFileSync(path, 'utf8');

    let jsonString = parser.toJson(xmlFile);
    return JSON.parse(jsonString);
}

function isOSGiConfig(filePath) {
    if (filePath) {
        let ext = path.extname(filePath);
        if (ext !== '.xml') {
            return false;
        }
        let result = getJson(filePath);
        return ext === '.xml' && result['jcr:root'] && result['jcr:root']['jcr:primaryType'] === 'sling:OsgiConfig';
    }
    return false;
}

function convertToJson(filePath) {
    let json = getJson(filePath);
    let rootJson = json['jcr:root'];

    delete rootJson['jcr:primaryType'];
    for (let key in rootJson) {
        if (key.includes('xmlns')) {
            delete rootJson[key];
        }
    }
    return rootJson;
}

function getNewFileName(file) {
    return file.replace('.xml', '.cfg.json');
}

function creatNewJsonConfigFile(file, json, dryRun) {
    let fileName = getNewFileName(file);
    if (!dryRun) {
        console.log
        fs.writeFile(fileName, JSON.stringify(json, null, 4), function() {
            // idk what to do with this callback?
        });
        console.log('[INFO] added new jsonfile for ', fileName)
    }
    console.log('[INFO] OSGi config found ', file);
}


// ==== Main execution ==== // 
var myArgs = process.argv.slice(2);
var rootPath = myArgs[0];
var dryRun = myArgs[1];

console.log('[INFO] Starting application from path ', rootPath);
dryRun ? console.log('[INFO] Dryrun enabled') : console.log('[INFO] Dryrun disabled');
console.log('[INFO] searching for files');

walk(rootPath)
    .then(files => {
        files.forEach( file => {
            if (isOSGiConfig(file)) {
                let jsonProperties = convertToJson(file);
                creatNewJsonConfigFile(file, jsonProperties, dryRun);
            }
        });
        console.log('[INFO] Done!');
    })
    .catch(e => console.error('[ERROR]', e));