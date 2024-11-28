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