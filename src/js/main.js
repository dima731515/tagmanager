"use strict"
// config current site
const googleLayerTemplates = {
    'catalog-click':[
        {'className':'item-card__image-container','eventCode':'detailPageUrlClick', 'dataSelector':'data-item-product'},
        {'className':'item-card__heading','eventCode':'detailPageUrlClick', 'dataSelector':'data-item-product'},
        {'className':'button--buy', 'eventCode':'add2cart', 'dataSelector':'data-item-product'},
        {'className':'button--more', 'eventCode':'detailPageUrlClick', 'dataSelector':'data-item-product'}
    ],

    'brand-catalog-click':[
        {'className':'a', 'eventCode':'detailPageUrlClick', 'dataSelector':'data-item-product'},
        {'className':'button--buy', 'eventCode':'detailPageUrlClick', 'dataSelector':'data-item-product'}
    ],
    'catalog-viewed':[
        {'className':'store-cell'}
    ],
    'detailProduct':[
        {'className':'button--buy', 'eventCode':'add2cart', 'dataSelector':'data-item-product'},
        {'className':'button-buy', 'eventCode':'add2cart', 'dataSelector':'data-item-product'},
    ],
    'detailProductList':[
        {'className':'item-card__image-container','eventCode':'detailPageUrlClick', 'dataSelector':'data-item-product'},
        {'className':'item-card__heading-container','eventCode':'detailPageUrlClick', 'dataSelector':'data-item-product'},
        {'className':'item-card__category-container','eventCode':'detailPageUrlClick', 'dataSelector':'data-item-product'},
    ],
    'cart-click':[
        {'className':'del', 'eventCode':'del2cart', 'dataSelector':'data-item-product'},
        {'className':'minus', 'eventCode':'del2cart', 'dataSelector':'data-item-product'},
        {'className':'plus', 'eventCode':'add2cart', 'dataSelector':'data-item-product'}
    ],
    'order-click':[
//        {'className':'btn-lg', 'eventCode':'addOrder'}
    ],
    'tagManagerTemplates':[],
};

$(document).ready(function() {
// Каталог
    window.catalog = new Wrapp('.store-wrapper', null, null);
    if(catalog.wrapperEls.length > 0){
        catalog.initChildWrapp('.store-cell', {'click':googleLayerTemplates['catalog-click'], 'viewed':googleLayerTemplates['catalog-viewed']});
    }
    window.catalogGoogleManager = new GoogleManager();
    inView('.store-cell').on('enter', function(el){
        catalogGoogleManager.viewed(el.getAttribute('data-item-product')); 
    });

// Бренд 
    const brand = new Wrapp('.brand-items__list', null, null);
    if(brand.wrapperEls.length > 0){
        brand.initChildWrapp('.brand-item__datalayer', {'click':googleLayerTemplates['brand-catalog-click'], 'viewed':googleLayerTemplates['catalog-viewed']});
    }
    
    window.brandGoogleTagManager = new GoogleManager();
    inView('.item-card__popup').on('enter', function(el){
        brandGoogleTagManager.viewed(el.getAttribute('data-item-product')); 
    });

// Детальная страница товара
    const detailProduct = new Wrapp('.interior-section', null, null);
    detailProduct.initChildWrapp('.item-card__interior', {'click':googleLayerTemplates['detailProductList']});
//    const detailProductLists = new Wrapp('owl-stage-outer', {'click':googleLayerTemplates['detailProductList']}, null);

    window.detailGoggleManger = new GoogleManager();
    inView('.interior-card').on('enter', function(el){
        detailGoggleManger.viewedDetail(el.getAttribute('data-item-product')); 
    });

    window.detailCollectGoggleManger = new GoogleManager();
    inView('.item-card__interior').on('enter', function(el){
        detailCollectGoggleManger.viewed(el.getAttribute('data-item-product')); 
    });

// Корзина
    const cart = new Wrapp('#basket-items', {'click':googleLayerTemplates['cart-click']}, null);
    cart.initChildWrapp('.tpl-item', {'click':googleLayerTemplates['cart-click']});
    window.cartGoogleManager = new GoogleManager();
    inView('#basket_items').on('enter', function(el){
        cartGoogleManager.viewedCart(el.getAttribute('data-product-list'), push_now=true); 
    });

// Заказ
    const order = new Wrapp('#bx-soa-order', {'click':googleLayerTemplates['order-click']}, null);
    window.orderGoogleManager = new GoogleManager(); 
    inView('.bx-soa-section-content').on('enter', function(el){
        orderGoogleManager.viewedOrderBlock(el); 
    });
// Заказ оформлен успешно
    const orderConfirmGoogleManager = new GoogleManager(); 
    inView('.confirm-order-js').on('enter', function(el){
        orderConfirmGoogleManager.viewedOrderConfirm(); 
    });

    window.onbeforeunload = function() {
        catalogGoogleManager.pushViewed(); 
        brandGoogleTagManager.pushViewed();
        detailGoggleManger.pushViewed();
        detailCollectGoggleManger.pushViewed();
    };
    window.addEventListener("unload", function() {
        catalogGoogleManager.pushViewed(); 
    });
    document.body.addEventListener('click', function(){
        window.catalogGoogleManager.pushViewed();
        window.brandGoogleTagManager.pushViewed();
        window.detailGoggleManger.pushViewed();
        window.detailCollectGoggleManger.pushViewed();
        window.cartGoogleManager.pushViewed();
//        window.orderGoogleManager.pushViewed();
//        window.orderConfirmGoogleManager.pushViewed();
    });
});
