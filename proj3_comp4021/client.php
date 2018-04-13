<?php

if (!isset($_COOKIE["name"])) {
    header("Location: error.html");
    return;
}

// get the name from cookie
$name = $_COOKIE["name"];

print "<?xml version=\"1.0\" encoding=\"utf-8\"?>";

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Add Message Page</title>
        <link rel="stylesheet" type="text/css" href="style.css" />
        <script type="text/javascript">
        //<![CDATA[
        function load() {
            var name = "<?php print $name; ?>";

            window.parent.frames["message"].document.getElementById("username").setAttribute("value", name);
            //document.getElementById("username").setAttribute("value", name);

            setTimeout("document.getElementById('msg').focus()",100);
        }
        function select(color) {
            document.getElementById("color").value=color;
        }
        function showList() {
            window.open("list.php");
        }
        //]]>
        </script>
    </head>

    <body style="text-align: left" onload="load()">
        <form action="add_message.php" method="post">
            <table border="0" cellspacing="5" cellpadding="0">
                <tr>
                    <td>What is your message?</td>
                </tr>
                <tr>
                    <td><input class="text" type="text" name="message" id="msg" style= "width: 780px" /></td>
                </tr>
                <tr>
                    <td><input class="button" type="submit" value="Send Your Message" style="width: 200" /></td>
                </tr>
                <tr>
                    <td>Please select a color:
                        <div style="position: relative;">
                            <div style="background-color:black;left:0px" onclick="select('black')"></div>
                            <div style="background-color:yellow;left:20px" onclick="select('yellow')"></div>
                            <div style="background-color:green;left:40px" onclick="select('green')"></div>
                            <div style="background-color:cyan;left:60px" onclick="select('cyan')"></div>
                            <div style="background-color:blue;left:80px" onclick="select('blue')"></div>
                            <div style="background-color:magenta;left:100px" onclick="select('magenta')"></div>
                        </div>
                        <input type="hidden" name="color" id="color" value="black" />
                    </td>
                </tr>
            </table>
        </form>
        
        <!--logout button-->
        <table border="0" cellspacing="5" cellpadding="0">
            <tr>
                <td><input class="button"  type="button" value="Show online user list" style="width: 200" onclick="showList()" /></td>
                <td>
                    <form action="logout.php" method="post">
                        <input class="button" type="submit" value="Logout" style="width: 200" />
                    </form>
                </td>
            </tr>
        </table>

    </body>
</html>
