function GoogleManager()
{
    this.templates = tagTemplates;
    this.posted = {}; // хранит id уже отправленных элементов
    this.pushed = []; // max 15 элементов которые нужно запушить
    this.postedOrderBlock = {}; // хранит id уже отправленных элементов
};
GoogleManager.prototype.push = function(eventCode = 'code', data = {})
{
    dataLayer = window.dataLayer || [];
    let dataOnPush = this.templates[eventCode]; 
    assert(true, 'tagManger.push: code: ' + eventCode);

    let product = JSON.parse(data);
    if(eventCode === 'detailPageUrlClick')
        {
            /*if(product.list){delete product.list;}*/
            if(product.quantity){delete product.quantity;}
            /*if(product.position){delete product.position;}*/

            dataOnPush.ecommerce.click.actionField.list = product.list;
            dataOnPush.ecommerce.click.products = [];
            dataOnPush.ecommerce.click.products.push(product);
        }
    else if(eventCode === 'add2cart')
        {
            if(product.list){delete product.list;}
            if(product.position){delete product.position;}
            dataOnPush.ecommerce.add.products = [];
            dataOnPush.ecommerce.add.products.push(product);
        }
    else if(eventCode === 'del2cart')
        {
            if(product.list){delete product.list;}
            if(product.position){delete product.position;}
            dataOnPush.ecommerce.remove.products = [];
            dataOnPush.ecommerce.remove.products.push(product);
        }
    assert(true, product);
    dataLayer.push(dataOnPush);
};
GoogleManager.prototype.viewed = function(data, pushNow = false)
{
    let jdata = JSON.parse(data);
    if(jdata.quantity){delete jdata.quantity;}
    assert(true, 'tagManger.viewed: data: ');
    assert(true, jdata);
    if(jdata === null) return false;//throw new 'Не получены данные для пуша';
    if('undefined' === typeof this.posted[jdata.id]){
        this.posted[jdata.id] = jdata;
        this.pushed.push(jdata);
        if(pushNow === true || this.pushed.length >=14){
            this.pushViewed();
        }
    }else{
    }
};
GoogleManager.prototype.viewedCart = function(data, pushNow = false)
{
    let jdata = JSON.parse(data);
    assert(true, 'tagManger.viewedCart: data: ');
    assert(true, jdata);
    if(jdata === null) return false;//throw new 'Не получены данные для пуша';
    if('undefined' === typeof this.posted[jdata.id]){
        this.posted[jdata.id] = jdata;
        this.pushed.push(jdata);
        if(pushNow === true || this.pushed.length >=14){
            this.pushViewedCart();
        }
    }else{
    }
};
GoogleManager.prototype.viewedDetail = function(data)
{
    let jdata = JSON.parse(data);
    if(jdata.list){delete jdata.list;}
    if(jdata.quantity){delete jdata.quantity;}
    assert(true, 'tagManger.viewedDetail: data: ');
    assert(true, jdata);
    if(null === jdata){
        assert(false, 'tagManger.viewedDetail:  нет data селлектора!');
        return false;
    }
    if( 'undefined' === typeof this.posted[jdata.id]){
        this.posted[jdata.id] = jdata;
        dataLayer = window.dataLayer || [];
        let tagEvent = {
            'event': 'ecomDetail', 
            'ecommerce': { 
                'detail': {
                    'products': []
                }
            }
        };
        tagEvent.ecommerce.detail.products.push(jdata); 
        dataLayer.push(tagEvent);
    }
};
GoogleManager.prototype.viewedOrderBlock = function(block = {}){
    let jdata = block.parentElement.getAttribute('data-order-block-num');
    assert(true, 'tagManger.viewedOrderBlock: data: ');
    assert(true, jdata);

    if('undefined' === typeof this.postedOrderBlock[jdata]){
        dataLayer = window.dataLayer || [];

        this.postedOrderBlock[jdata] = true;
        let cart = document.getElementById('bx-soa-order').getAttribute('data-product-list');
        let dataOnPush = this.templates['viewedOrder' + jdata]; 
        dataOnPush.ecommerce.checkout.products = JSON.parse(cart);
        dataLayer.push(dataOnPush);
    }else{
    }
};
GoogleManager.prototype.viewedOrderConfirm = function(){
    if(typeof BX.getCookie('orderId') !== "undefined" && BX.getCookie('orderId')  !== ""){
        let orderId = BX.getCookie('orderId'); 
        if(window.location.search.indexOf('?ORDER_ID='+ orderId) === -1){
            return false;
        }
    }

    let el = document.querySelector('.sale_order_full_table')
    let data = el.getAttribute('data-product-list');
    data = JSON.parse(data);
    let orderData = JSON.parse(el.getAttribute('data-order'));

    dataLayer = window.dataLayer || [];
    let dataOnPush = this.templates['orderAdd']; 
    dataOnPush.ecommerce.purchase.products = data;
    dataOnPush.ecommerce.purchase.actionField = orderData;
    dataLayer.push(dataOnPush);
    BX.setCookie('orderId', orderData['id'], {expires: 86400});
};

