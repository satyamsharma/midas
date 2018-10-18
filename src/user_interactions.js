export async function getUserPortfolio(userId){
    return fetch("/api/user/" + userId)
            .then((response) => {
                return response.json();
            })
            .then((user) => {
                return user;
            })
}

export async function updateUserPortfolio(user) {
    return fetch("http://localhost:3000/api/user/" + user.id, {
       method: "put",
       headers: new Headers({
         'Content-Type': 'application/json'
       }),
       body: JSON.stringify({portfolio: user.portfolio, cash: user.cash})
     })
}

export async function updateUserPortfolioValue(user) {
    const user_id = user.id;
    return fetch(`http://localhost:3000/api/user/${user_id}/portfolio-value`, {
       method: "put",
       headers: new Headers({
         'Content-Type': 'application/json'
       }),
       body: JSON.stringify({portfolioValue: user.portfolioValue, id: user.id})
     })
}

