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
        close_box_msg();
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