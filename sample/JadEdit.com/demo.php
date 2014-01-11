<!DOCTYPE html>
<html>
<head>
	<title></title>
	<link href="/styles/default.css" rel="stylesheet" type="text/css"/>
	<link href="/styles/demo.css" rel="stylesheet" type="text/css"/>
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
	<h1>Create New Article</h1>
	<p>
		This is a typical scenario where JadEdit could be used. The contents you type will not be stored.
		It will only be used to generate the result page.
	</p>
	<br/>
	<form action='/result.php' method='post'>
		<div class='editor-row'>
			<p>Article Title</p>
			<input type='text' name='title' class='editor' required='required' />
		</div>
		<div class='editor-row'>
			<p>Author</p>
			<input type='text' name='author' class='editor' required='required' />
		</div>
		<div class='editor-row'>
			<p>Article Contents</p>
			<div id="jadedit" name="contents">
			</div>
		</div>
		<input type="submit" class='button' value='Create Article!'/>
	</form>
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