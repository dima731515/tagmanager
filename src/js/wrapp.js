"use strict"

function Wrapp(querySelector, events = null, parentObj = null){
    this.parentObj = null;
    this.wrapperEls = [];
    this.manager = new GoogleManager();//window.googleManager;
    try{
        this.parentObj = parentObj;
        this.getElements(querySelector);
        this.initEvents(events);
    }catch(e){
        assert(false, 'исключение: ' + e.message);
    }
};

// set wrappers
// Ищет html блок по методом querySelectorAll
Wrapp.prototype.getElements = function(querySelector)
{
    var  els =  [];
    if(this.parentObj !== null && this.parentObj.wrapperEls.length > 0)
    {
        for(i=0;  this.parentObj.wrapperEls.length >  i; i++)
        {
            let childEls = this.parentObj.wrapperEls[i].querySelectorAll(querySelector);
            els.push.apply(els, childEls);
        }
    }else{
        // не имеет родителя
        els = document.querySelectorAll(querySelector);
    }

    if(0 === els.length)
    {
        throw new 'Зона для отслеживания, под селектором '+ querySelector +', не найдена!' 
    }else{
        this.wrapperEls = els;
    }
    return this;
};
Wrapp.prototype.initChildWrapp = function(querySelector, events)
{
    var childWrappers = new Wrapp(querySelector, events, parentObj = this);
    return childWrappers;
};
Wrapp.prototype.initEvents = function(events)
{
    if(events === null){
        return this; 
    }else{
        var self = this;
        for(i=0; this.wrapperEls.length > i; i++)
        {
            //click:
            this.wrapperEls[i].addEventListener('click', function(ev){
                assert(true, ' Событие Клик по элементу в отслеживаемой зоне.');
                for(ei=0; events.click.length > ei; ei++)
                {
                    let result = self.searchEventClassName(ev.target, events.click[ei].className);
                    assert(true, ' Поиск data селектора...');
                    if(result === true){
                        let data = this.getAttribute(events.click[ei].dataSelector);
                        assert(true, ' data на событие клика: ' + data);
                        if(data){
                            assert(true,' Передача данный в объект googleManager для пуша события по коду ' + events.click[ei].eventCode + ' ...');
                            self.manager.push(events.click[ei].eventCode, data); 
                        }
                    }
                }
            }, false);
        }
    }
};
Wrapp.prototype.searchEventClassName = function(target, className)
{
    if (
            target.classList.contains(className)
            || target.parentElement.classList.contains(className)
            || target.parentElement.parentElement.classList.contains(className)
            ) {
        return true;
    } else {
        return false;
    }
};
// события
Wrapp.prototype.click = function(){};
Wrapp.prototype.viewed = function(){};
