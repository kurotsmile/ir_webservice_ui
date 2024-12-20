var box_alert=null;

function show_alert(msg){
    $("#box_alert").show();
    $("#box_alert").find(".txt").html(msg);
}

function hide_alert(){
    $("#box_alert").hide();
}

function show_msg(html_body='',title,act_show=null,label_btn_done=null){
    var html='';
    html+='<div class="w-100">';
    html+=html_body;
    html+='</div>';
    $("#box_msg_title").empty();
    $("#box_msg_body").empty();
    $("#box_msg_btn").empty();

    $("#box_msg_title").html('<div class="txt">'+title+'</div>');
    $("#box_msg_body").html(html);

    var btn_cancel='';
    btn_cancel=$('<a href="#" class="btn btn-secondary btn-rounded" id="btn_msg_cancel">Cancel</a>');
    $(btn_cancel).click(()=>{
        $('#bk_dark_full').hide();
        $('#box_msg').hide();
        return false;
    });

    if(label_btn_done!=null){
        var btn_done='';
        btn_done=$('<button class="btn btn-info btn-rounded text-white" id="btn_msg_done">'+label_btn_done+'</button>');
    }

    $("#box_msg_btn").append(btn_cancel);
    if(label_btn_done!=null) $("#box_msg_btn").append(btn_done);

    $("#bk_dark_full").show();
    $("#box_msg").show();
    if(act_show) act_show();
}

function close_msg(){
    $('#bk_dark_full').hide();
    $('#box_msg').hide();
}

function show_sideba_m(s_name_group,emp){
    var val_show=$(emp).attr("value");
    if(val_show=="hide"){
        $(emp).find(".icon_show").attr("src", "public/SVG/ExUp.svg");
        $("."+s_name_group).removeClass('item-m-hide');
        $(emp).attr("value","show");
    }else{
        $(emp).find(".icon_show").attr("src", "public/SVG/Down.svg");
        $("."+s_name_group).addClass('item-m-hide');
        $(emp).attr("value","hide");
    }
}

function obj_op(fields, object) {
    var sortedObject = {};
    fields.forEach(function(field) {
        if (object.hasOwnProperty(field)) {
            sortedObject[field] = object[field];
        }
    });
    
    for (var key in object) {
        if (!fields.includes(key)) {
            sortedObject[key] = object[key];
        }
    }
    return sortedObject;
}

function show_edit(emp){
    //$(emp).parent().find('img').toggleClass("bg-info rounded");
    $(emp).parent().find('input').each(function () {
        //$(this).prop('disabled', !$(this).prop('disabled'));
        $(this).focus();
    });
}

function load_ui_event(is_select=true,is_switch=true){
    if(is_select){
        $("select").change(function(){
            var val=$(this).attr("value");
           $(this).attr("value",val);
        });
    
    }

    if(is_switch){
        $(".btn_switch").each(function(){
            if ($(this).attr("value")=="true")
                $(this).attr("src", "/public/SVG/On.svg");
            else 
                $(this).attr("src", "/public/SVG/Off.svg");
        });
    
        $(".btn_switch").click(function(){
            var val_emp=$(this).attr("value");
            if(val_emp=="true"){
                $(this).attr("src", "/public/SVG/Off.svg");
                $(this).attr("value",false);
            }else{
                $(this).attr("src", "/public/SVG/On.svg");
                $(this).attr("value",true);
            }
        });
    }
}