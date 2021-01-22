const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const app = new Vue({
  el: '#app',
  data: {
    goods: [],
    filteredGoods: [],
    searchLine: '',
    errLine: 'Нет данных',
    isVisibleCart: true
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
    },

    filterGoods() {
      let search = this.searchLine.toLowerCase().trim();
      if (search === '') {
        document.querySelector('.goods-err').innerHTML = 'Нет данных';
        this.filteredGoods = this.goods;
      } else {
        document.querySelector('.goods-err').innerHTML = '';
        this.filteredGoods = this.goods.filter((good) => {
          return good.product_name.toLowerCase().includes(search);
        });
      }
    }

  },
  mounted() {
    this.makeGETRequest(`${API_URL}/catalogData.json`)
      .then(goods => {
        this.goods = JSON.parse(goods);
        this.filteredGoods = JSON.parse(goods);
      });
  }

});


