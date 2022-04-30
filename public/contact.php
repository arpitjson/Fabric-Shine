<?php

$name = strip_tags(htmlspecialchars($_POST['name']));
$email = strip_tags(htmlspecialchars($_POST['email']));
$phone = strip_tags(htmlspecialchars($_POST['phone']));
$message = strip_tags(htmlspecialchars($_POST['message']));

$to = "amazonlogg@gmail.com"; // Change this email to your //
$subject = "Order Received";
$body = "You have received a new message from your website contact form.\n\n"."Here are the details:\n\nName: $name\n\n\nEmail: $email\n\nPhone No: $phone\n\nMessage: $message";
$header = "From: $email";
$header .= "Reply-To: $email";	

if(!mail($to, $subject, $body, $header)){
  http_response_code(500);
}
else
{
   header("Location: fabric-shine/index.html"); /* Redirect browser */
   exit(); 
}
?>
