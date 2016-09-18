var ifr,editor,div,result;
window.onload = function() {
    ifr = document.getElementById("log").contentWindow;
    init();
}

function init(){
    setting_ace();
    //setting_ace_iframe();
    setting_iframe();
    button_write();
     
}

function setting_iframe() {
    ifr.console.log = function() {
        let _ = "";
        for(let i = 0;i < arguments.length;i++) {
            //_ += arguments[i];
            
            div.appendChild(make_element({
                tag: "p",
                content: arguments[i]
            }));
            
        }
        //result.replace(3,_);
    }
    ifr.alert = function() {
        div.appendChild(make_element({
            tag: "p",
            content: "alert => " + arguments[0]
        }));
    }
    ifr.console.error = function() {
        for(let i = 0;i < arguments.length;i++) {
            div.appendChild(make_element({
                tag: "p",
                content: arguments[i]
            }));
        }
    }
}

function setting_ace() {
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/javascript");
    editor.getSession().setTabSize(4);
    editor.getSession().setUseWrapMode(true);
    editor.$blockScrolling = Infinity;
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });
    editor.commands.addCommand({
        name: 'renew',
        bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
        exec: function(editor) {
            button_write();
        },
        readOnly: true
    });
}

function setting_ace_iframe() {
    result=ace.edit("result");
    result.setTheme("ace/theme/monokai");
    result.getSession().setMode("ace/mode/javascript");
    result.getSession().setTabSize(4);
    result.getSession().setUseWrapMode(true); 
    result.$blockScrolling = Infinity;    
}

function write(content) {
    make_div();
    div.appendChild(make_element({
        tag: "script",
        type: "text/javascript",
        content: content
    }));
}

function make_element(v) {
    var _ = document.createElement(v.tag);
    if(v.id) _.id = v.id;
    if(v.type) _.type = v.type;
    if(v.content) _.innerHTML = v.content;
    if(v.style) _.style = v.style;
    if(v.src) _.src = v.src;
    return _;
}

function make_div() {
    if(div) div.parentNode.removeChild(div);
    div = make_element("div","main");
    ifr.document.body.appendChild(div);
}

function button_write() {
    make_div();
    let _ = editor.getSession()
    if(_.getAnnotations().length) {
        error(_.getAnnotations());
    } else {
        write("try{" + _.getValue() + "} catch(e) {console.log(e);}");
    }
}

function clear_value() {
    editor.setValue("console.log('Hello World');",5);
    button_write();
}

function error() {
    for(let i = 0;i < arguments[0].length;i++) {
        let _ = arguments[0][i];
        if(isNaN(_.column) || isNaN(_.row)) {
            div.appendChild(make_element({
                tag: "p",
                content: _.type + '   : '+  _.text
            }));
        } else {
            div.appendChild(make_element({
                tag:"p",
                content: _.type + ' ' + _.row + ',' +  _.column + ' : ' +  _.text
            }));
        }   
    }
}

