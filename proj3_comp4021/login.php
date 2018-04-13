<?php

// if name is not in the post data, exit
if (!isset($_POST["name"])) {
    header("Location: error.html");
    exit;
}

require_once('xmlHandler.php');

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

$user_elements = $xmlh->getChildNodes("user");
for ($i = 0; $i < $user_elements->length; $i++){
	$name = $user_elements[$i]->getAttribute('name');
	if ($name == $_POST["name"]){
		$xmlh->saveFile();
		exit ('<script type="text/javascript">
			    window.alert("User name already exists.");
			    window.location.href="login.html";
			    </script>');
		break;
	}
}

// create a 'user' element
$user_element = $xmlh->addElement($users_element, "user");

// add the user name
$xmlh->setAttribute($user_element, "name", $_POST["name"]);
$target_dir = "images/";
if(!is_dir($target_dir)){
	   mkdir($target_dir);
	}
$target_file = $target_dir . $_POST["name"] . "_" . basename($_FILES["userfile"]["name"]);
$xmlh->setAttribute($user_element, "filesrc", $target_file);
// save the XML file
$xmlh->saveFile();

// set the name to the cookie
setcookie("name", $_POST["name"]);

//handle the file
if (is_uploaded_file($_FILES['userfile']['tmp_name'])) {
	/*$target_dir = "images/";
	if(!is_dir($target_dir)){
		   mkdir($target_dir);
		}
	$target_file = $target_dir . basename($_FILES["userfile"]["name"]);*/
	//$target_file = $target_dir . $_POST["name"];
	$uploadOk = 1;
	// Check if image file is a actual image or fake image
	/*if(isset($_POST["submit"])) {
	    $check = getimagesize($_FILES["userfile"]["tmp_name"]);
	    if($check !== false) {
	        echo "File is an image - " . $check["mime"] . ".";
	        $uploadOk = 1;
	    } else {
	        echo "File is not an image.";
	        $uploadOk = 0;
	    }
	}
	// Check if file already exists
	if (file_exists($target_file)) {
		exit ('<script type="text/javascript">
			    window.alert("Sorry, file already exists.");
			    window.location.href="logout.php";
			    </script>');
	    $uploadOk = 0;
	}
	// Check file size
	if ($_FILES["userfile"]["size"] > 640000) {
	    exit "Sorry, your file is too large.";
	    $uploadOk = 0;
	}
	// Allow certain file formats
	$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
	if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
	&& $imageFileType != "gif" ) {
	    exit "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
	    $uploadOk = 0;
	}
	*/

	// Check if $uploadOk is set to 0 by an error
	if ($uploadOk == 0) {
	    exit ('<script type="text/javascript">
			    window.alert("Sorry, your file was not uploaded.");
			    window.location.href="logout.php";
			    </script>');
	// if everything is ok, try to upload file
	} else {
	    if (move_uploaded_file($_FILES["userfile"]["tmp_name"], $target_file)) {
	        //echo "The file ". basename( $_FILES["userfile"]["name"]). " has been uploaded.";
	        header("Location: client.php");
	    } else {
	        exit ('<script type="text/javascript">
			    window.alert("Sorry, there was an error uploading your file.");
			    window.location.href="logout.php";
			    </script>');
	    }
	}
}
else{
	switch($_FILES['userfile']['error']){
	    case 0: //no error; possible file attack!
	      exit ('<script type="text/javascript">
			    window.alert("There was a problem with your upload.");
			    window.location.href="logout.php";
			    </script>');
	      break;
	    case 1: //uploaded file exceeds the upload_max_filesize directive in php.ini
	      exit ('<script type="text/javascript">
			    window.alert("The file you are trying to upload is too big.");
			    window.location.href="logout.php";
			    </script>');
	      break;
	    case 2: //uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the html form
	      exit ('<script type="text/javascript">
			    window.alert("The file you are trying to upload is too big.");
			    window.location.href="logout.php";
			    </script>');
	      break;
	    case 3: //uploaded file was only partially uploaded
	      exit ('<script type="text/javascript">
			    window.alert("The file you are trying upload was only partially uploaded.");
			    window.location.href="logout.php";
			    </script>');
	      break;
	    case 4: //no file was uploaded
	      exit ('<script type="text/javascript">
			    window.alert("You must select an image for upload.");
			    window.location.href="logout.php";
			    </script>');
	      break;
	    default: //a default error, just in case!  :)
	      exit ('<script type="text/javascript">
			    window.alert("There was a problem with your upload.");
			    window.location.href="logout.php";
			    </script>');
	      break;
	 }
}

// Cookie done, redirect to client.php (to avoid reloading of page from the client)
// header("Location: client.php");

?>
