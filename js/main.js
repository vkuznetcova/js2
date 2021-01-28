const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const hostBus = new Vue();
Vue.component('goods-search', {
  data: () => {
    return {
      searchString: ''
    }
  },
  template: `
  <label> Поиск товара:
    <input type="text" class="goods-search" v-model:value="searchString">
  </label>
  `,
  watch: {
    searchString: function (newValue) {
      hostBus.$emit('search-string-input', newValue);
    }
  }
});

Vue.component('goods-item', {
  props: ['good'],
  template: `
      <div>
          <h3>{{ good.product_name }}</h3>
          <p>{{ good.price }}р.</p>
          <button class="add-to-basket-btn" type="button" @click="addToBasket(good)">В корзину</button>
      </div>
      `,
  methods: {
    addToBasket() {
      hostBus.$emit('add-to-basket', this.good);
    }
  }
});

Vue.component('goods-list', {
  data: () => {
    return {
      goods: [],
      searchString: ''
    }
  },
  template: `
    <div class="goods-list">
        <div class="goods-item" v-for="good in filteredGoods">
        <goods-item :good="good"></goods-item>
      </div>
    </div>
  `,
  mounted() {
    this.makeGETRequest(`${API_URL}/catalogData.json`)
      .then(goods => {
        this.goods = JSON.parse(goods);
      });
  },
  methods: {
    makeGETRequest(url) {
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
  },
  computed: {
    filteredGoods() {
      const search = new RegExp(this.searchString, 'i');
      return this.good = this.goods.filter((good) => good.product_name.match(search));
    }
  },
  created() {
    hostBus.$on('search-string-input', (newValue) => this.searchString = newValue);
  },
  beforeDestroy() {
    hostBus.$off('search-string-input');
  }
});

Vue.component('basket-goods', {
  data: () => {
    return {
      basketGoods: []
    }
  },
  props: ['isVisibleBasket'],
  template: `
  <div v-if="isVisibleBasket" class="basket">
      <h2 v-if="isBasketEmpty"> Корзина пуста </h2>
      <h2 v-else>Ваша корзина: </br> (товаров: {{basketCount}} на сумму {{basketSumm}})</h2>
       <button v-if="!isBasketEmpty" class="clear-basket-btn" type="button" @click="basketGoods=[]">Очистить корзину</button>
       <basket-item  v-for="(good, idx) in basketGoods" :key="idx" :good="good" :idx="idx">
       </basket-item >
  </div>
  `,
  computed: {
    basketCount() {
      return this.basketGoods.reduce((summ, good) => summ + good.amount, 0);
    },
    basketSumm() {
      return this.basketGoods.reduce((summ, good) => summ + good.amount * good.price, 0);
    },
    isBasketEmpty() {
      return this.basketGoods.length === 0;
    }
  },
  methods: {
    addToBasket(good) {
      if (!this.basketGoods.some((basketGood) => {
        if (basketGood.id_product === good.id_product) {
          basketGood.amount++;
          return true;
        }
      })) {
        this.basketGoods.push({ ...good, amount: 1 });
      }
    },
    delFromBasket(idx) {
      if (this.basketGoods[idx].amount > 1) {
        this.basketGoods[idx].amount--;
      } else {
        this.basketGoods.splice(idx, 1);
      }
    }
  },
  created() {
    hostBus.$on('add-to-basket', this.addToBasket);
    hostBus.$on('del-from-basket', this.delFromBasket);
  },
  beforeDestroy() {
    hostBus.$off('add-to-basket');
    hostBus.$off('del-from-basket');
  }
});

Vue.component('basket-item', {
  props: ['good', 'idx', 'basketGood'],
  template: `
      <div class="basket-item">
        <h3>Наименование: {{good.product_name}}</h3>
        <p>Цена:{{ good.price }}</p>
        <p>Количество: {{good.amount}}</p>
        <p>Сумма: {{good.price*good.amount}}р.</p>
        <button  class="del-from-basket-btn" type="button" @click="delFromBasket(idx)">Удалить</button> 
      </div>
  `,
  methods: {
    delFromBasket() {
      hostBus.$emit('del-from-basket', this.idx);
    }
  }
});

const app = new Vue({
  el: '#app',
  template: `<div>
  <header>
      <goods-search></goods-search>
      <button class="basket-btn" type="button" @click="isVisibleBasket = !isVisibleBasket">Корзина</button>
    </header>
    <main>
      <basket-goods :isVisibleBasket="isVisibleBasket"></basket-goods>
      <goods-list></goods-list>
    </main>
    </div>`,
  data: {
    isVisibleBasket: false,
  }
});


