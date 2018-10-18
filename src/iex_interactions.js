module.exports = {
    
    getStockPrice(ticker){
            return fetch(`https://api.iextrading.com/1.0/stock/${ticker}/price`)
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    return data;
                })
        }
        
}