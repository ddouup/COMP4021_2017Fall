<?php

if (!isset($_COOKIE["name"])) {
    header("Location: error.html");
    return;
}

// get the name from cookie
$name = $_COOKIE["name"];

// get the message content
$message = $_POST["message"];
if (trim($message) == "") $message = "__EMPTY__";

require_once('xmlHandler.php');

$my_color = $_POST['color'];
// create the chatroom xml file handler
$xmlh = new xmlHandler("chatroom.xml");
if (!$xmlh->fileExist()) {
    header("Location: error.html");
    exit;
}

// create the following DOM tree structure for a message
// and add it to the chatroom XML file
//
// <message name="...">...</message>
//

// open the existing XML file
$xmlh->openFile();

// Get the 'messages' element as the current element
$messages_element = $xmlh->getElement("messages");

// Create a 'message' element for each message
$message_element = $xmlh->addElement($messages_element, "message");

// Add the name
$xmlh->setAttribute($message_element, "name", $name);

// Add the color
$xmlh->setAttribute($message_element, "color", $my_color);

// Add the content of the message
$xmlh->addText($message_element, $message);

// save the XML file
$xmlh->saveFile();


header("Location: client.php");

?>
