// Multiple task assignment

var baseURL = "";

var projectURL = "";

var keyAPI = "";

var projectID = "";

function addSplitContentElement() {
    function getMyAPIkey() {
        var myKey = "";
        $.get(baseURL + "my/api_key", function(data) {
            myKey = data.match(/<pre>(.*?)<\/pre>/g);
            myKey = String(myKey).replace(/<(.|\n)*?>/g, "");
        });
        return myKey;
    }
    function getMembers() {
        var members;
        $.get(projectURL + "settings/members", function(data) {
            members = $($(data).find(".list.members")).find(".user.active");
        });
        return members;
    }
    var splitContent = document.getElementsByClassName("splitcontent")[0];
    var splitContentLeft = splitContent.getElementsByClassName("splitcontentleft")[0];
    var selector = document.createElement("select");
    selector.setAttribute("name", "usersSelector");
    selector.setAttribute("multiple", "multiple");
    selector.setAttribute("id", "a84ec4a7529a");
    selector.setAttribute("size", "10");
    var p = document.createElement("p");
    var label = document.createElement("label");                                                                                                            
    label.setAttribute("for", "a84ec4a7529a");                                                                                                              
    var tn = document.createTextNode("Multiple task assignment");                                                                                           
    label.appendChild(tn);                                                                                                                                  
    p.appendChild(label);                                                                                                                                   
    var option;                                                                                                                                             
    var tn;                                                                                                                                                 
    var pathArray = window.location.href.split("/");                                                                                                        
    for (var i = 0; i < pathArray.length - 4; i++) {                                                                                                        
        baseURL += pathArray[i] + "/";                                                                                                                      
    }                                                                                                                                                       
    for (var i = 0; i < pathArray.length - 2; i++) {
        projectURL += pathArray[i] + "/";
    }
    projectID = pathArray[pathArray.length - 3];
    console.log(projectURL);
    $.ajaxSetup({
        async: false
    });
    keyAPI = getMyAPIkey();
    console.log(keyAPI);
    var members = getMembers();
    console.log(members);
    function Comparator(a, b) {
        if ($(a).text() < $(b).text()) return -1;
        if ($(a).text() > $(b).text()) return 1;
        return 0;
    }
    members.sort(Comparator);
    for (var i = 0; i < members.length; i++) {
        console.log($(members[i]).text());
        var url = $(members[i]).attr("href");
        parts = url.split("/");
        option = document.createElement("option");
        option.setAttribute("value", parts.pop());
        tn = document.createTextNode($(members[i]).text());
        option.appendChild(tn);
        selector.appendChild(option);
    }
    p.appendChild(selector);
    splitContentLeft.appendChild(p);
    $.ajaxSetup({
        async: true
    });
}

function multiAssign() {
    var form = document.getElementsByClassName("new_issue")[0];
    var defaultActionFlag = true;
    var n = 0;
    for (var i = 0; i < form.usersSelector.length; i++) {
        if (form.usersSelector[i].selected) {
            console.log(form.usersSelector[i].value);
            var issueTracker = document.getElementById("issue_tracker_id");
            var issueStatus = document.getElementById("issue_status_id");
            var issuePriority = document.getElementById("issue_priority_id");
            var issueIsPrivate = false;
            if (form.elements["issue[is_private]"].checked) {
                issueIsPrivate = true;
            }
            issueData = '<?xml version="1.0" encoding="UTF-8"?>';
            issueData += "<issue>";
            issueData += "<project_id>" + projectID + "</project_id>";
            issueData += "<tracker_id>" + issueTracker.options[issueTracker.selectedIndex].value + "</tracker_id>";
            issueData += "<status_id>" + issueStatus.options[issueStatus.selectedIndex].value + "</status_id>";
            issueData += "<priority_id>" + issuePriority.options[issuePriority.selectedIndex].value + "</priority_id>";
            issueData += "<assigned_to_id>" + form.usersSelector[i].value + "</assigned_to_id>";
            issueData += "<subject>" + form.elements["issue[subject]"].value + "</subject>";
            issueData += "<description>" + form.elements["issue[description]"].value + "</description>";
            issueData += "<start_date>" + form.elements["issue[start_date]"].value + "</start_date>";
            issueData += "<due_date>" + form.elements["issue[due_date]"].value + "</due_date>";
            issueData += "<done_ratio>" + form.elements["issue[done_ratio]"].value + "</done_ratio>";
            issueData += "<is_private>" + issueIsPrivate + "</is_private>";
            issueData += "<estimated_hours>" + form.elements["issue[estimated_hours]"].value + "</estimated_hours>";
            issueData += "<parent_issue_id>" + form.elements["issue[parent_issue_id]"].value + "</parent_issue_id>";
            issueData += "</issue>";
            console.log(issueData);
            console.log(baseURL + "issues.xml");
            console.log(keyAPI);
            $.ajax({
                type: "POST",
                url: baseURL + "issues.xml",
                async: false,
                contentType: "application/xml",
                data: issueData,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("X-Redmine-API-Key", keyAPI);
                },
                success: function(msg) {},
                error: function(xhr, msg, error) {}
            });
            defaultActionFlag = false;
            n++;
        }
    }
    if (!defaultActionFlag) alert(n + " tasks were created");
    return defaultActionFlag;
}

function addOnSubmitAction() {
    var form = document.getElementsByClassName("new_issue")[0];
    form.setAttribute("onsubmit", "return multiAssign();");
}

$(document).ready(function() {
    addSplitContentElement();
    addOnSubmitAction();
});

