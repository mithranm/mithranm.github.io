function lookupCard(response, tag) {
    console.log("Looking up " + tag);
    var index = 0;
    response.data.forEach(element => {
        if(parseInt(element.id) === tag) {
            return;
        }
        index = index + 1;
    });
    return parseFloat(response.data[index].card_prices[0].tcgplayer_price);
}

function LoadPriceBreakdown(response, mainlist)
{
    console.log(response);
    var total = 0;
    console.log(mainlist);
    var index = 0;
    mainlist.forEach(element => {
        var price = lookupCard(response, element[0]);
        console.log("Card# " + index + "|" + element[0] + " count = x" + element[1]);
        total = total + price;
        index = index + 1;
        console.log(total);
    });
    alert ("Your deck costs $" + total.toFixed(2) + "USD according to TCGPlayer.com");
}