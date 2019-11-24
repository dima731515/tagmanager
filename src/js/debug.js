"use strict"
var jsDebug = false;

$(document).ready(function() {
    jsDebug = false;
//    assert(1 === 1, 'Тест пройден успешно!');
});

function assert(value, desc)
{
    if(jsDebug)
    {
        var result = '';
        if(value){
            result = 'success: ';  
        }else{
            result = 'fail! '; 
        }
        console.log(result);
        console.log(desc);
    }
}


