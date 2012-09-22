<?php

$tmpl = join("",file(((int)$_REQUEST[template]?(int)$_REQUEST[template]:"1") . ".html"));
echo $tmpl;

