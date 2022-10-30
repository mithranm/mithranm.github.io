async function uploadFile() {
    var fr = new FileReader();
    fr.readAsText(fileupload.files[0]);
    fr.onload = function() {
        //console.log(fr.result);
        alert('The file has been uploaded successfully.');
        processFile(fr);
    };
    
}

var main = [];

function processFile(fr) {
    var lines = fr.result.split(/[\r\n]+/);
    
    var num;
    var deck = null;
    var lastId = null;
    for (var i=0; i<lines.length; ++i)
    {
        var line = lines[i].trim();
        if ((line === lastId) && (num < 3))
        {
            ++num;
            continue;
        }
        if (deck && lastId)
        {
            var pair = [+lastId, num];
            if (deck === 'main')
                main.push(pair);
            else if (deck === 'extra')
                main.push(pair);
            else if (deck === 'side')
                main.push(pair);
            lastId = null;
        }

        if (line === '#main')
            deck = 'main';
        else if (line === '#extra')
                deck = 'extra';
        else if (line === '!side')
                deck = 'side';
        else if (/^\d+$/.test(line))
            {
                lastId = line;
                num = 1;
            }
        else if (line.length && !line.startsWith('#'))
            {
                console.log('Import aborted, invalid line:\n\''+line+'\'');
                ImportAborted();
                return;
            }
        if (deck && lastId)
        {
            var pair = [+lastId, num];
            if (deck === 'main')
                main.push(pair);
            else if (deck === 'extra')
                main.push(pair);
            else if (deck === 'side')
                main.push(pair);
            lastId = null;
        }
    }
    //console.log(main);
    getDataFromDB(main);
}

let cardDataSuccess = function()
{
    var response;
    if (this.status < 200 || this.status >= 300)
        response = { status: false, message: this.status + ' ' + this.statusText };
    else try
    {
        response = JSON.parse(this.responseText);
        if (response.error)
            response = { status: false, message: response.error };
        else
            response.status = true;
        if (!response.status)
            console.error("Price API failed", this);
    }
    catch (e)
    {
        response = { status: false, message: "Invalid response" };
        console.error("Price API parsing failed", e);
    }
    
    if (response.status)
    {
        //console.log(response);
        //This calls the next file which displays the data in yugioh.html
        LoadPriceBreakdown(response, main);
    }
};

let cardDataFailed = function()
{
    var resp = { status: false, message: "XHR failed" };
    console.log(resp);
    console.error("Data API failed", this);
};

function getDataFromDB(cardList) {
    var ids = [];
    for (let index = 0; index < cardList.length; ++index) {
        ids[index] = cardList[index][0];
    }
    //console.log(ids);
    
    
    var request = new XMLHttpRequest();
    request.addEventListener("load", cardDataSuccess);
    request.addEventListener("error", cardDataFailed);
    request.open("GET", "https://db.ygoprodeck.com/api/v7/cardinfo.php?id=" + ids.join(',') + "&misc=yes&urls", true);
    request.cardIds = ids;
    request.send();
    
   /*
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
    if (ajax.readyState == 4) {
        cardDataSuccess(this.response);
       }
       };
    ajax.open("GET", "cardinfo.php", true);
    ajax.send(null);
    */
    
}