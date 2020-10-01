<?php include ('include/top.php'); ?>

<div id="page-content">
	
	This is v-404.php
	
	<?php
	echo ('<pre>');
	print_r ($urlParts);
	echo ('</pre>');
	
	echo ('<p>Page: ' . $page . '</p>');

	echo ('<pre>');
	print_r ($_GET);
	echo ('</pre>');
	
	echo ('<pre>');
	print_r ($_POST);
	echo ('</pre>');
	
	echo ('<pre>');
	print_r ($_SERVER);
	echo ('</pre>');
	
	?>
	
</div>

<?php include ('include/bottom.php'); ?>