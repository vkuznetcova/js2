function makeGETRequest(url) {
  return new Promise((resolve, reject) => {
    var xhr;

    if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status == 200) {
          resolve(xhr.responseText);
        } else {
          reject(console.log('Error:' + xhr.status));
        }
      }
    }
    xhr.open('GET', url, true);
    xhr.send();
  })
}

const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';


class GoodsItem {
  constructor(title, price) {
    this.product_name = title;
    this.price = price;
  }
  render() {
    return `<div class="goods-item"><h3>${this.product_name}</h3><p>${this.price}</p></div>`;
  }
}


class GoodsList {
  constructor() {
    this.goods = [];
  }
  fetchGoods() {
    return new Promise((resolve, reject) => {
      makeGETRequest(`${API_URL}/catalogData.json`)
        .then((goods) => {
          this.goods = JSON.parse(goods);
          resolve();
        })
    })
  }

  render() {
    let listHtml = '';
    this.goods.forEach(good => {
      const goodItem = new GoodsItem(good.product_name, good.price);
      listHtml += goodItem.render();
    });
    document.querySelector('.goods-list').innerHTML = listHtml;
  }

  getBasket() {
    return new Promise((resolve, reject) => {
      makeGETRequest(`${API_URL}/getBasket.json`)
        .then((goods) => {
          this.goods = JSON.parse(goods);
          // console.log(goods);
          resolve();
        })
    })
  }

}



const list = new GoodsList();
list.fetchGoods()
  .then(() => {
    list.render();
  })
  .catch((error) => {
    console.log(error);
  });

// list.getBasket();