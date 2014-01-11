<!DOCTYPE html>
<html>
<head>
	<title></title>
	<link href="/styles/demo.css" rel="stylesheet" type="text/css"/>
	<link href="/styles/default.css" rel="stylesheet" type="text/css"/>
</head>
<body>
<header>
	<nav>
		<ul>
			<li>
				<a href="https://github.com/WonSong/JadEdit">
					FORK ME ON GITHUB
				</a>
			</li>
						<li>
            				<a href="/demo.php">DEMO</a>
            			</li>
			<li>
				<a href="http://wys.io">
					NETWORK WITH ME
				</a>
			</li>
		</ul>
	</nav>
</header>
<div class='contents'>
	<h1><?php echo $_POST["title"]; ?></h1>
	<h4 class='info'>
	By <?php echo $_POST["author"]; ?><br/>
	On <?php echo(Date("l F d, Y")); ?>
	</h4>
	<br/>
	<div>
	<?php echo $_POST["contents"]; ?>
	</div>
</div>
<footer>
	<div class="copyright">
		Copyright © 2014 <a href="http://wys.io/">Won Song</a> and the <a href="https://github.com/WonSong/JadEdit/blob/master/CONTRIBUTORS.md">contributors</a>. All Rights Reserved.<br />
		Released under <a href="https://github.com/WonSong/JadEdit/blob/master/LICENSE">the MIT license.</a>
	</div>
</footer>
<script src="/scripts/jadedit.min.js"></script>
</body>
</html>