const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const app = new Vue({
  el: '#app',
  data: {
    goods: [],
    searchLine: '',
    isVisibleBasket: false
  },
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
    },
    visibleBasket(){
      isVisibleBasket = true
    }
  },
  computed: {
    filteredGoods() {
      const search = new RegExp(this.searchLine, 'i');
      return this.filteredGoods=this.goods.filter((good) => good.product_name.match(search));
    }
  }

});


