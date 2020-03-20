$(document).ready(function(){
    var specialElementHandler = {
        "#editor": function(element,renderer){
            return true;
        }
    }
    $('#cmd').click(function(){
        var doc = new jsPDF();
        doc.fromHTML($('#target').html(),15,15,{
            "width":170,
            "elementHandlers": specialElementHandler
        });
        doc.save("insurance.pdf");

    })



});
//link url : https://www.youtube.com/watch?v=ZlJGky9mGME&list=PL3CDD0Jz5nVHvIIocHBzpBFF9fQ18bu53