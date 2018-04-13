<?php

// get the name from cookie
$name = "";
if (isset($_COOKIE["name"])) {
    $name = $_COOKIE["name"];
}

print "<?xml version=\"1.0\" encoding=\"utf-8\"?>";

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Online User List</title>
        <link rel="stylesheet" type="text/css" href="style.css" />
        <style type="text/css">
            img {
                width: 50px;
                height: 50px;
            }
        </style>
        <script language="javascript" type="text/javascript">
        //<![CDATA[
        var loadTimer = null;
        var request;
        var datasize;
        var lastMsgID;

        function load() {
            var username = document.getElementById("username");
            if (username.value == "") {
                loadTimer = setTimeout("load()", 100);
                return;
            }

            loadTimer = null;
            datasize = 0;
            lastMsgID = 0;

            getUpdate();
        }

        function getUpdate() {
            //request = new ActiveXObject("Microsoft.XMLHTTP");
            request =new XMLHttpRequest();
            request.onreadystatechange = stateChange;
            request.open("POST", "server.php", true);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.send("datasize=" + datasize);
        }

        function stateChange() {
            if (request.readyState == 4 && request.status == 200 && request.responseText) {
                var xmlDoc;
                try {
                    xmlDoc =new XMLHttpRequest();
                    xmlDoc.loadXML(request.responseText);
                } catch (e) {
                    var parser = new DOMParser();
                    xmlDoc = parser.parseFromString(request.responseText, "text/xml");
                }
                datasize = request.responseText.length;
                updateList(xmlDoc)
                getUpdate();
            }
        }

        function updateList(xmlDoc) {
            var tbody = document.getElementById("userlist");
            for (var i = 0; i < tbody.childNodes.length; i++) {
                var tr = tbody.childNodes.item(i);
                tbody.removeChild(tr);
                i--;
            }
            //point to the users nodes
            var users = xmlDoc.getElementsByTagName("user");

            // create a string for the users
            for (i = 0; i < users.length; i++){
                listUser(users[i].getAttribute("name"), users[i].getAttribute("filesrc"));
            }
        }

        function listUser(nameStr, filesrcStr){
            var tbody = document.getElementById("userlist");

            var tr = document.createElement('tr');

            var td1 = document.createElement('td');
                var image = document.createElement('img');
                image.setAttribute("src", filesrcStr)
                td1.appendChild(image);
            tr.appendChild(td1);

            var td2 = document.createElement('td');
            td2.appendChild(document.createTextNode(nameStr));
            tr.appendChild(td2);

            tbody.appendChild(tr);
        }
        //]]>
        </script>
    </head>

    <body style="text-align: left" onload="load()">
    <table style="width: 100%; height: 100%" border="5" cellpadding="5" cellspacing="0">
        <thead>
            <tr>
              <th>User Profile</th>
              <th>User Name</th>
            </tr>
        </thead>
        <tbody id="userlist">
        </tbody>
        <tfoot>
        </tfoot>
    </table>
    <form action="">
        <input type="hidden" value="<?php print $name; ?>" id="username" />
    </form>

    </body>
</html>