// отправить накопленные элементы
GoogleManager.prototype.pushViewed = function(){
    if(this.pushed.length <= 0) return false; // если пусто то не отправлять

    dataLayer = window.dataLayer || [];
    let tagEvent = {
        'event': 'ecomList', 
        'ecommerce': { 
            'impressions': []
        }
    };
    tagEvent.ecommerce.impressions = this.pushed; 
    dataLayer.push(tagEvent);
    assert(true, 'tagManger.pushViewd:');
    assert(true, tagEvent.event);
    assert(true, dataLayer);
    this.pushed = [];
};
GoogleManager.prototype.pushViewedCart = function(){
    dataLayer = window.dataLayer || [];
    let tagEvent = {
        'event': 'ecomCart', 
        'ecommerce': { 
            'checkout':{
                'actionField':{'step':1},
                'products': [],
            }
        }
    };
    tagEvent.ecommerce.checkout.products = this.pushed; 
    dataLayer.push(tagEvent);
    assert(true, 'tagManger.pushViewedCart:');
    assert(true, tagEvent.event);
    assert(true, dataLayer);
    this.pushed = [];
};

const tagTemplates = {
    'detailPageUrlClick':{
        'event':'ecomClick',
        'ecommerce':{
            'click':{
                'actionField':{'list':'Раздел каталога'},
                'products': [],
            }
        }
    },
    'viewedlist':{
        'event': 'ecomList', 
        'ecommerce': { 
            'impressions': []
        }
    },
    'detailViewed':{
      'event': 'ecomDetail',
      'ecommerce': {'detail': {'products': []}}
    },
    'add2cart':{
        'event': 'ecomAdd', 
        'ecommerce': { 
            'add': {
                'products': [{}]
            }
        }
    },
    'del2cart':{
        'event': 'ecomRemove', 
        'ecommerce': { 
            'remove': {
                'products': [{  
                    'name': 'Стеллаж GIOTTO', 
                    'id': '1234',
                    'price': '195347',
                    'brand': 'Cattelan',
                    'category': 'Мебель/Мебельные стенки и стеллажи',
                    'quantity': 1 
                }]
            }
        }
    },
    'viewedCart':{
        'event': 'ecomCart', 
        'ecommerce': { 
            'checkout': {
                'actionField': {
                    'step': 1 
                },
                'products': [{  
                    'name': 'Стеллаж GIOTTO',  
                    'price': '195347',
                    'brand': 'Cattelan',
                    'category': 'Мебель/Мебельные стенки и стеллажи',
                    'quantity': 2
                }],
            }
        }
    },
    'viewedOrderA':{
        'event': 'ecomCheсkout', 
        'ecommerce': { 
            'checkout': {
                'actionField': {
                    'step': 2 
                },
                'products': [{  
                    'name': 'Стеллаж GIOTTO',  
                    'price': '195347',
                    'brand': 'Cattelan',
                    'category': 'Мебель/Мебельные стенки и стеллажи',
                    'quantity': 2 
                }],
            }
        }
    },
    'viewedOrderB':{
        'event': 'ecomCheсkout', 
        'ecommerce': { 
            'checkout': {
                'actionField': {
                    'step': 3 
                },
                'products': [{  
                    'name': 'Стеллаж GIOTTO',  
                    'price': '195347',
                    'brand': 'Cattelan',
                    'category': 'Мебель/Мебельные стенки и стеллажи',
                    'quantity': 2 
                }],
            }
        }
    },
    'viewedOrderC':{
        'event': 'ecomCheсkout', 
        'ecommerce': { 
            'checkout': {
                'actionField': {
                    'step': 4 
                },
                'products': [{  
                    'name': 'Стеллаж GIOTTO',  
                    'price': '195347',
                    'brand': 'Cattelan',
                    'category': 'Мебель/Мебельные стенки и стеллажи',
                    'quantity': 2 
                }],
            }
        }
    },
    'viewedOrderD':{
        'event': 'ecomCheсkout', 
        'ecommerce': { 
            'checkout': {
                'actionField': {
                    'step': 5 
                },
                'products': [{  
                    'name': 'Стеллаж GIOTTO',  
                    'price': '195347',
                    'brand': 'Cattelan',
                    'category': 'Мебель/Мебельные стенки и стеллажи',
                    'quantity': 2 
                }],
            }
        }
    },
    'viewedOrderE':{
        'event': 'ecomCheсkout', 
        'ecommerce': { 
            'checkout': {
                'actionField': {
                    'step': 6 
                },
                'products': [{  
                    'name': 'Стеллаж GIOTTO',  
                    'price': '195347',
                    'brand': 'Cattelan',
                    'category': 'Мебель/Мебельные стенки и стеллажи',
                    'quantity': 2 
                }],
            }
        }
    },
    'orderAdd':{
        'event': 'ecomPurchase', 
        'ecommerce': { 
            'purchase': {
                'actionField': {
                    'id': 'T12345',  
                    'revenue': '100850',
                    'shipping': '250',
                    'affiliation': 'www.maxlevel.ru',
                    'coupon': 'G67Jui90' // код купона заказа, если покупатель воспользовался купоном
                },
                'products': [{  
                    'name': 'Стеллаж GIOTTO',  
                    'price': '195347',
                    'brand': 'Cattelan',
                    'category': 'Мебель/Мебельные стенки и стеллажи',
                    'quantity': 2 
                }],
            }
        }
    }
};
