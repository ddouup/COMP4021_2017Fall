<?php 

require_once('xmlHandler.php');

if (!isset($_COOKIE["name"])) {
    header("Location: error.html");
    exit;
}

// create the chatroom xml file handler
$xmlh = new xmlHandler("chatroom.xml");
if (!$xmlh->fileExist()) {
    header("Location: error.html");
    exit;
}

// open the existing XML file
$xmlh->openFile();

// get the 'users' element
$users_element = $xmlh->getElement("users");

// get the user element
$index = -1;
$user_elements = $xmlh->getChildNodes("user");
echo "User numbers: ".$user_elements->length."\n";
for ($i = 0; $i < $user_elements->length; $i++){
	$name = $user_elements[$i]->getAttribute('name');
	if ($name == $_COOKIE["name"]){
		$delete = unlink($user_elements[$i]->getAttribute("filesrc"));
		$index = $i;
		break;
	}
}
if ($index < 0){
	echo "User already logout.";
}
else{
$user_element = $xmlh->getElement("user", $index);

$xmlh->removeElement($users_element, $user_element);
}

// save the XML file
$xmlh->saveFile();

// delete the cookie
setcookie("name");

// Cookie done, redirect to client.php (to avoid reloading of page from the client)
header("Location: login.html");

?>
