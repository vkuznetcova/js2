class GoodsItem {
  constructor(title, price) {
    this.title = title;
    this.price = price;
  }
  render() {
    return `<div class="goods-item"><h3>${this.title}</h3><p>${this.price}</p></div>`;
  }
}

class GoodsList {
  constructor() {
    this.goods = [];
  }
  fetchGoods() {
    this.goods = [
      { title: 'Shirt', price: 150 },
      { title: 'Socks', price: 50 },
      { title: 'Jacket', price: 350 },
      { title: 'Shoes', price: 250 },
    ];
  }
  render() {
    let listHtml = '';
    this.goods.forEach(good => {
      const goodItem = new GoodsItem(good.title, good.price);
      listHtml += goodItem.render();
    });
    document.querySelector('.goods-list').innerHTML = listHtml;
  }
  sum() {
    let sumGoods = 0;
    this.goods.forEach(good => {
      sumGoods += good.price;
    });
    return sumGoods;
  }
}

class Basket extends GoodsList {
  constructor() {
    super();
  }
}

class BasketItem extends GoodsItem {
  constructor(title, price, count = 1) {
    super(title, price);
    this.count = count;
  }
}

const list = new GoodsList();
list.fetchGoods();
list.render();
//console.log(list.sum());


// ===============================
class Hamburger {
  constructor(size, stuffing, topping = 0) {
    this.size = size;
    this.stuffing = stuffing;
    this.topping = topping;
  }
  calculatePrice() {      // Узнать цену 
    let price = 0;
    (this.size == 1) ? price += 50 : price += 100;
      switch (this.stuffing) {
        case "stuff_1":
          price += 10;
          break;
        case "stuff_2":
          price += 20;
          break;
        case "stuff_3":
          price += 15;
          break;
      }
      if (this.topping !== 0) {
        this.topping.forEach(item => {
          if (item == 'topp_1') price+=15;
          if (item == 'topp_2') price+=20;
        })
      
      }
      return price;
  }      
   calculateCalories() {   // Узнать калорийность }
   let calories = 0;
    (this.size == 1) ? calories += 20 : calories += 40;
      switch (this.stuffing) {
        case "stuff_1":
          calories += 20;
          break;
        case "stuff_2":
          calories += 5;
          break;
        case "stuff_3":
          calories += 10;
          break;
      }
      if (this.topping !== 0) {
        this.topping.forEach(item => {
          if (item == 'topp_2') calories+=5;
        })
      
      }
      return calories;
    }
}

//получение данных из формы
document.querySelector('.menu-btn').onclick = () => {
  let size = document.forms["hamburger"].elements['menu-type'].value,
    stuff = document.forms["hamburger"].elements['menu-stuff'].value,
    extra = document.forms["hamburger"].elements['menu-extra'],
    topping = [];
  extra.forEach((item) => {
    if (item.checked)
      topping.push(item.value);
  });

  const hamb = new Hamburger(size, stuff, topping);
  
  //вывод
  alert("Цена: " + hamb.calculatePrice() + " рублей "+ "\nКалорийность: "+ hamb.calculateCalories() + " ккал");

  //очистить форму
  document.getElementById('hamburger').reset();
}